# SA-MP Query Node
Una API completa para entornos **Node.js**, diseñada para consultas a servidores SA-MP (San Andreas Multiplayer) y compatible con OPEN.MP (Open Multiplayer). Ofrece recursos avanzados de monitoreo y recopilación de información en tiempo real.

### Idiomas

- **Português** > [README](https://github.com/ocalasans/samp-query-node)
- **English** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/English)
- **Polski** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Polski)
- **Türk** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Turk)
- **Deutsch** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Deutsch)
- **Русский** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Русский)
- **Français** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Francais)
- **Italiano** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Italiano)
- **Svenska** > [README](https://github.com/ocalasans/samp-query-node/blob/main/Translations/Svenska)

## Índice

- [SA-MP Query Node](#sa-mp-query-node)
    - [Idiomas](#idiomas)
  - [Índice](#índice)
  - [Sobre la API](#sobre-la-api)
  - [Instalación](#instalación)
  - [Funcionalidades](#funcionalidades)
    - [Sistema de Consulta Principal](#sistema-de-consulta-principal)
  - [Estructura de la API](#estructura-de-la-api)
    - [Clases Principales](#clases-principales)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [Sistema de Cache DNS](#sistema-de-cache-dns)
  - [Sistema de Latencia](#sistema-de-latencia)
    - [Medición de Ping](#medición-de-ping)
    - [Ejemplos de Uso](#ejemplos-de-uso)
      - [1. Consulta Básica](#1-consulta-básica)
      - [2. Consulta con Opciones Personalizadas](#2-consulta-con-opciones-personalizadas)
      - [3. Utilizando Promises](#3-utilizando-promises)
      - [4. Monitoreo Continuo](#4-monitoreo-continuo)
  - [Manejo de Errores](#manejo-de-errores)
    - [1. Errores de Conexión](#1-errores-de-conexión)
    - [2. Timeouts](#2-timeouts)
    - [3. Validación de Datos](#3-validación-de-datos)
  - [Consideraciones de Rendimiento](#consideraciones-de-rendimiento)
    - [Optimizaciones Implementadas](#optimizaciones-implementadas)
  - [Limitaciones Técnicas](#limitaciones-técnicas)
  - [Estructura de Respuesta](#estructura-de-respuesta)
  - [Comunidad SA-MP](#comunidad-sa-mp)

## Sobre la API

La **SA-MP Query Node** es una API desarrollada específicamente para interactuar con servidores SA-MP, permitiendo la recopilación de información detallada sobre el servidor en tiempo real. La API utiliza el protocolo de consulta nativo de SA-MP e implementa varias capas de optimización para garantizar consultas eficientes y confiables.

La API fue diseñada con enfoque en:
- Confiabilidad en las consultas
- Eficiencia en el procesamiento
- Facilidad de uso
- Manejo robusto de errores
- Soporte completo para todas las funcionalidades del protocolo SA-MP

## Instalación

Clone el repositorio en su máquina local:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Funcionalidades

### Sistema de Consulta Principal

La API ofrece un sistema de consulta completo que permite obtener:

1. **Información Básica del Servidor:**
   - Nombre del servidor
   - Modo de juego actual
   - Idioma configurado
   - Estado de protección por contraseña
   - Número máximo de jugadores
   - Número actual de jugadores en línea

2. **Lista Detallada de Jugadores:**
   - ID del jugador
   - Nombre del jugador
   - Puntuación actual
   - Latencia (ping) del jugador

3. **Reglas del Servidor:**
   - Configuraciones de compensación de lag
   - Clima actual
   - Otras reglas personalizadas definidas por el servidor

4. **Mediciones de Rendimiento:**
   - Latencia del servidor (ping)
   - Tiempo de respuesta de las consultas
   - Estadísticas de conexión

## Estructura de la API

### Clases Principales

#### 1. DNS_Cache
```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

La clase **DNS_Cache** es responsable de:
- Almacenar temporalmente resoluciones DNS
- Optimizar consultas repetidas
- Reducir la latencia de conexión
- Gestionar el tiempo de vida del cache

Métodos principales:
- `Get_IP_Address(host_name)`: Resuelve y cachea direcciones IP
- Cache automático con duración configurable (predeterminado: 5 minutos)
- Fallback para hostname en caso de fallo en la resolución

#### 2. Query_Manager
```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

El **Query_Manager** controla:
- Gestión de consultas activas
- Timeouts y reintentos
- Eventos de finalización de consulta
- Limpieza de consultas expiradas

Funcionalidades:
- Sistema de reintento automático
- Control de tiempo límite
- Gestión de múltiples consultas simultáneas
- Emisión de eventos de finalización

#### 3. SAMP_Strings
```javascript
class SAMP_Strings {
    static charset = [/* conjunto de caracteres SA-MP */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Responsable de:
- Decodificación de strings de SA-MP
- Soporte para caracteres especiales
- Limpieza y sanitización de strings
- Conversión de buffers a texto

## Sistema de Cache DNS

El sistema de cache DNS es una parte crucial de la API, implementando:

1. **Gestión de Cache:**
   - Almacenamiento eficiente de resoluciones DNS
   - Verificación de validez temporal
   - Limpieza automática de entradas antiguas

2. **Optimización de Rendimiento:**
   - Reducción de consultas DNS redundantes
   - Mejora en el tiempo de respuesta
   - Ahorro de recursos de red

3. **Configuraciones de Cache:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 minutos
   ```

4. **Manejo de Fallos:**
   - Fallback para hostname original
   - Reintento automático en fallos temporales
   - Registro de errores de resolución

## Sistema de Latencia

### Medición de Ping

El sistema de medición de latencia implementa:

1. **Recolección de Muestras:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Procesamiento de Resultados:**
   - Cálculo de promedio de latencia
   - Filtrado de valores atípicos
   - Detección de timeouts

3. **Optimizaciones:**
   - Múltiples muestras para precisión
   - Intervalos configurables
   - Timeouts independientes

### Ejemplos de Uso

#### 1. Consulta Básica
```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (error, respuesta) => {
    if (error) {
        console.error('Error en la consulta:', error);
        return;
    }
    
    console.log('Información del servidor:', respuesta);
});
```

#### 2. Consulta con Opciones Personalizadas
```javascript
const opciones = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // timeout de 1.5 segundos
};

query(opciones, (error, respuesta) => {
    if (error) {
        console.error('Error:', error);
        return;
    }
    
    console.log('Nombre del servidor:', respuesta.hostname);
    console.log('Jugadores:', respuesta.onlinePlayers);
    console.log('Modo de juego:', respuesta.gamemode);
    
    // Procesando lista de jugadores
    respuesta.players.forEach(jugador => {
        console.log(`${jugador.name}: ${jugador.score} puntos`);
    });
});
```

#### 3. Utilizando Promises
```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Consultar_Servidor() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Servidor:', info.hostname);
        console.log('Jugadores:', info.onlinePlayers);
        console.log('Ping:', info.ping, 'ms');
        
        // Procesando reglas del servidor
        if (info.rules.lagcomp === 'On') {
            console.log('Servidor con compensación de lag activada');
        }
        
        // Listando mejores jugadores
        const mejoresJugadores = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTop 5 Jugadores:');
        mejoresJugadores.forEach((jugador, index) => {
            console.log(`${index + 1}. ${jugador.name}: ${jugador.score} puntos`);
        });
        
    } catch (error) {
        console.error('Error al consultar servidor:', error);
    }
}
```

#### 4. Monitoreo Continuo
```javascript
async function Monitorear_Servidor(direccion, intervalo = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Iniciando monitoreo de ${direccion}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(direccion);
            
            console.log('\n=== Estado del Servidor ===');
            console.log(`Tiempo: ${new Date().toLocaleString()}`);
            console.log(`Jugadores: ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping: ${info.ping}ms`);
            console.log(`Modo: ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nJugadores En Línea:');
                info.players.forEach(jugador => {
                    console.log(`- ${jugador.name} (Ping: ${jugador.ping}ms)`);
                });
            }
            
        } catch (error) {
            console.error('Error en el monitoreo:', error);
        }
    }, intervalo);
}
```

## Manejo de Errores

La API implementa un sistema robusto de manejo de errores:

### 1. Errores de Conexión
```javascript
query('127.0.0.1:7777', (error, respuesta) => {
    if (!respuesta.hostname) {
        console.log('Servidor fuera de línea o inaccesible');
    }
});
```

### 2. Timeouts
```javascript
const opciones = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 segundos
};

query(opciones, (error, respuesta) => {
    if (error) {
        console.log('El servidor no respondió en el tiempo límite');
    }
});
```

### 3. Validación de Datos
```javascript
query('127.0.0.1:7777', (error, respuesta) => {
    // Verificaciones de seguridad
    if (respuesta.onlinePlayers > respuesta.maxPlayers) {
        console.log('Datos inconsistentes recibidos');
        return;
    }
    
    // Validación de jugadores
    respuesta.players = respuesta.players.filter(jugador => {
        return jugador.name && jugador.score >= 0 && jugador.ping >= 0;
    });
});
```

## Consideraciones de Rendimiento

### Optimizaciones Implementadas

1. **Cache DNS:**
   - Reduce consultas DNS repetidas
   - Cache con tiempo de vida configurable
   - Limpieza automática de cache

2. **Gestión de Conexiones:**
   - Reutilización de sockets cuando es posible
   - Timeouts optimizados
   - Sistema de reintento inteligente

3. **Procesamiento de Datos:**
   - Parsing eficiente de paquetes
   - Validación optimizada de datos
   - Gestión de memoria eficiente

4. **Medición de Latencia:**
   - Múltiples muestras para precisión
   - Filtro de valores atípicos
   - Cálculo optimizado de promedios

## Limitaciones Técnicas

1. **Limitaciones de Protocolo:**
   - Tamaño máximo de paquete: 2048 bytes
   - Máximo de jugadores consultables: 100
   - Timeout predeterminado: 1000ms

2. **Limitaciones de Cache:**
   - Tiempo máximo de cache DNS: 5 minutos
   - Límite de entradas en el cache

3. **Limitaciones de Red:**
   - Máximo de 3 intentos por consulta
   - Intervalo mínimo entre intentos: 150ms
   - Ping máximo válido: 800ms

4. **Limitaciones de Datos:**
   - Tamaño máximo de strings
   - Número máximo de reglas del servidor
   - Limitaciones de caracteres especiales

## Estructura de Respuesta

La API devuelve un objeto detallado con toda la información del servidor:

```javascript
{
    // Información básica
    address: "127.0.0.1", // Dirección del servidor
    port: 7777, // Puerto del servidor
    hostname: "Server", // Nombre del servidor
    gamemode: "RolePlay", // Modo de juego
    language: "Español", // Idioma
    
    // Estado del servidor
    password: false, // Protección por contraseña
    maxPlayers: 100, // Máximo de jugadores
    onlinePlayers: 45, // Jugadores en línea
    ping: 58, // Latencia en ms
    queryTime: 1635789012345, // Timestamp de la consulta
    
    // Lista de jugadores
    players: [
        {
            id: 0, // ID del jugador
            name: "Calasans", // Nombre
            score: 63, // Puntuación
            ping: 117 // Ping del jugador
        },
    ],
    
    // Reglas del servidor
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Versiones permitidas de clientes
        artwork: 1, // Habilitación de artwork
        lagcomp: "On", // Estado de la compensación de lag
        mapname: "San Andreas", // Nombre del mapa
        version: "0.3.7", // Versión del servidor
        weather: 10, // ID del clima
        weburl: "website.com", // URL del sitio web del servidor
        worldtime: "12:00" // Hora del mundo en el servidor
    }
}
```

## Comunidad SA-MP

- [SA-MP Programming Community](https://discord.com/invite/3fApZh66Tf)