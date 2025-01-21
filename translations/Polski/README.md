# samp-query-node

Kompletne API dla środowiska **Node.js**, zaprojektowane do wykonywania zapytań do serwerów SA-MP (San Andreas Multiplayer) i kompatybilne z OPEN.MP (Open Multiplayer). Oferuje zaawansowane funkcje monitorowania i zbierania informacji w czasie rzeczywistym.

### Języki

- Português: [README](../../)
- Deutsch: [README](../Deutsch/README.md)
- English: [README](../English/README.md)
- Español: [README](../Espanol/README.md)
- Français: [README](../Francais/README.md)
- Italiano: [README](../Italiano/README.md)
- Русский: [README](../Русский/README.md)
- Svenska: [README](../Svenska/README.md)
- Türkçe: [README](../Turkce/README.md)

## Spis treści

- [samp-query-node](#samp-query-node)
    - [Języki](#języki)
  - [Spis treści](#spis-treści)
  - [O API](#o-api)
  - [Instalacja](#instalacja)
  - [Funkcjonalności](#funkcjonalności)
    - [Główny System Zapytań](#główny-system-zapytań)
  - [Struktura API](#struktura-api)
    - [Główne Klasy](#główne-klasy)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [System Cache DNS](#system-cache-dns)
  - [System Opóźnień](#system-opóźnień)
    - [Pomiar Pingu](#pomiar-pingu)
    - [Przykłady Użycia](#przykłady-użycia)
      - [1. Podstawowe Zapytanie](#1-podstawowe-zapytanie)
      - [2. Zapytanie z Niestandardowymi Opcjami](#2-zapytanie-z-niestandardowymi-opcjami)
      - [3. Używanie Promises](#3-używanie-promises)
      - [4. Ciągłe Monitorowanie](#4-ciągłe-monitorowanie)
  - [Obsługa Błędów](#obsługa-błędów)
    - [1. Błędy Połączenia](#1-błędy-połączenia)
    - [2. Przekroczenia Czasu](#2-przekroczenia-czasu)
    - [3. Walidacja Danych](#3-walidacja-danych)
  - [Aspekty Wydajnościowe](#aspekty-wydajnościowe)
    - [Zaimplementowane Optymalizacje](#zaimplementowane-optymalizacje)
  - [Ograniczenia Techniczne](#ograniczenia-techniczne)
  - [Struktura Odpowiedzi](#struktura-odpowiedzi)
  - [Licencja](#licencja)
    - [Warunki:](#warunki)

## O API

**SA-MP Query Node** to API opracowane specjalnie do interakcji z serwerami SA-MP, umożliwiające zbieranie szczegółowych informacji o serwerze w czasie rzeczywistym. API wykorzystuje natywny protokół zapytań SA-MP i implementuje różne warstwy optymalizacji w celu zapewnienia wydajnych i niezawodnych zapytań.

API zostało zaprojektowane z naciskiem na:
- Niezawodność zapytań
- Wydajność przetwarzania
- Łatwość użycia
- Solidną obsługę błędów
- Pełne wsparcie dla wszystkich funkcji protokołu SA-MP

## Instalacja

Sklonuj repozytorium na swój lokalny komputer:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Funkcjonalności

### Główny System Zapytań

API oferuje kompletny system zapytań, który pozwala uzyskać:

1. **Podstawowe Informacje o Serwerze:**
   - Nazwa serwera
   - Aktualny tryb gry
   - Skonfigurowany język
   - Status zabezpieczenia hasłem
   - Maksymalna liczba graczy
   - Aktualna liczba graczy online

2. **Szczegółowa Lista Graczy:**
   - ID gracza
   - Nazwa gracza
   - Aktualny wynik
   - Opóźnienie (ping) gracza

3. **Zasady Serwera:**
   - Ustawienia kompensacji lagów
   - Aktualna pogoda
   - Inne niestandardowe zasady zdefiniowane przez serwer

4. **Pomiary Wydajności:**
   - Opóźnienie serwera (ping)
   - Czas odpowiedzi na zapytania
   - Statystyki połączenia

## Struktura API

### Główne Klasy

#### 1. DNS_Cache

```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

Klasa **DNS_Cache** jest odpowiedzialna za:
- Tymczasowe przechowywanie rozwiązań DNS
- Optymalizację powtarzających się zapytań
- Zmniejszenie opóźnień połączenia
- Zarządzanie czasem życia cache

Główne metody:
- `Get_IP_Address(host_name)`: Rozwiązuje i cachuje adresy IP
- Automatyczne cachowanie z konfigurowalnym czasem trwania (domyślnie: 5 minut)
- Fallback do nazwy hosta w przypadku niepowodzenia rozwiązania

#### 2. Query_Manager

```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

**Query_Manager** kontroluje:
- Zarządzanie aktywnymi zapytaniami
- Timeouty i ponowne próby
- Wydarzenia zakończenia zapytania
- Czyszczenie wygasłych zapytań

Funkcjonalności:
- System automatycznego ponawiania
- Kontrola limitu czasu
- Zarządzanie wieloma jednoczesnymi zapytaniami
- Emitowanie zdarzeń zakończenia

#### 3. SAMP_Strings

```javascript
class SAMP_Strings {
    static charset = [/* zestaw znaków SA-MP */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Odpowiada za:
- Dekodowanie ciągów znaków SA-MP
- Obsługę znaków specjalnych
- Czyszczenie i sanityzację ciągów
- Konwersję buforów na tekst

## System Cache DNS

System cache DNS jest kluczową częścią API, implementującą:

1. **Zarządzanie Cache:**
   - Wydajne przechowywanie rozwiązań DNS
   - Sprawdzanie ważności czasowej
   - Automatyczne czyszczenie starych wpisów

2. **Optymalizacja Wydajności:**
   - Redukcja redundantnych zapytań DNS
   - Poprawa czasu odpowiedzi
   - Oszczędność zasobów sieciowych

3. **Ustawienia Cache:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 minut
   ```

4. **Obsługa Awarii:**
   - Fallback do oryginalnej nazwy hosta
   - Automatyczne ponowne próby przy tymczasowych awariach
   - Logowanie błędów rozwiązywania

## System Opóźnień

### Pomiar Pingu

System pomiaru opóźnień implementuje:

1. **Zbieranie Próbek:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Przetwarzanie Wyników:**
   - Obliczanie średniego opóźnienia
   - Filtrowanie wartości odstających
   - Wykrywanie przekroczeń czasu

3. **Optymalizacje:**
   - Wiele próbek dla dokładności
   - Konfigurowalne interwały
   - Niezależne timeouty

### Przykłady Użycia

#### 1. Podstawowe Zapytanie

```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (blad, odpowiedz) => {
    if (blad) {
        console.error('Błąd zapytania:', blad);
        return;
    }
    
    console.log('Informacje o serwerze:', odpowiedz);
});
```

#### 2. Zapytanie z Niestandardowymi Opcjami

```javascript
const opcje = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // timeout 1.5 sekundy
};

query(opcje, (blad, odpowiedz) => {
    if (blad) {
        console.error('Błąd:', blad);
        return;
    }
    
    console.log('Nazwa serwera:', odpowiedz.hostname);
    console.log('Gracze:', odpowiedz.onlinePlayers);
    console.log('Tryb gry:', odpowiedz.gamemode);
    
    // Przetwarzanie listy graczy
    odpowiedz.players.forEach(gracz => {
        console.log(`${gracz.name}: ${gracz.score} punktów`);
    });
});
```

#### 3. Używanie Promises

```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Zapytaj_Serwer() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Serwer:', info.hostname);
        console.log('Gracze:', info.onlinePlayers);
        console.log('Ping:', info.ping, 'ms');
        
        // Przetwarzanie zasad serwera
        if (info.rules.lagcomp === 'On') {
            console.log('Serwer z włączoną kompensacją lagów');
        }
        
        // Lista najlepszych graczy
        const najlepsiGracze = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTop 5 Graczy:');
        najlepsiGracze.forEach((gracz, index) => {
            console.log(`${index + 1}. ${gracz.name}: ${gracz.score} punktów`);
        });
        
    } catch (blad) {
        console.error('Błąd podczas zapytania do serwera:', blad);
    }
}
```

#### 4. Ciągłe Monitorowanie

```javascript
async function Monitoruj_Serwer(adres, interval = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Rozpoczynam monitorowanie ${adres}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(adres);
            
            console.log('\n=== Status Serwera ===');
            console.log(`Czas: ${new Date().toLocaleString()}`);
            console.log(`Gracze: ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping: ${info.ping}ms`);
            console.log(`Tryb: ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nGracze Online:');
                info.players.forEach(gracz => {
                    console.log(`- ${gracz.name} (Ping: ${gracz.ping}ms)`);
                });
            }
            
        } catch (blad) {
            console.error('Błąd monitorowania:', blad);
        }
    }, interval);
}
```

## Obsługa Błędów

API implementuje solidny system obsługi błędów:

### 1. Błędy Połączenia

```javascript
query('127.0.0.1:7777', (blad, odpowiedz) => {
    if (!odpowiedz.hostname) {
        console.log('Serwer offline lub niedostępny');
    }
});
```

### 2. Przekroczenia Czasu

```javascript
const opcje = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 sekundy
};

query(opcje, (blad, odpowiedz) => {
    if (blad) {
        console.log('Serwer nie odpowiedział w limicie czasu');
    }
});
```

### 3. Walidacja Danych

```javascript
query('127.0.0.1:7777', (blad, odpowiedz) => {
    // Kontrole bezpieczeństwa
    if (odpowiedz.onlinePlayers > odpowiedz.maxPlayers) {
        console.log('Otrzymano niespójne dane');
        return;
    }
    
    // Walidacja graczy
    odpowiedz.players = odpowiedz.players.filter(gracz => {
        return gracz.name && gracz.score >= 0 && gracz.ping >= 0;
    });
});
```

## Aspekty Wydajnościowe

### Zaimplementowane Optymalizacje

1. **Cache DNS:**
   - Redukcja powtarzających się zapytań DNS
   - Cache z konfigurowalnym czasem życia
   - Automatyczne czyszczenie cache

2. **Zarządzanie Połączeniami:**
   - Ponowne wykorzystanie socketów gdy możliwe
   - Zoptymalizowane timeouty
   - Inteligentny system ponawiania

3. **Przetwarzanie Danych:**
   - Wydajne parsowanie pakietów
   - Zoptymalizowana walidacja danych
   - Wydajne zarządzanie pamięcią

4. **Pomiar Opóźnień:**
   - Wiele próbek dla dokładności
   - Filtr wartości odstających
   - Zoptymalizowane obliczanie średnich

## Ograniczenia Techniczne

1. **Ograniczenia Protokołu:**
   - Maksymalny rozmiar pakietu: 2048 bajtów
   - Maksymalna liczba graczy do zapytania: 100
   - Domyślny timeout: 1000ms

2. **Ograniczenia Cache:**
   - Maksymalny czas cache DNS: 5 minut
   - Limit wpisów w cache

3. **Ograniczenia Sieciowe:**
   - Maksymalnie 3 próby na zapytanie
   - Minimalny interwał między próbami: 150ms
   - Maksymalny prawidłowy ping: 800ms

4. **Ograniczenia Danych:**
   - Maksymalny rozmiar ciągów znaków
   - Maksymalna liczba zasad serwera
   - Ograniczenia znaków specjalnych

## Struktura Odpowiedzi

API zwraca szczegółowy obiekt ze wszystkimi informacjami o serwerze:

```javascript
{
    // Informacje podstawowe
    address: "127.0.0.1", // Adres serwera
    port: 7777, // Port serwera
    hostname: "Server", // Nazwa serwera
    gamemode: "RolePlay", // Tryb gry
    language: "Polski", // Język
    
    // Status serwera
    password: false, // Zabezpieczenie hasłem
    maxPlayers: 100, // Maksymalna liczba graczy
    onlinePlayers: 45, // Gracze online
    ping: 58, // Opóźnienie w ms
    queryTime: 1635789012345, // Znacznik czasu zapytania
    
    // Lista graczy
    players: [
        {
            id: 0, // ID gracza
            name: "Calasans", // Nazwa
            score: 63, // Wynik
            ping: 117 // Ping gracza
        },
    ],
    
    // Zasady serwera
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Dozwolone wersje klientów
        artwork: 1, // Włączenie grafiki
        lagcomp: "On", // Status kompensacji lagów
        mapname: "San Andreas", // Nazwa mapy
        version: "0.3.7", // Wersja serwera
        weather: 10, // ID pogody
        weburl: "website.com", // URL strony serwera
        worldtime: "12:00" // Czas świata na serwerze
    }
}
```

## Licencja

To API jest chronione licencją MIT, która pozwala na:
- ✔️ Użycie komercyjne i prywatne
- ✔️ Modyfikację kodu źródłowego
- ✔️ Dystrybucję kodu
- ✔️ Sublicencjonowanie

### Warunki:

- Zachowanie informacji o prawach autorskich
- Dołączenie kopii licencji MIT

Więcej szczegółów o licencji: https://opensource.org/licenses/MIT

**Copyright (c) Calasans - Wszelkie prawa zastrzeżone**