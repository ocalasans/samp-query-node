const dgram = require('dgram');
const crypto = require('crypto');
const dns = require('dns');
const { promisify } = require('util');
const EventEmitter = require('events');

const Server_Settings = {
    HEADER: 'SAMP',
    DEFAULT_PORT: 7777,
    MAX_PLAYERS: 100,
    MAX_PACKET_SIZE: 2048
};

const Network_Config = {
    TIMEOUT: 1000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 150,
    DNS_CACHE_TIME: 300000,
    LATENCY: {
        SAMPLES: 5,
        CHECK_INTERVAL: 50,
        TIMEOUT: 2000,
        MAX_VALID_PING: 800
    }
};

const Query_Types = {
    INFO: 'i',
    RULES: 'r',
    PLAYERS: 'd',
    PING: 'p'
};

class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }

    async Get_IP_Address(host_name) {
        const cached_entry = this.cache.get(host_name);
        if (cached_entry && (Date.now() - cached_entry.timestamp < Network_Config.DNS_CACHE_TIME))
            return cached_entry.ip;

        try {
            const [ip_address] = await this.Resolve_DNS(host_name);
            this.cache.set(host_name, { ip: ip_address, timestamp: Date.now() });
            return ip_address;
        }
        catch {
            return host_name;
        }
    }
}

class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }

    Start_Query(query_id, timeout_duration) {
        const timeout_id = setTimeout(() => this.Finish_Query(query_id), timeout_duration);
        this.Active_Queries.set(query_id, timeout_id);
    }

    Finish_Query(query_id) {
        const timeout_id = this.Active_Queries.get(query_id);
        if (timeout_id) {
            clearTimeout(timeout_id);
            this.Active_Queries.delete(query_id);
            this.emit(`query_${query_id}_complete`);
        }
    }
}

class SAMP_Strings {
    static charset = (() => {
        const base_chars = Array.from({ length: 128 }, (_, i) => String.fromCharCode(i));
        const samp_special_chars = [
            '€', '?', '‚', 'ƒ', '„', '…', '†', '‡', 'ˆ', '‰', 'Š', '‹', 'Œ', '?', 'Ž', '?',
            '?', '‘', '’', '“', '”', '•', '–', '—', '˜', '™', 'š', '›', 'œ', '?', 'ž', 'Ÿ',
            'Ą', 'Ę', 'Ć', '¤', 'Ł', 'Ń', '§', 'Ś', '©', 'Ş', '«', '¬', '­', '®', 'Ż', '°',
            '±', 'ą', 'ę', 'ć', '£', 'ł', 'ń', 'ş', 'ż', 'ś', '˘', '»', '˝', 'ź', '„', '”'
        ];
        return [...base_chars, ...samp_special_chars];
    })();

    static Decode_String(buffer_data) {
        if (!Buffer.isBuffer(buffer_data))
            return '';
        
        return Array.from(buffer_data).map(byte => byte < this.charset.length ? this.charset[byte] : '?').join('').replace(/[\x00-\x1F\x7F-\x9F]/g, '').trim();
    }
}

class Samp_Query {
    constructor() {
        this.DNS_Cache_Manager = new DNS_Cache();
        this.Query_Manager = new Query_Manager();
    }

    Create_Query_Packet(server_ip, port, query_type) {
        const packet = Buffer.alloc(11);
        packet.write(Server_Settings.HEADER);
        
        server_ip.split('.').forEach((octet, index) => {
            packet[index + 4] = parseInt(octet, 10);
        });
        
        packet[8] = port & 0xFF;
        packet[9] = (port >> 8) & 0xFF;
        packet[10] = query_type.charCodeAt(0);
        
        return packet;
    }

    async Measure_Server_Latency(server_config) {
        return new Promise((resolve) => {
            const socket = dgram.createSocket('udp4');
            const ping_results = [];
            let attempt_count = 0;
            let is_socket_closed = false;

            const Close_Socket = () => {
                if (!is_socket_closed) {
                    is_socket_closed = true;
                    try {
                        socket.close();
                    } catch {}
                }
            };

            const Send_Ping = () => {
                if (is_socket_closed)
                    return null;
                
                const packet = this.Create_Query_Packet(server_config.host, server_config.port, Query_Types.INFO);
                const start_time = process.hrtime.bigint();
                socket.send(packet, 0, packet.length, server_config.port, server_config.host);

                return start_time;
            };

            let timeout_id;
            let ping_start_time;

            const Update_Timeout = () => {
                if (timeout_id)
                    clearTimeout(timeout_id);

                timeout_id = setTimeout(() => {
                    Close_Socket();
                    const avg_latency = ping_results.length > 0 ? Math.round(ping_results.reduce((a, b) => a + b) / ping_results.length) : 999;
                    resolve(avg_latency);
                }, Network_Config.LATENCY.TIMEOUT);
            };

            socket.on('listening', () => {
                socket.setTTL(128);
                socket.setBroadcast(false);
            });

            socket.on('message', () => {
                if (is_socket_closed)
                    return;
                
                const end_time = process.hrtime.bigint();
                const duration = Number(end_time - ping_start_time) / 1_000_000;
                
                if (duration > 1 && duration < 1000)
                    ping_results.push(duration);
                
                if (attempt_count < Network_Config.LATENCY.SAMPLES - 1) {
                    attempt_count++;
                    setTimeout(() => {
                        if (!is_socket_closed) {
                            ping_start_time = Send_Ping();
                            Update_Timeout();
                        }
                    }, Network_Config.LATENCY.CHECK_INTERVAL);
                }
                else {
                    Close_Socket();
                    resolve(ping_results.length > 0 
                        ? Math.round(ping_results.reduce((a, b) => a + b) / ping_results.length)
                        : 999);
                }
            });

            socket.on('error', () => {
                Close_Socket();
                resolve(999);
            });

            ping_start_time = Send_Ping();
            Update_Timeout();
        });
    }

    Parse_Server_Info(server_data) {
        if (!server_data || server_data.length < 11)
            return null;
        
        try {
            let position = 0;
            const server_info = {
                passworded: Math.min(1, Math.max(0, server_data.readUInt8(position++))),
                players: Math.max(0, server_data.readUInt16LE(position)),
                maxplayers: Math.max(0, server_data.readUInt16LE(position + 2))
            };
            position += 4;

            let string_length = server_data.readUInt32LE(position);
            position += 4;

            if (position + string_length > server_data.length)
                return null;

            server_info.hostname = SAMP_Strings.Decode_String(server_data.slice(position, position + string_length));
            position += string_length;

            if (position + 4 > server_data.length)
                return null;

            string_length = server_data.readUInt32LE(position);
            position += 4;

            if (position + string_length > server_data.length)
                return null;

            server_info.gamemode = SAMP_Strings.Decode_String(server_data.slice(position, position + string_length));
            position += string_length;

            if (position + 4 > server_data.length)
                return null;

            string_length = server_data.readUInt32LE(position);
            position += 4;

            if (position + string_length > server_data.length)
                return null;

            server_info.language = SAMP_Strings.Decode_String(server_data.slice(position, position + string_length));

            return server_info;
        }
        catch {
            return null;
        }
    }

    Parse_Server_Rules(rules_data) {
        if (!rules_data || rules_data.length < 2)
            return {};
        
        try {
            let position = 0;
            const server_rules = {};
            const rules_count = Math.min(rules_data.readUInt16LE(position), 50);
            position += 2;

            for (let i = 0; i < rules_count && position < rules_data.length - 1; i++) {
                const name_length = rules_data.readUInt8(position++);

                if (position + name_length > rules_data.length)
                    break;
                
                const rule_name = SAMP_Strings.Decode_String(rules_data.slice(position, position + name_length));
                position += name_length;

                if (position >= rules_data.length)
                    break;

                const value_length = rules_data.readUInt8(position++);
                
                if (position + value_length > rules_data.length)
                    break;
                
                const rule_value = SAMP_Strings.Decode_String(rules_data.slice(position, position + value_length));

                if (rule_name && rule_value)
                    server_rules[rule_name] = rule_value;

                position += value_length;
            }

            return this.Process_Rules(server_rules);
        } catch {
            return {};
        }
    }

    Process_Rules(raw_rules) {
        const processed_rules = Object.fromEntries(Object.entries(raw_rules).filter(([_, value]) => value != null));

        return {
            ...processed_rules,
            lagcomp: raw_rules.lagcomp === 'On' ? 'On' : 'Off',
            weather: raw_rules.weather ? parseInt(raw_rules.weather, 10) || 0 : 0
        };
    }

    Parse_Player_List(player_data) {
        if (!player_data || player_data.length < 2)
            return [];
        
        try {
            let position = 0;
            const player_count = Math.min(player_data.readUInt16LE(position), Server_Settings.MAX_PLAYERS);
            position += 2;
            const player_list = [];

            for (let i = 0; i < player_count && position < player_data.length - 1; i++) {
                try {
                    const player_info = {
                        id: Math.max(0, player_data.readUInt8(position++)),
                    };

                    const name_length = player_data.readUInt8(position++);

                    if (position + name_length > player_data.length)
                        break;

                    player_info.name = SAMP_Strings.Decode_String(player_data.slice(position, position + name_length));
                    position += name_length;

                    if (position + 8 > player_data.length)
                        break;

                    player_info.score = Math.max(0, player_data.readUInt32LE(position));
                    position += 4;
                    player_info.ping = Math.max(0, player_data.readUInt32LE(position));
                    position += 4;

                    if (player_info.name)
                        player_list.push(player_info);
                }
                catch {
                    continue;
                }
            }

            return player_list;
        } catch {
            return [];
        }
    }

    async Query_Server(server_config, query_type, custom_timeout = null) {
        return new Promise((resolve) => {
            let retry_count = 0;
            const query_timeout = custom_timeout || server_config.timeout;
            const query_id = crypto.randomBytes(16).toString('hex');

            const Attempt_Query = async () => {
                return new Promise((resolve_attempt) => {
                    const socket = dgram.createSocket('udp4');
                    let is_socket_closed = false;
                    let has_response = false;

                    const Close_Socket = () => {
                        if (!is_socket_closed) {
                            is_socket_closed = true;

                            try {
                                socket.close();
                            }
                            catch {}
                        }
                    };

                    socket.on('listening', () => {
                        socket.setTTL(128);
                        socket.setBroadcast(false);
                    });

                    const timeout_id = setTimeout(() => {
                        if (!has_response) {
                            Close_Socket();
                            resolve_attempt(null);
                        }
                    }, query_timeout);

                    try {
                        const packet = this.Create_Query_Packet(server_config.host, server_config.port, query_type);
                        socket.send(packet, 0, packet.length, server_config.port, server_config.host);
                    }
                    catch {
                        clearTimeout(timeout_id);
                        Close_Socket();
                        resolve_attempt(null);
                    }

                    socket.on('message', (response) => {
                        if (!has_response && response.length <= Server_Settings.MAX_PACKET_SIZE) {
                            has_response = true;
                            clearTimeout(timeout_id);
                            Close_Socket();
                            
                            const response_data = response.slice(11);
                            let parsed_data;
                            
                            switch (query_type) {
                                case Query_Types.INFO:
                                    parsed_data = this.Parse_Server_Info(response_data);
                                    break;
                                case Query_Types.RULES:
                                    parsed_data = this.Parse_Server_Rules(response_data);
                                    break;
                                case Query_Types.PLAYERS:
                                    parsed_data = this.Parse_Player_List(response_data);
                                    break;
                                default:
                                    parsed_data = null;
                            }
                            
                            resolve_attempt(parsed_data);
                        }
                    });

                    socket.on('error', () => {
                        if (!has_response) {
                            clearTimeout(timeout_id);
                            Close_Socket();
                            resolve_attempt(null);
                        }
                    });
                });
            };

            const Execute_Query = async () => {
                const result = await Attempt_Query();
                
                if (result)
                    resolve(result);

                else if (retry_count < Network_Config.MAX_RETRIES) {
                    retry_count++;
                    setTimeout(Execute_Query, Network_Config.RETRY_DELAY);
                }

                else
                    resolve(null);
            };

            this.Query_Manager.Start_Query(query_id, query_timeout * (Network_Config.MAX_RETRIES + 1));
            Execute_Query();
        });
    }

    async Get_Server_Info(server_options) {
        const server_config = typeof server_options === 'string' ? { host: server_options, port: Server_Settings.DEFAULT_PORT, timeout: Network_Config.TIMEOUT } : { 
                host: server_options.host,
                port: server_options.port || Server_Settings.DEFAULT_PORT,
                timeout: server_options.timeout || Network_Config.TIMEOUT
            };

        const server_info = {
            address: server_config.host,
            port: server_config.port,
            players: [],
            rules: {},
            queryTime: Date.now()
        };

        try {
            server_config.host = await this.DNS_Cache_Manager.Get_IP_Address(server_config.host);
            
            const [basic_info, server_rules] = await Promise.all([
                this.Query_Server(server_config, Query_Types.INFO, 1500),
                this.Query_Server(server_config, Query_Types.RULES, 2000)
            ]);

            if (!basic_info)
                return server_info;

            Object.assign(server_info, {
                hostname: basic_info.hostname || '',
                gamemode: basic_info.gamemode || '',
                language: basic_info.language || '',
                password: Boolean(basic_info.passworded),
                maxPlayers: Math.max(0, basic_info.maxplayers || 0),
                onlinePlayers: Math.max(0, basic_info.players || 0),
            });

            if (server_rules)
                server_info.rules = server_rules;

            const latency_promise = this.Measure_Server_Latency(server_config);
            const players_promise = server_info.onlinePlayers <= Server_Settings.MAX_PLAYERS ? this.Query_Server(server_config, Query_Types.PLAYERS, 1500) : Promise.resolve(null);

            const [server_ping, player_list] = await Promise.all([latency_promise, players_promise]);
            
            server_info.ping = server_ping;

            if (player_list)
                server_info.players = player_list;

            if (!server_rules && Object.keys(server_info.rules).length === 0) {
                const retry_rules = await this.Query_Server(server_config, Query_Types.RULES, 3000);

                if (retry_rules)
                    server_info.rules = retry_rules;
            }

            return server_info;
        }
        catch {
            return server_info;
        }
    }
}

const Global_SAMP_Client = new Samp_Query();

module.exports = function(server_options, callback) {
    Global_SAMP_Client.Get_Server_Info(server_options).then(info => callback(null, info)).catch(() => callback(null, {
        address: typeof server_options === 'string' ? server_options : server_options.host,
        port: (typeof server_options === 'string' ? Server_Settings.DEFAULT_PORT : server_options.port) || Server_Settings.DEFAULT_PORT,
        players: [],
        rules: {},
        queryTime: Date.now()
    }));
};