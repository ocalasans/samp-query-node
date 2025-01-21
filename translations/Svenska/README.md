# samp-query-node

Ett komplett API för **Node.js**-miljöer, designat för att söka SA-MP-servrar (San Andreas Multiplayer) och kompatibelt med OPEN.MP (Open Multiplayer). Erbjuder avancerade funktioner för övervakning och insamling av realtidsinformation.

### Språk

- Português: [README](../../)
- Deutsch: [README](../Deutsch/README.md)
- English: [README](../English/README.md)
- Español: [README](../Espanol/README.md)
- Français: [README](../Francais/README.md)
- Italiano: [README](../Italiano/README.md)
- Polski: [README](../Polski/README.md)
- Русский: [README](../Русский/README.md)
- Türkçe: [README](../Turkce/README.md)

## Innehållsförteckning

- [samp-query-node](#samp-query-node)
    - [Språk](#språk)
  - [Innehållsförteckning](#innehållsförteckning)
  - [Om API:et](#om-apiet)
  - [Installation](#installation)
  - [Funktioner](#funktioner)
    - [Huvudsökningssystem](#huvudsökningssystem)
  - [API-struktur](#api-struktur)
    - [Huvudklasser](#huvudklasser)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [DNS Cache-system](#dns-cache-system)
  - [Latens-system](#latens-system)
    - [Ping-mätning](#ping-mätning)
    - [Användningsexempel](#användningsexempel)
      - [1. Grundläggande sökning](#1-grundläggande-sökning)
      - [2. Sökning med anpassade alternativ](#2-sökning-med-anpassade-alternativ)
      - [3. Användning av Promises](#3-användning-av-promises)
      - [4. Kontinuerlig övervakning](#4-kontinuerlig-övervakning)
  - [Felhantering](#felhantering)
    - [1. Anslutningsfel](#1-anslutningsfel)
    - [2. Timeouts](#2-timeouts)
    - [3. Datavalidering](#3-datavalidering)
  - [Prestandahänsyn](#prestandahänsyn)
    - [Implementerade optimeringar](#implementerade-optimeringar)
  - [Tekniska begränsningar](#tekniska-begränsningar)
  - [Svarsstruktur](#svarsstruktur)
  - [Licens](#licens)
    - [Villkor:](#villkor)

## Om API:et

**SA-MP Query Node** är ett API specifikt utvecklat för att interagera med SA-MP-servrar, vilket möjliggör insamling av detaljerad serverinformation i realtid. API:et använder SA-MP:s inbyggda sökningsprotokoll och implementerar flera optimeringslager för att säkerställa effektiva och pålitliga sökningar.

API:et har utformats med fokus på:
- Pålitliga sökningar
- Effektiv bearbetning
- Användarvänlighet
- Robust felhantering
- Fullständigt stöd för alla SA-MP-protokollfunktioner

## Installation

Klona repositoryt till din lokala maskin:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Funktioner

### Huvudsökningssystem

API:et erbjuder ett komplett sökningssystem som låter dig hämta:

1. **Grundläggande serverinformation:**
   - Servernamn
   - Aktuellt spelläge
   - Konfigurerat språk
   - Lösenordsskyddsstatus
   - Maximalt antal spelare
   - Aktuellt antal spelare online

2. **Detaljerad spelarlista:**
   - Spelar-ID
   - Spelarnamn
   - Aktuell poäng
   - Spelarens latens (ping)

3. **Serverregler:**
   - Laggkompensationsinställningar
   - Aktuellt väder
   - Andra anpassade regler definierade av servern

4. **Prestandamätningar:**
   - Serverlatens (ping)
   - Sökningstid
   - Anslutningsstatistik

## API-struktur

### Huvudklasser

#### 1. DNS_Cache

```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

Klassen **DNS_Cache** ansvarar för:
- Tillfällig lagring av DNS-upplösningar
- Optimering av upprepade sökningar
- Minskning av anslutningslatens
- Hantering av cache-livstid

Huvudmetoder:
- `Get_IP_Address(host_name)`: Löser och cachar IP-adresser
- Automatisk cachning med konfigurerbar varaktighet (standard: 5 minuter)
- Fallback till värdnamn vid misslyckad upplösning

#### 2. Query_Manager

```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

**Query_Manager** kontrollerar:
- Hantering av aktiva sökningar
- Timeouts och återförsök
- Sökningsslutförelsehändelser
- Rensning av utgångna sökningar

Funktionalitet:
- Automatiskt återförsökssystem
- Tidsgränskontroll
- Hantering av flera samtidiga sökningar
- Emission av slutförelsehändelser

#### 3. SAMP_Strings

```javascript
class SAMP_Strings {
    static charset = [/* SA-MP teckenuppsättning */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Ansvarar för:
- Avkodning av SA-MP-strängar
- Stöd för specialtecken
- Rensning och sanering av strängar
- Konvertering av buffertar till text

## DNS Cache-system

DNS cache-systemet är en avgörande del av API:et och implementerar:

1. **Cache-hantering:**
   - Effektiv lagring av DNS-upplösningar
   - Tidsgiltighetsverifiering
   - Automatisk rensning av gamla poster

2. **Prestandaoptimering:**
   - Minskning av redundanta DNS-sökningar
   - Förbättrad svarstid
   - Besparing av nätverksresurser

3. **Cache-inställningar:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 minuter
   ```

4. **Felhantering:**
   - Fallback till ursprungligt värdnamn
   - Automatiskt återförsök vid tillfälliga fel
   - Loggning av upplösningsfel

## Latens-system

### Ping-mätning

Latens-mätningssystemet implementerar:

1. **Provtagning:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Resultatbearbetning:**
   - Beräkning av genomsnittlig latens
   - Filtrering av avvikande värden
   - Timeout-detektering

3. **Optimeringar:**
   - Flera prover för precision
   - Konfigurerbara intervall
   - Oberoende timeouts

### Användningsexempel

#### 1. Grundläggande sökning

```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (fel, svar) => {
    if (fel) {
        console.error('Sökningsfel:', fel);
        return;
    }
    
    console.log('Serverinformation:', svar);
});
```

#### 2. Sökning med anpassade alternativ

```javascript
const alternativ = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // timeout på 1.5 sekunder
};

query(alternativ, (fel, svar) => {
    if (fel) {
        console.error('Fel:', fel);
        return;
    }
    
    console.log('Servernamn:', svar.hostname);
    console.log('Spelare:', svar.onlinePlayers);
    console.log('Spelläge:', svar.gamemode);
    
    // Bearbetning av spelarlista
    svar.players.forEach(spelare => {
        console.log(`${spelare.name}: ${spelare.score} poäng`);
    });
});
```

#### 3. Användning av Promises

```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Request_Server() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Server:', info.hostname);
        console.log('Spelare:', info.onlinePlayers);
        console.log('Ping:', info.ping, 'ms');
        
        // Bearbetning av serverregler
        if (info.rules.lagcomp === 'On') {
            console.log('Server med laggkompensation aktiverad');
        }
        
        // Lista toppspelare
        const toppSpelare = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTopp 5 Spelare:');
        toppSpelare.forEach((spelare, index) => {
            console.log(`${index + 1}. ${spelare.name}: ${spelare.score} poäng`);
        });
        
    } catch (fel) {
        console.error('Fel vid serverförfrågan:', fel);
    }
}
```

#### 4. Kontinuerlig övervakning

```javascript
async function Monitor_Server(adress, intervall = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Startar övervakning av ${adress}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(adress);
            
            console.log('\n=== Serverstatus ===');
            console.log(`Tid: ${new Date().toLocaleString()}`);
            console.log(`Spelare: ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping: ${info.ping}ms`);
            console.log(`Läge: ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nSpelare Online:');
                info.players.forEach(spelare => {
                    console.log(`- ${spelare.name} (Ping: ${spelare.ping}ms)`);
                });
            }
            
        } catch (fel) {
            console.error('Övervakningsfel:', fel);
        }
    }, intervall);
}
```

## Felhantering

API:et implementerar ett robust felhanteringssystem:

### 1. Anslutningsfel

```javascript
query('127.0.0.1:7777', (fel, svar) => {
    if (!svar.hostname) {
        console.log('Server offline eller otillgänglig');
    }
});
```

### 2. Timeouts

```javascript
const alternativ = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 sekunder
};

query(alternativ, (fel, svar) => {
    if (fel) {
        console.log('Servern svarade inte inom tidsgränsen');
    }
});
```

### 3. Datavalidering

```javascript
query('127.0.0.1:7777', (fel, svar) => {
    // Säkerhetskontroller
    if (svar.onlinePlayers > svar.maxPlayers) {
        console.log('Inkonsekvent data mottagen');
        return;
    }
    
    // Spelarvalidering
    svar.players = svar.players.filter(spelare => {
        return spelare.name && spelare.score >= 0 && spelare.ping >= 0;
    });
});
```

## Prestandahänsyn

### Implementerade optimeringar

1. **DNS Cache:**
   - Minskar upprepade DNS-sökningar
   - Cache med konfigurerbar livstid
   - Automatisk cache-rensning

2. **Anslutningshantering:**
   - Återanvändning av sockets när möjligt
   - Optimerade timeouts
   - Intelligent återförsökssystem

3. **Databehandling:**
   - Effektiv paketparsning
   - Optimerad datavalidering
   - Effektiv minneshantering

4. **Latensmätning:**
   - Flera prover för precision
   - Filter för avvikande värden
   - Optimerad genomsnittsberäkning

## Tekniska begränsningar

1. **Protokollbegränsningar:**
   - Maximal paketstorlek: 2048 bytes
   - Maximalt antal sökbara spelare: 100
   - Standard timeout: 1000ms

2. **Cache-begränsningar:**
   - Maximal DNS cache-tid: 5 minuter
   - Gräns för cache-poster

3. **Nätverksbegränsningar:**
   - Maximalt 3 försök per sökning
   - Minimalt intervall mellan försök: 150ms
   - Maximal giltig ping: 800ms

4. **Databegränsningar:**
   - Maximal strängstorlek
   - Maximalt antal serverregler
   - Begränsningar för specialtecken

## Svarsstruktur

API:et returnerar ett detaljerat objekt med all serverinformation:

```javascript
{
    // Grundläggande information
    address: "127.0.0.1", // Serveradress
    port: 7777, // Port
    hostname: "Server", // Servernamn
    gamemode: "RolePlay", // Spelläge
    language: "Svenska", // Språk
    
    // Serverstatus
    password: false, // Lösenordsskydd
    maxPlayers: 100, // Maximalt antal spelare
    onlinePlayers: 45, // Spelare online
    ping: 58, // Latens i ms
    queryTime: 1635789012345, // Sökningstidsstämpel
    
    // Spelarlista
    players: [
        {
            id: 0, // Spelar-ID
            name: "Calasans", // Namn
            score: 63, // Poäng
            ping: 117 // Spelarping
        },
    ],

    // Serverregler
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Tillåtna klientversioner
        artwork: 1, // Artwork-aktivering
        lagcomp: "On", // Laggkompensationsstatus
        mapname: "San Andreas", // Kartnamn
        version: "0.3.7", // Serverversion
        weather: 10, // Väder-ID
        weburl: "website.com", // Serverns webbadress
        worldtime: "12:00" // Världstid på servern
    }
}
```

## Licens

Detta API skyddas under MIT-licensen, som tillåter:
- ✔️ Kommersiell och privat användning
- ✔️ Modifiering av källkoden
- ✔️ Distribution av koden
- ✔️ Underlicensiering

### Villkor:

- Behåll upphovsrättsmeddelandet
- Inkludera en kopia av MIT-licensen

För mer information om licensen: https://opensource.org/licenses/MIT

**Copyright (c) Calasans - Alla rättigheter förbehållna**