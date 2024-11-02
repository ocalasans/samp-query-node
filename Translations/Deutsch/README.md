# SA-MP Query Node
Eine vollständige API für **Node.js**-Umgebungen, entwickelt für Abfragen an SA-MP (San Andreas Multiplayer) Server und kompatibel mit OPEN.MP (Open Multiplayer). Bietet erweiterte Funktionen für Monitoring und Echtzeit-Informationssammlung.

### Sprachen

- **Português** > [README](https://github.com/ocalasans/samp-query-node)
- **English** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/English)
- **Español** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Espanol)
- **Polski** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Polski)
- **Türk** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Turk)
- **Русский** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Русский)
- **Français** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Francais)
- **Italiano** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Italiano)
- **Svenska** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Svenska)

## Inhaltsverzeichnis

- [SA-MP Query Node](#sa-mp-query-node)
    - [Sprachen](#sprachen)
  - [Inhaltsverzeichnis](#inhaltsverzeichnis)
  - [Über die API](#über-die-api)
  - [Installation](#installation)
  - [Funktionen](#funktionen)
    - [Hauptabfragesystem](#hauptabfragesystem)
  - [API-Struktur](#api-struktur)
    - [Hauptklassen](#hauptklassen)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [DNS-Cache-System](#dns-cache-system)
  - [Latenz-System](#latenz-system)
    - [Ping-Messung](#ping-messung)
    - [Verwendungsbeispiele](#verwendungsbeispiele)
      - [1. Grundlegende Abfrage](#1-grundlegende-abfrage)
      - [2. Abfrage mit benutzerdefinierten Optionen](#2-abfrage-mit-benutzerdefinierten-optionen)
      - [3. Verwendung von Promises](#3-verwendung-von-promises)
      - [4. Kontinuierliche Überwachung](#4-kontinuierliche-überwachung)
  - [Fehlerbehandlung](#fehlerbehandlung)
    - [1. Verbindungsfehler](#1-verbindungsfehler)
    - [2. Timeouts](#2-timeouts)
    - [3. Datenvalidierung](#3-datenvalidierung)
  - [Leistungsüberlegungen](#leistungsüberlegungen)
    - [Implementierte Optimierungen](#implementierte-optimierungen)
  - [Technische Einschränkungen](#technische-einschränkungen)
  - [Antwortstruktur](#antwortstruktur)
  - [SA-MP-Gemeinschaft](#sa-mp-gemeinschaft)

## Über die API

Die **SA-MP Query Node** ist eine API, die speziell für die Interaktion mit SA-MP-Servern entwickelt wurde und die detaillierte Erfassung von Server-Informationen in Echtzeit ermöglicht. Die API verwendet das native Abfrageprotokoll von SA-MP und implementiert verschiedene Optimierungsebenen für effiziente und zuverlässige Abfragen.

Die API wurde mit Fokus auf folgende Aspekte entwickelt:
- Zuverlässigkeit bei Abfragen
- Effiziente Verarbeitung
- Benutzerfreundlichkeit
- Robuste Fehlerbehandlung
- Vollständige Unterstützung aller SA-MP-Protokollfunktionen

## Installation

Klonen Sie das Repository auf Ihren lokalen Computer:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Funktionen

### Hauptabfragesystem

Die API bietet ein vollständiges Abfragesystem, das Folgendes ermöglicht:

1. **Grundlegende Serverinformationen:**
   - Servername
   - Aktueller Spielmodus
   - Konfigurierte Sprache
   - Passwortschutz-Status
   - Maximale Spieleranzahl
   - Aktuelle Anzahl der Online-Spieler

2. **Detaillierte Spielerliste:**
   - Spieler-ID
   - Spielername
   - Aktuelle Punktzahl
   - Latenz (Ping) des Spielers

3. **Serverregeln:**
   - Lag-Compensation-Einstellungen
   - Aktuelles Wetter
   - Andere benutzerdefinierte Serverregeln

4. **Leistungsmessungen:**
   - Serverlatenz (Ping)
   - Antwortzeit der Abfragen
   - Verbindungsstatistiken

## API-Struktur

### Hauptklassen

#### 1. DNS_Cache
```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

Die **DNS_Cache**-Klasse ist verantwortlich für:
- Temporäre Speicherung von DNS-Auflösungen
- Optimierung wiederholter Abfragen
- Reduzierung der Verbindungslatenz
- Verwaltung der Cache-Lebensdauer

Hauptmethoden:
- `Get_IP_Address(host_name)`: Löst IP-Adressen auf und speichert sie im Cache
- Automatischer Cache mit konfigurierbarer Dauer (Standard: 5 Minuten)
- Fallback auf Hostnamen bei fehlgeschlagener Auflösung

#### 2. Query_Manager
```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

Der **Query_Manager** kontrolliert:
- Verwaltung aktiver Abfragen
- Timeouts und Wiederholungsversuche
- Abschluss-Events von Abfragen
- Bereinigung abgelaufener Abfragen

Funktionalitäten:
- Automatisches Retry-System
- Zeitlimitkontrolle
- Verwaltung mehrerer gleichzeitiger Abfragen
- Emission von Abschlussereignissen

#### 3. SAMP_Strings
```javascript
class SAMP_Strings {
    static charset = [/* SA-MP Zeichensatz */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Verantwortlich für:
- Dekodierung von SA-MP-Strings
- Unterstützung spezieller Zeichen
- Bereinigung und Sanitisierung von Strings
- Konvertierung von Puffern zu Text

## DNS-Cache-System

Das DNS-Cache-System ist ein wichtiger Teil der API und implementiert:

1. **Cache-Verwaltung:**
   - Effiziente Speicherung von DNS-Auflösungen
   - Zeitliche Gültigkeitsprüfung
   - Automatische Bereinigung alter Einträge

2. **Leistungsoptimierung:**
   - Reduzierung redundanter DNS-Abfragen
   - Verbesserung der Antwortzeit
   - Einsparung von Netzwerkressourcen

3. **Cache-Einstellungen:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 Minuten
   ```

4. **Fehlerbehandlung:**
   - Fallback auf ursprünglichen Hostnamen
   - Automatischer Retry bei temporären Fehlern
   - Logging von Auflösungsfehlern

## Latenz-System

### Ping-Messung

Das Latenzmesssystem implementiert:

1. **Probenentnahme:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Ergebnisverarbeitung:**
   - Berechnung der durchschnittlichen Latenz
   - Filterung von Ausreißern
   - Timeout-Erkennung

3. **Optimierungen:**
   - Mehrere Proben für Genauigkeit
   - Konfigurierbare Intervalle
   - Unabhängige Timeouts

### Verwendungsbeispiele

#### 1. Grundlegende Abfrage
```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (fehler, antwort) => {
    if (fehler) {
        console.error('Fehler bei der Abfrage:', fehler);
        return;
    }
    
    console.log('Serverinformationen:', antwort);
});
```

#### 2. Abfrage mit benutzerdefinierten Optionen
```javascript
const optionen = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // Timeout von 1,5 Sekunden
};

query(optionen, (fehler, antwort) => {
    if (fehler) {
        console.error('Fehler:', fehler);
        return;
    }
    
    console.log('Servername:', antwort.hostname);
    console.log('Spieler:', antwort.onlinePlayers);
    console.log('Spielmodus:', antwort.gamemode);
    
    // Verarbeitung der Spielerliste
    antwort.players.forEach(spieler => {
        console.log(`${spieler.name}: ${spieler.score} Punkte`);
    });
});
```

#### 3. Verwendung von Promises
```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Server_Abfragen() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Server:', info.hostname);
        console.log('Spieler:', info.onlinePlayers);
        console.log('Ping:', info.ping, 'ms');
        
        // Verarbeitung der Serverregeln
        if (info.rules.lagcomp === 'On') {
            console.log('Server mit aktivierter Lag-Compensation');
        }
        
        // Auflistung der Top-Spieler
        const topSpieler = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTop 5 Spieler:');
        topSpieler.forEach((spieler, index) => {
            console.log(`${index + 1}. ${spieler.name}: ${spieler.score} Punkte`);
        });
        
    } catch (fehler) {
        console.error('Fehler bei der Serverabfrage:', fehler);
    }
}
```

#### 4. Kontinuierliche Überwachung
```javascript
async function Server_Überwachen(adresse, intervall = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Starte Überwachung von ${adresse}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(adresse);
            
            console.log('\n=== Serverstatus ===');
            console.log(`Zeit: ${new Date().toLocaleString()}`);
            console.log(`Spieler: ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping: ${info.ping}ms`);
            console.log(`Modus: ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nOnline Spieler:');
                info.players.forEach(spieler => {
                    console.log(`- ${spieler.name} (Ping: ${spieler.ping}ms)`);
                });
            }
            
        } catch (fehler) {
            console.error('Fehler bei der Überwachung:', fehler);
        }
    }, intervall);
}
```

## Fehlerbehandlung

Die API implementiert ein robustes Fehlerbehandlungssystem:

### 1. Verbindungsfehler
```javascript
query('127.0.0.1:7777', (fehler, antwort) => {
    if (!antwort.hostname) {
        console.log('Server offline oder nicht erreichbar');
    }
});
```

### 2. Timeouts
```javascript
const optionen = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 Sekunden
};

query(optionen, (fehler, antwort) => {
    if (fehler) {
        console.log('Server hat nicht innerhalb des Zeitlimits geantwortet');
    }
});
```

### 3. Datenvalidierung
```javascript
query('127.0.0.1:7777', (fehler, antwort) => {
    // Sicherheitsüberprüfungen
    if (antwort.onlinePlayers > antwort.maxPlayers) {
        console.log('Inkonsistente Daten empfangen');
        return;
    }
    
    // Spielervalidierung
    antwort.players = antwort.players.filter(spieler => {
        return spieler.name && spieler.score >= 0 && spieler.ping >= 0;
    });
});
```

## Leistungsüberlegungen

### Implementierte Optimierungen

1. **DNS-Cache:**
   - Reduziert wiederholte DNS-Abfragen
   - Cache mit konfigurierbarer Lebensdauer
   - Automatische Cache-Bereinigung

2. **Verbindungsverwaltung:**
   - Wiederverwendung von Sockets wenn möglich
   - Optimierte Timeouts
   - Intelligentes Retry-System

3. **Datenverarbeitung:**
   - Effizientes Paket-Parsing
   - Optimierte Datenvalidierung
   - Effizientes Speichermanagement

4. **Latenzmessung:**
   - Mehrfache Proben für Genauigkeit
   - Ausreißer-Filterung
   - Optimierte Durchschnittsberechnung

## Technische Einschränkungen

1. **Protokoll-Einschränkungen:**
   - Maximale Paketgröße: 2048 Bytes
   - Maximal abfragbare Spieler: 100
   - Standard-Timeout: 1000ms

2. **Cache-Einschränkungen:**
   - Maximale DNS-Cache-Zeit: 5 Minuten
   - Begrenzung der Cache-Einträge

3. **Netzwerk-Einschränkungen:**
   - Maximal 3 Versuche pro Abfrage
   - Minimales Intervall zwischen Versuchen: 150ms
   - Maximaler gültiger Ping: 800ms

4. **Daten-Einschränkungen:**
   - Maximale String-Länge
   - Maximale Anzahl von Serverregeln
   - Einschränkungen bei Sonderzeichen

## Antwortstruktur

Die API gibt ein detailliertes Objekt mit allen Serverinformationen zurück:

```javascript
{
    // Grundlegende Informationen
    address: "127.0.0.1", // Serveradresse
    port: 7777, // Port
    hostname: "Server", // Servername
    gamemode: "RolePlay", // Spielmodus
    language: "Deutsch", // Sprache
    
    // Serverstatus
    password: false, // Passwortschutz
    maxPlayers: 100, // Maximale Spieleranzahl
    onlinePlayers: 45, // Online Spieler
    ping: 58, // Latenz in ms
    queryTime: 1635789012345, // Zeitstempel der Abfrage
    
    // Spielerliste
    players: [
        {
            id: 0, // Spieler-ID
            name: "Calasans", // Name
            score: 63, // Punktzahl
            ping: 117 // Ping des Spielers
        },
    ],
    
    // Serverregeln
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Erlaubte Client-Versionen
        artwork: 1, // Artwork-Aktivierung
        lagcomp: "On", // Lag-Comp-Status
        mapname: "San Andreas", // Kartenname
        version: "0.3.7", // Serverversion
        weather: 10, // Wetter-ID
        weburl: "website.com", // Server-Webseite
        worldtime: "12:00" // Spielweltzeit
    }
}
```

## SA-MP-Gemeinschaft

- [SA-MP Programming Community](https://discord.com/invite/3fApZh66Tf)