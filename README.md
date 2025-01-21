# samp-query-node

Uma API completa para ambientes **Node.js**, projetada para consultas a servidores SA-MP (San Andreas Multiplayer) e compatível com o OPEN.MP (Open Multiplayer). Oferece recursos avançados de monitoramento e coleta de informações em tempo real.

### Idiomas

- Deutsch: [README](translations/Deutsch/README.md)
- English: [README](translations/English/README.md)
- Español: [README](translations/Espanol/README.md)
- Français: [README](translations/Francais/README.md)
- Italiano: [README](translations/Italiano/README.md)
- Polski: [README](translations/Polski/README.md)
- Русский: [README](translations/Русский/README.md)
- Svenska: [README](translations/Svenska/README.md)
- Türkçe: [README](translations/Turkce/README.md)

## Índice

- [samp-query-node](#samp-query-node)
    - [Idiomas](#idiomas)
  - [Índice](#índice)
  - [Sobre a API](#sobre-a-api)
  - [Instalação](#instalação)
  - [Funcionalidades](#funcionalidades)
    - [Sistema de Consulta Principal](#sistema-de-consulta-principal)
  - [Estrutura da API](#estrutura-da-api)
    - [Classes Principais](#classes-principais)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [Sistema de Cache DNS](#sistema-de-cache-dns)
  - [Sistema de Latência](#sistema-de-latência)
    - [Medição de Ping](#medição-de-ping)
    - [Exemplos de Uso](#exemplos-de-uso)
      - [1. Consulta Básica](#1-consulta-básica)
      - [2. Consulta com Opções Personalizadas](#2-consulta-com-opções-personalizadas)
      - [3. Utilizando Promises](#3-utilizando-promises)
      - [4. Monitoramento Contínuo](#4-monitoramento-contínuo)
  - [Tratamento de Erros](#tratamento-de-erros)
    - [1. Erros de Conexão](#1-erros-de-conexão)
    - [2. Timeouts](#2-timeouts)
    - [3. Validação de Dados](#3-validação-de-dados)
  - [Considerações de Desempenho](#considerações-de-desempenho)
    - [Otimizações Implementadas](#otimizações-implementadas)
  - [Limitações Técnicas](#limitações-técnicas)
  - [Estrutura de Resposta](#estrutura-de-resposta)
  - [Licença](#licença)
    - [Condições:](#condições)

## Sobre a API

O **SA-MP Query Node** é uma API desenvolvida especificamente para interagir com servidores SA-MP, permitindo a coleta de informações detalhadas sobre o servidor em tempo real. A API utiliza o protocolo de consulta nativo do SA-MP e implementa várias camadas de otimização para garantir consultas eficientes e confiáveis.

A API foi projetada com foco em:
- Confiabilidade nas consultas
- Eficiência no processamento
- Facilidade de uso
- Tratamento robusto de erros
- Suporte completo a todas as funcionalidades do protocolo SA-MP

## Instalação

Clone o repositório para sua máquina local:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Funcionalidades

### Sistema de Consulta Principal

A API oferece um sistema de consulta completo que permite obter:

1. **Informações Básicas do Servidor:**
   - Nome do servidor
   - Modo de jogo atual
   - Idioma configurado
   - Status de proteção por senha
   - Número máximo de jogadores
   - Número atual de jogadores online

2. **Lista Detalhada de Jogadores:**
   - ID do jogador
   - Nome do jogador
   - Pontuação atual
   - Latência (ping) do jogador

3. **Regras do Servidor:**
   - Configurações de lag compensation
   - Clima atual
   - Outras regras personalizadas definidas pelo servidor

4. **Medições de Desempenho:**
   - Latência do servidor (ping)
   - Tempo de resposta das consultas
   - Estatísticas de conexão

## Estrutura da API

### Classes Principais

#### 1. DNS_Cache

```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

A classe **DNS_Cache** é responsável por:
- Armazenar temporariamente resoluções DNS
- Otimizar consultas repetidas
- Reduzir a latência de conexão
- Gerenciar o tempo de vida do cache

Métodos principais:
- `Get_IP_Address(host_name)`: Resolve e cache endereços IP
- Cache automático com duração configurável (padrão: 5 minutos)
- Fallback para hostname em caso de falha na resolução

#### 2. Query_Manager

```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

O **Query_Manager** controla:
- Gerenciamento de consultas ativas
- Timeouts e retentativas
- Eventos de conclusão de consulta
- Limpeza de consultas expiradas

Funcionalidades:
- Sistema de retry automático
- Controle de tempo limite
- Gerenciamento de múltiplas consultas simultâneas
- Emissão de eventos de conclusão

#### 3. SAMP_Strings

```javascript
class SAMP_Strings {
    static charset = [/* conjunto de caracteres SA-MP */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Responsável por:
- Decodificação de strings do SA-MP
- Suporte a caracteres especiais
- Limpeza e sanitização de strings
- Conversão de buffers para texto

## Sistema de Cache DNS

O sistema de cache DNS é uma parte crucial da API, implementando:

1. **Gerenciamento de Cache:**
   - Armazenamento eficiente de resoluções DNS
   - Verificação de validade temporal
   - Limpeza automática de entradas antigas

2. **Otimização de Desempenho:**
   - Redução de consultas DNS redundantes
   - Melhoria no tempo de resposta
   - Economia de recursos de rede

3. **Configurações de Cache:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 minutos
   ```

4. **Tratamento de Falhas:**
   - Fallback para hostname original
   - Retry automático em falhas temporárias
   - Logging de erros de resolução

## Sistema de Latência

### Medição de Ping

O sistema de medição de latência implementa:

1. **Coleta de Amostras:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Processamento de Resultados:**
   - Cálculo de média de latência
   - Filtragem de valores atípicos
   - Detecção de timeouts

3. **Otimizações:**
   - Múltiplas amostras para precisão
   - Intervalos configuráveis
   - Timeouts independentes

### Exemplos de Uso

#### 1. Consulta Básica

```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (erro, resposta) => {
    if (erro) {
        console.error('Erro na consulta:', erro);
        return;
    }
    
    console.log('Informações do servidor:', resposta);
});
```

#### 2. Consulta com Opções Personalizadas

```javascript
const opcoes = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // timeout de 1.5 segundos
};

query(opcoes, (erro, resposta) => {
    if (erro) {
        console.error('Erro:', erro);
        return;
    }
    
    console.log('Nome do servidor:', resposta.hostname);
    console.log('Jogadores:', resposta.onlinePlayers);
    console.log('Modo de jogo:', resposta.gamemode);
    
    // Processando lista de jogadores
    resposta.players.forEach(jogador => {
        console.log(`${jogador.name}: ${jogador.score} pontos`);
    });
});
```

#### 3. Utilizando Promises

```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Requisitar_Servidor() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Servidor:', info.hostname);
        console.log('Jogadores:', info.onlinePlayers);
        console.log('Ping:', info.ping, 'ms');
        
        // Processando regras do servidor
        if (info.rules.lagcomp === 'On') {
            console.log('Servidor com lag compensation ativado');
        }
        
        // Listando top jogadores
        const topJogadores = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTop 5 Jogadores:');
        topJogadores.forEach((jogador, index) => {
            console.log(`${index + 1}. ${jogador.name}: ${jogador.score} pontos`);
        });
        
    } catch (erro) {
        console.error('Erro ao consultar servidor:', erro);
    }
}
```

#### 4. Monitoramento Contínuo

```javascript
async function Monitorar_Servidor(endereco, intervalo = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Iniciando monitoramento de ${endereco}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(endereco);
            
            console.log('\n=== Status do Servidor ===');
            console.log(`Tempo: ${new Date().toLocaleString()}`);
            console.log(`Jogadores: ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping: ${info.ping}ms`);
            console.log(`Modo: ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nJogadores Online:');
                info.players.forEach(jogador => {
                    console.log(`- ${jogador.name} (Ping: ${jogador.ping}ms)`);
                });
            }
            
        } catch (erro) {
            console.error('Erro no monitoramento:', erro);
        }
    }, intervalo);
}
```

## Tratamento de Erros

A API implementa um sistema robusto de tratamento de erros:

### 1. Erros de Conexão

```javascript
query('127.0.0.1:7777', (erro, resposta) => {
    if (!resposta.hostname) {
        console.log('Servidor offline ou inacessível');
    }
});
```

### 2. Timeouts

```javascript
const opcoes = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 segundos
};

query(opcoes, (erro, resposta) => {
    if (erro) {
        console.log('Servidor não respondeu no tempo limite');
    }
});
```

### 3. Validação de Dados

```javascript
query('127.0.0.1:7777', (erro, resposta) => {
    // Verificações de segurança
    if (resposta.onlinePlayers > resposta.maxPlayers) {
        console.log('Dados inconsistentes recebidos');
        return;
    }
    
    // Validação de jogadores
    resposta.players = resposta.players.filter(jogador => {
        return jogador.name && jogador.score >= 0 && jogador.ping >= 0;
    });
});
```

## Considerações de Desempenho

### Otimizações Implementadas

1. **Cache DNS:**
   - Reduz consultas DNS repetidas
   - Cache com tempo de vida configurável
   - Limpeza automática de cache

2. **Gerenciamento de Conexões:**
   - Reutilização de sockets quando possível
   - Timeouts otimizados
   - Sistema de retry inteligente

3. **Processamento de Dados:**
   - Parsing eficiente de pacotes
   - Validação otimizada de dados
   - Gerenciamento de memória eficiente

4. **Medição de Latência:**
   - Múltiplas amostras para precisão
   - Filtro de valores atípicos
   - Cálculo otimizado de médias

## Limitações Técnicas

1. **Limitações de Protocolo:**
   - Tamanho máximo de pacote: 2048 bytes
   - Máximo de jogadores consultáveis: 100
   - Timeout padrão: 1000ms

2. **Limitações de Cache:**
   - Tempo máximo de cache DNS: 5 minutos
   - Limite de entradas no cache

3. **Limitações de Rede:**
   - Máximo de 3 tentativas por consulta
   - Intervalo mínimo entre tentativas: 150ms
   - Ping máximo válido: 800ms

4. **Limitações de Dados:**
   - Tamanho máximo de strings
   - Número máximo de regras do servidor
   - Limitações de caracteres especiais

## Estrutura de Resposta

A API retorna um objeto detalhado com todas as informações do servidor:

```javascript
{
    // Informações básicas
    address: "127.0.0.1", // Endereço do servidor
    port: 7777, // Porta do servidor
    hostname: "Server", // Nome do servidor
    gamemode: "RolePlay", // Modo de jogo
    language: "Português - Brasil", // Idioma
    
    // Status do servidor
    password: false, // Proteção por senha
    maxPlayers: 100, // Máximo de jogadores
    onlinePlayers: 45, // Jogadores online
    ping: 58, // Latência em ms
    queryTime: 1635789012345, // Timestamp da consulta
    
    // Lista de jogadores
    players: [
        {
            id: 0, // ID do jogador
            name: "Calasans", // Nome
            score: 63, // Pontuação
            ping: 117 // Ping do jogador
        },
    ],
    
    // Regras do servidor
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Versões permitidas de clientes
        artwork: 1, // Habilitação de artwork
        lagcomp: "On", // Status do lag comp
        mapname: "San Andreas", // Nome do mapa
        version: "0.3.7", // Versão do servidor
        weather: 10, // ID do clima
        weburl: "website.com", // URL do site do servidor
        worldtime: "12:00" // Hora do mundo no servidor
    }
}
```

## Licença

Esta API está protegido sob a Licença MIT, que permite:
- ✔️ Uso comercial e privado
- ✔️ Modificação do código fonte
- ✔️ Distribuição do código
- ✔️ Sublicenciamento

### Condições:

- Manter o aviso de direitos autorais
- Incluir cópia da licença MIT

Para mais detalhes sobre a licença: https://opensource.org/licenses/MIT

**Copyright (c) Calasans - Todos os direitos reservados**
