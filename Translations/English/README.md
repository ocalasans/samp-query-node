# SA-MP Query Node
A complete API for **Node.js** environments, designed for querying SA-MP (San Andreas Multiplayer) servers and compatible with OPEN.MP (Open Multiplayer). It offers advanced monitoring and real-time data collection features.

### Languages

- **Português** > [README](https://github.com/ocalasans/samp-query-node)
- **Español** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Espanol)
- **Polski** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Polski)
- **Türk** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Turk)
- **Deutsch** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Deutsch)
- **Русский** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Русский)
- **Français** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Francais)
- **Italiano** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Italiano)
- **Svenska** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Svenska)

## Table of Contents

- [SA-MP Query Node](#sa-mp-query-node)
    - [Languages](#languages)
  - [Table of Contents](#table-of-contents)
  - [About the API](#about-the-api)
  - [Installation](#installation)
  - [Features](#features)
    - [Main Query System](#main-query-system)
  - [API Structure](#api-structure)
    - [Main Classes](#main-classes)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [DNS Cache System](#dns-cache-system)
  - [Latency System](#latency-system)
    - [Ping Measurement](#ping-measurement)
    - [Usage Examples](#usage-examples)
      - [1. Basic Query](#1-basic-query)
      - [2. Query with Custom Options](#2-query-with-custom-options)
      - [3. Using Promises](#3-using-promises)
      - [4. Continuous Monitoring](#4-continuous-monitoring)
  - [Error Handling](#error-handling)
    - [1. Connection Errors](#1-connection-errors)
    - [2. Timeouts](#2-timeouts)
    - [3. Data Validation](#3-data-validation)
  - [Performance Considerations](#performance-considerations)
    - [Implemented Optimizations](#implemented-optimizations)
  - [Technical Limitations](#technical-limitations)
  - [Response Structure](#response-structure)
  - [SA-MP Community](#sa-mp-community)

## About the API

**SA-MP Query Node** is an API specifically developed to interact with SA-MP servers, allowing the collection of detailed server information in real-time. The API uses SA-MP's native query protocol and implements various optimization layers to ensure efficient and reliable queries.

The API was designed focusing on:
- Query reliability
- Processing efficiency
- Ease of use
- Robust error handling
- Complete support for all SA-MP protocol features

## Installation

Clone the repository to your local machine:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Features

### Main Query System

The API offers a complete query system that allows you to obtain:

1. **Basic Server Information:**
   - Server name
   - Current gamemode
   - Configured language
   - Password protection status
   - Maximum number of players
   - Current number of online players

2. **Detailed Player List:**
   - Player ID
   - Player name
   - Current score
   - Player latency (ping)

3. **Server Rules:**
   - Lag compensation settings
   - Current weather
   - Other custom rules defined by the server

4. **Performance Measurements:**
   - Server latency (ping)
   - Query response time
   - Connection statistics

## API Structure

### Main Classes

#### 1. DNS_Cache
```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

The **DNS_Cache** class is responsible for:
- Temporarily storing DNS resolutions
- Optimizing repeated queries
- Reducing connection latency
- Managing cache lifetime

Main methods:
- `Get_IP_Address(host_name)`: Resolves and caches IP addresses
- Automatic caching with configurable duration (default: 5 minutes)
- Fallback to hostname in case of resolution failure

#### 2. Query_Manager
```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

The **Query_Manager** controls:
- Active query management
- Timeouts and retries
- Query completion events
- Expired query cleanup

Features:
- Automatic retry system
- Timeout control
- Multiple simultaneous query management
- Completion event emission

#### 3. SAMP_Strings
```javascript
class SAMP_Strings {
    static charset = [/* SA-MP character set */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Responsible for:
- SA-MP string decoding
- Special character support
- String cleaning and sanitization
- Buffer to text conversion

## DNS Cache System

The DNS cache system is a crucial part of the API, implementing:

1. **Cache Management:**
   - Efficient DNS resolution storage
   - Temporal validity checking
   - Automatic cleanup of old entries

2. **Performance Optimization:**
   - Reduction of redundant DNS queries
   - Response time improvement
   - Network resource savings

3. **Cache Settings:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 minutes
   ```

4. **Failure Handling:**
   - Fallback to original hostname
   - Automatic retry on temporary failures
   - Resolution error logging

## Latency System

### Ping Measurement

The latency measurement system implements:

1. **Sample Collection:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Result Processing:**
   - Latency average calculation
   - Outlier filtering
   - Timeout detection

3. **Optimizations:**
   - Multiple samples for accuracy
   - Configurable intervals
   - Independent timeouts

### Usage Examples

#### 1. Basic Query
```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (error, response) => {
    if (error) {
        console.error('Query error:', error);
        return;
    }
    
    console.log('Server information:', response);
});
```

#### 2. Query with Custom Options
```javascript
const options = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // 1.5 seconds timeout
};

query(options, (error, response) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Server name:', response.hostname);
    console.log('Players:', response.onlinePlayers);
    console.log('Gamemode:', response.gamemode);
    
    // Processing player list
    response.players.forEach(player => {
        console.log(`${player.name}: ${player.score} points`);
    });
});
```

#### 3. Using Promises
```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Query_Server() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Server:', info.hostname);
        console.log('Players:', info.onlinePlayers);
        console.log('Ping:', info.ping, 'ms');
        
        // Processing server rules
        if (info.rules.lagcomp === 'On') {
            console.log('Server with lag compensation enabled');
        }
        
        // Listing top players
        const topPlayers = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTop 5 Players:');
        topPlayers.forEach((player, index) => {
            console.log(`${index + 1}. ${player.name}: ${player.score} points`);
        });
        
    } catch (error) {
        console.error('Error querying server:', error);
    }
}
```

#### 4. Continuous Monitoring
```javascript
async function Monitor_Server(address, interval = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Starting monitoring of ${address}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(address);
            
            console.log('\n=== Server Status ===');
            console.log(`Time: ${new Date().toLocaleString()}`);
            console.log(`Players: ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping: ${info.ping}ms`);
            console.log(`Mode: ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nOnline Players:');
                info.players.forEach(player => {
                    console.log(`- ${player.name} (Ping: ${player.ping}ms)`);
                });
            }
            
        } catch (error) {
            console.error('Monitoring error:', error);
        }
    }, interval);
}
```

## Error Handling

The API implements a robust error handling system:

### 1. Connection Errors
```javascript
query('127.0.0.1:7777', (error, response) => {
    if (!response.hostname) {
        console.log('Server offline or inaccessible');
    }
});
```

### 2. Timeouts
```javascript
const options = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 seconds
};

query(options, (error, response) => {
    if (error) {
        console.log('Server did not respond within the time limit');
    }
});
```

### 3. Data Validation
```javascript
query('127.0.0.1:7777', (error, response) => {
    // Safety checks
    if (response.onlinePlayers > response.maxPlayers) {
        console.log('Inconsistent data received');
        return;
    }
    
    // Player validation
    response.players = response.players.filter(player => {
        return player.name && player.score >= 0 && player.ping >= 0;
    });
});
```

## Performance Considerations

### Implemented Optimizations

1. **DNS Cache:**
   - Reduces repeated DNS queries
   - Configurable cache lifetime
   - Automatic cache cleanup

2. **Connection Management:**
   - Socket reuse when possible
   - Optimized timeouts
   - Intelligent retry system

3. **Data Processing:**
   - Efficient packet parsing
   - Optimized data validation
   - Efficient memory management

4. **Latency Measurement:**
   - Multiple samples for accuracy
   - Outlier filtering
   - Optimized average calculation

## Technical Limitations

1. **Protocol Limitations:**
   - Maximum packet size: 2048 bytes
   - Maximum queryable players: 100
   - Default timeout: 1000ms

2. **Cache Limitations:**
   - Maximum DNS cache time: 5 minutes
   - Cache entry limit

3. **Network Limitations:**
   - Maximum of 3 attempts per query
   - Minimum interval between attempts: 150ms
   - Maximum valid ping: 800ms

4. **Data Limitations:**
   - Maximum string size
   - Maximum number of server rules
   - Special character limitations

## Response Structure

The API returns a detailed object with all server information:

```javascript
{
    // Basic information
    address: "127.0.0.1", // Server address
    port: 7777, // Server port
    hostname: "Server", // Server name
    gamemode: "RolePlay", // Game mode
    language: "English", // Language
    
    // Server status
    password: false, // Password protection
    maxPlayers: 100, // Maximum players
    onlinePlayers: 45, // Online players
    ping: 58, // Latency in ms
    queryTime: 1635789012345, // Query timestamp
    
    // Player list
    players: [
        {
            id: 0, // Player ID
            name: "Calasans", // Name
            score: 63, // Score
            ping: 117 // Player ping
        },
    ],
    
    // Server rules
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Allowed client versions
        artwork: 1, // Artwork enablement
        lagcomp: "On", // Lag comp status
        mapname: "San Andreas", // Map name
        version: "0.3.7", // Server version
        weather: 10, // Weather ID
        weburl: "website.com", // Server website URL
        worldtime: "12:00" // Server world time
    }
}
```

## SA-MP Community

- [SA-MP Programming Community](https://discord.com/invite/3fApZh66Tf)