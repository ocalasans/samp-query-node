# SA-MP Query Node
Un'API completa per ambienti **Node.js**, progettata per interrogare i server SA-MP (San Andreas Multiplayer) e compatibile con OPEN.MP (Open Multiplayer). Offre funzionalità avanzate di monitoraggio e raccolta di informazioni in tempo reale.

### Lingue

- **Português** > [README](https://github.com/ocalasans/samp-query-node)
- **English** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/English)
- **Español** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Espanol)
- **Polski** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Polski)
- **Türk** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Turk)
- **Deutsch** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Deutsch)
- **Русский** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Русский)
- **Français** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Francais)
- **Svenska** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Svenska)

## Indice

- [SA-MP Query Node](#sa-mp-query-node)
    - [Lingue](#lingue)
  - [Indice](#indice)
  - [Informazioni sull'API](#informazioni-sullapi)
  - [Installazione](#installazione)
  - [Funzionalità](#funzionalità)
    - [Sistema di Query Principale](#sistema-di-query-principale)
  - [Struttura dell'API](#struttura-dellapi)
    - [Classi Principali](#classi-principali)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [Sistema Cache DNS](#sistema-cache-dns)
  - [Sistema di Latenza](#sistema-di-latenza)
    - [Misurazione del Ping](#misurazione-del-ping)
    - [Esempi di Utilizzo](#esempi-di-utilizzo)
      - [1. Query Base](#1-query-base)
      - [2. Query con Opzioni Personalizzate](#2-query-con-opzioni-personalizzate)
      - [3. Utilizzo delle Promises](#3-utilizzo-delle-promises)
      - [4. Monitoraggio Continuo](#4-monitoraggio-continuo)
  - [Gestione degli Errori](#gestione-degli-errori)
    - [1. Errori di Connessione](#1-errori-di-connessione)
    - [2. Timeouts](#2-timeouts)
    - [3. Validazione dei Dati](#3-validazione-dei-dati)
  - [Considerazioni sulle Prestazioni](#considerazioni-sulle-prestazioni)
    - [Ottimizzazioni Implementate](#ottimizzazioni-implementate)
  - [Limitazioni Tecniche](#limitazioni-tecniche)
  - [Struttura della Risposta](#struttura-della-risposta)
  - [Comunità SA-MP](#comunità-sa-mp)

## Informazioni sull'API

**SA-MP Query Node** è un'API sviluppata specificamente per interagire con i server SA-MP, permettendo la raccolta di informazioni dettagliate sul server in tempo reale. L'API utilizza il protocollo di query nativo di SA-MP e implementa vari livelli di ottimizzazione per garantire query efficienti e affidabili.

L'API è stata progettata con focus su:
- Affidabilità delle query
- Efficienza nell'elaborazione
- Facilità d'uso
- Gestione robusta degli errori
- Supporto completo per tutte le funzionalità del protocollo SA-MP

## Installazione

Clona il repository nella tua macchina locale:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Funzionalità

### Sistema di Query Principale

L'API offre un sistema di query completo che permette di ottenere:

1. **Informazioni Base del Server:**
   - Nome del server
   - Modalità di gioco attuale
   - Lingua configurata
   - Stato della protezione password
   - Numero massimo di giocatori
   - Numero attuale di giocatori online

2. **Lista Dettagliata dei Giocatori:**
   - ID del giocatore
   - Nome del giocatore
   - Punteggio attuale
   - Latenza (ping) del giocatore

3. **Regole del Server:**
   - Configurazioni della compensazione del lag
   - Meteo attuale
   - Altre regole personalizzate definite dal server

4. **Misurazioni delle Prestazioni:**
   - Latenza del server (ping)
   - Tempo di risposta delle query
   - Statistiche di connessione

## Struttura dell'API

### Classi Principali

#### 1. DNS_Cache
```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

La classe **DNS_Cache** è responsabile di:
- Memorizzare temporaneamente le risoluzioni DNS
- Ottimizzare le query ripetute
- Ridurre la latenza di connessione
- Gestire il tempo di vita della cache

Metodi principali:
- `Get_IP_Address(host_name)`: Risolve e memorizza in cache gli indirizzi IP
- Cache automatica con durata configurabile (predefinito: 5 minuti)
- Fallback su hostname in caso di fallimento della risoluzione

#### 2. Query_Manager
```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

Il **Query_Manager** controlla:
- Gestione delle query attive
- Timeouts e tentativi
- Eventi di completamento query
- Pulizia delle query scadute

Funzionalità:
- Sistema di retry automatico
- Controllo del timeout
- Gestione di multiple query simultanee
- Emissione di eventi di completamento

#### 3. SAMP_Strings
```javascript
class SAMP_Strings {
    static charset = [/* set di caratteri SA-MP */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Responsabile di:
- Decodifica delle stringhe SA-MP
- Supporto per caratteri speciali
- Pulizia e sanitizzazione delle stringhe
- Conversione da buffer a testo

## Sistema Cache DNS

Il sistema di cache DNS è una parte cruciale dell'API, implementando:

1. **Gestione della Cache:**
   - Memorizzazione efficiente delle risoluzioni DNS
   - Verifica della validità temporale
   - Pulizia automatica delle voci obsolete

2. **Ottimizzazione delle Prestazioni:**
   - Riduzione delle query DNS ridondanti
   - Miglioramento del tempo di risposta
   - Risparmio delle risorse di rete

3. **Configurazioni della Cache:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 minuti
   ```

4. **Gestione dei Fallimenti:**
   - Fallback su hostname originale
   - Retry automatico su fallimenti temporanei
   - Logging degli errori di risoluzione

## Sistema di Latenza

### Misurazione del Ping

Il sistema di misurazione della latenza implementa:

1. **Raccolta Campioni:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Elaborazione dei Risultati:**
   - Calcolo della media della latenza
   - Filtraggio dei valori anomali
   - Rilevamento dei timeout

3. **Ottimizzazioni:**
   - Campioni multipli per precisione
   - Intervalli configurabili
   - Timeout indipendenti

### Esempi di Utilizzo

#### 1. Query Base
```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (errore, risposta) => {
    if (errore) {
        console.error('Errore nella query:', errore);
        return;
    }
    
    console.log('Informazioni del server:', risposta);
});
```

#### 2. Query con Opzioni Personalizzate
```javascript
const opzioni = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // timeout di 1.5 secondi
};

query(opzioni, (errore, risposta) => {
    if (errore) {
        console.error('Errore:', errore);
        return;
    }
    
    console.log('Nome del server:', risposta.hostname);
    console.log('Giocatori:', risposta.onlinePlayers);
    console.log('Modalità di gioco:', risposta.gamemode);
    
    // Elaborazione lista giocatori
    risposta.players.forEach(giocatore => {
        console.log(`${giocatore.name}: ${giocatore.score} punti`);
    });
});
```

#### 3. Utilizzo delle Promises
```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Richiedi_Server() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Server:', info.hostname);
        console.log('Giocatori:', info.onlinePlayers);
        console.log('Ping:', info.ping, 'ms');
        
        // Elaborazione regole del server
        if (info.rules.lagcomp === 'On') {
            console.log('Server con compensazione lag attivata');
        }
        
        // Lista top giocatori
        const topGiocatori = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTop 5 Giocatori:');
        topGiocatori.forEach((giocatore, index) => {
            console.log(`${index + 1}. ${giocatore.name}: ${giocatore.score} punti`);
        });
        
    } catch (errore) {
        console.error('Errore nella query al server:', errore);
    }
}
```

#### 4. Monitoraggio Continuo
```javascript
async function Monitora_Server(indirizzo, intervallo = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Avvio monitoraggio di ${indirizzo}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(indirizzo);
            
            console.log('\n=== Stato del Server ===');
            console.log(`Tempo: ${new Date().toLocaleString()}`);
            console.log(`Giocatori: ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping: ${info.ping}ms`);
            console.log(`Modalità: ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nGiocatori Online:');
                info.players.forEach(giocatore => {
                    console.log(`- ${giocatore.name} (Ping: ${giocatore.ping}ms)`);
                });
            }
            
        } catch (errore) {
            console.error('Errore nel monitoraggio:', errore);
        }
    }, intervallo);
}
```

## Gestione degli Errori

L'API implementa un sistema robusto di gestione degli errori:

### 1. Errori di Connessione
```javascript
query('127.0.0.1:7777', (errore, risposta) => {
    if (!risposta.hostname) {
        console.log('Server offline o inaccessibile');
    }
});
```

### 2. Timeouts
```javascript
const opzioni = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 secondi
};

query(opzioni, (errore, risposta) => {
    if (errore) {
        console.log('Il server non ha risposto entro il timeout');
    }
});
```

### 3. Validazione dei Dati
```javascript
query('127.0.0.1:7777', (errore, risposta) => {
    // Verifiche di sicurezza
    if (risposta.onlinePlayers > risposta.maxPlayers) {
        console.log('Dati inconsistenti ricevuti');
        return;
    }
    
    // Validazione giocatori
    risposta.players = risposta.players.filter(giocatore => {
        return giocatore.name && giocatore.score >= 0 && giocatore.ping >= 0;
    });
});
```

## Considerazioni sulle Prestazioni

### Ottimizzazioni Implementate

1. **Cache DNS:**
   - Riduce query DNS ripetute
   - Cache con tempo di vita configurabile
   - Pulizia automatica della cache

2. **Gestione delle Connessioni:**
   - Riutilizzo dei socket quando possibile
   - Timeout ottimizzati
   - Sistema di retry intelligente

3. **Elaborazione dei Dati:**
   - Parsing efficiente dei pacchetti
   - Validazione ottimizzata dei dati
   - Gestione efficiente della memoria

4. **Misurazione della Latenza:**
   - Campioni multipli per precisione
   - Filtro dei valori anomali
   - Calcolo ottimizzato delle medie

## Limitazioni Tecniche

1. **Limitazioni del Protocollo:**
   - Dimensione massima pacchetto: 2048 byte
   - Massimo giocatori interrogabili: 100
   - Timeout predefinito: 1000ms

2. **Limitazioni della Cache:**
   - Tempo massimo cache DNS: 5 minuti
   - Limite di voci nella cache

3. **Limitazioni di Rete:**
   - Massimo 3 tentativi per query
   - Intervallo minimo tra tentativi: 150ms
   - Ping massimo valido: 800ms

4. **Limitazioni dei Dati:**
   - Dimensione massima delle stringhe
   - Numero massimo di regole del server
   - Limitazioni dei caratteri speciali

## Struttura della Risposta

L'API restituisce un oggetto dettagliato con tutte le informazioni del server:

```javascript
{
    // Informazioni base
    address: "127.0.0.1", // Indirizzo del server
    port: 7777, // Porta del server
    hostname: "Server", // Nome del server
    gamemode: "RolePlay", // Modalità di gioco
    language: "Italiano", // Lingua
    
    // Stato del server
    password: false, // Protezione password
    maxPlayers: 100, // Massimo giocatori
    onlinePlayers: 45, // Giocatori online
    ping: 58, // Latenza in ms
    queryTime: 1635789012345, // Timestamp della query
    
    // Lista giocatori
    players: [
        {
            id: 0, // ID del giocatore
            name: "Calasans", // Nome
            score: 63, // Punteggio
            ping: 117 // Ping del giocatore
        },
    ],
    
    // Regole del server
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Versioni client permesse
        artwork: 1, // Abilitazione artwork
        lagcomp: "On", // Stato del lag comp
        mapname: "San Andreas", // Nome della mappa
        version: "0.3.7", // Versione del server
        weather: 10, // ID del meteo
        weburl: "website.com", // URL del sito del server
        worldtime: "12:00" // Ora del mondo nel server
    }
}
```

## Comunità SA-MP

- [SA-MP Programming Community](https://discord.com/invite/3fApZh66Tf)