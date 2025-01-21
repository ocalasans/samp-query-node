# samp-query-node

Une API complète pour les environnements **Node.js**, conçue pour interroger les serveurs SA-MP (San Andreas Multiplayer) et compatible avec OPEN.MP (Open Multiplayer). Offre des fonctionnalités avancées de surveillance et de collecte d'informations en temps réel.

### Langues

- Português: [README](../../)
- Deutsch: [README](../Deutsch/README.md)
- English: [README](../English/README.md)
- Español: [README](../Espanol/README.md)
- Italiano: [README](../Italiano/README.md)
- Polski: [README](../Polski/README.md)
- Русский: [README](../Русский/README.md)
- Svenska: [README](../Svenska/README.md)
- Türkçe: [README](../Turkce/README.md)

## Table des matières

- [samp-query-node](#samp-query-node)
    - [Langues](#langues)
  - [Table des matières](#table-des-matières)
  - [À propos de l'API](#à-propos-de-lapi)
  - [Installation](#installation)
  - [Fonctionnalités](#fonctionnalités)
    - [Système de requête principal](#système-de-requête-principal)
  - [Structure de l'API](#structure-de-lapi)
    - [Classes principales](#classes-principales)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [Système de cache DNS](#système-de-cache-dns)
  - [Système de latence](#système-de-latence)
    - [Mesure du ping](#mesure-du-ping)
    - [Exemples d'utilisation](#exemples-dutilisation)
      - [1. Requête basique](#1-requête-basique)
      - [2. Requête avec options personnalisées](#2-requête-avec-options-personnalisées)
      - [3. Utilisation des Promises](#3-utilisation-des-promises)
      - [4. Surveillance continue](#4-surveillance-continue)
  - [Gestion des erreurs](#gestion-des-erreurs)
    - [1. Erreurs de connexion](#1-erreurs-de-connexion)
    - [2. Timeouts](#2-timeouts)
    - [3. Validation des données](#3-validation-des-données)
  - [Considérations de performance](#considérations-de-performance)
    - [Optimisations implémentées](#optimisations-implémentées)
  - [Limitations techniques](#limitations-techniques)
  - [Structure de réponse](#structure-de-réponse)
  - [Licence](#licence)
    - [Conditions](#conditions)

## À propos de l'API

**SA-MP Query Node** est une API développée spécifiquement pour interagir avec les serveurs SA-MP, permettant la collecte d'informations détaillées sur le serveur en temps réel. L'API utilise le protocole de requête natif de SA-MP et implémente plusieurs couches d'optimisation pour garantir des requêtes efficaces et fiables.

L'API a été conçue en mettant l'accent sur :
- La fiabilité des requêtes
- L'efficacité du traitement
- La facilité d'utilisation
- La gestion robuste des erreurs
- Le support complet de toutes les fonctionnalités du protocole SA-MP

## Installation

Clonez le dépôt sur votre machine locale :

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Fonctionnalités

### Système de requête principal

L'API offre un système de requête complet qui permet d'obtenir :

1. **Informations basiques du serveur :**
   - Nom du serveur
   - Mode de jeu actuel
   - Langue configurée
   - Statut de protection par mot de passe
   - Nombre maximum de joueurs
   - Nombre actuel de joueurs en ligne

2. **Liste détaillée des joueurs :**
   - ID du joueur
   - Nom du joueur
   - Score actuel
   - Latence (ping) du joueur

3. **Règles du serveur :**
   - Paramètres de compensation de lag
   - Météo actuelle
   - Autres règles personnalisées définies par le serveur

4. **Mesures de performance :**
   - Latence du serveur (ping)
   - Temps de réponse des requêtes
   - Statistiques de connexion

## Structure de l'API

### Classes principales

#### 1. DNS_Cache

```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

La classe **DNS_Cache** est responsable de :
- Stocker temporairement les résolutions DNS
- Optimiser les requêtes répétées
- Réduire la latence de connexion
- Gérer la durée de vie du cache

Méthodes principales :
- `Get_IP_Address(host_name)` : Résout et met en cache les adresses IP
- Cache automatique avec durée configurable (par défaut : 5 minutes)
- Fallback vers le hostname en cas d'échec de résolution

#### 2. Query_Manager

```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

Le **Query_Manager** contrôle :
- La gestion des requêtes actives
- Les timeouts et les tentatives
- Les événements de fin de requête
- Le nettoyage des requêtes expirées

Fonctionnalités :
- Système de retry automatique
- Contrôle du délai d'attente
- Gestion de multiples requêtes simultanées
- Émission d'événements de fin

#### 3. SAMP_Strings

```javascript
class SAMP_Strings {
    static charset = [/* jeu de caractères SA-MP */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Responsable de :
- Décodage des chaînes SA-MP
- Support des caractères spéciaux
- Nettoyage et assainissement des chaînes
- Conversion des buffers en texte

## Système de cache DNS

Le système de cache DNS est une partie cruciale de l'API, implémentant :

1. **Gestion du cache :**
   - Stockage efficace des résolutions DNS
   - Vérification de validité temporelle
   - Nettoyage automatique des entrées anciennes

2. **Optimisation des performances :**
   - Réduction des requêtes DNS redondantes
   - Amélioration du temps de réponse
   - Économie des ressources réseau

3. **Paramètres du cache :**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 minutes
   ```

4. **Gestion des échecs :**
   - Fallback vers le hostname original
   - Retry automatique en cas d'échecs temporaires
   - Journalisation des erreurs de résolution

## Système de latence

### Mesure du ping

Le système de mesure de latence implémente :

1. **Collecte d'échantillons :**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Traitement des résultats :**
   - Calcul de la moyenne de latence
   - Filtrage des valeurs atypiques
   - Détection des timeouts

3. **Optimisations :**
   - Échantillons multiples pour la précision
   - Intervalles configurables
   - Timeouts indépendants

### Exemples d'utilisation

#### 1. Requête basique

```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (erreur, reponse) => {
    if (erreur) {
        console.error('Erreur dans la requête :', erreur);
        return;
    }
    
    console.log('Informations du serveur :', reponse);
});
```

#### 2. Requête avec options personnalisées

```javascript
const options = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // timeout de 1.5 secondes
};

query(options, (erreur, reponse) => {
    if (erreur) {
        console.error('Erreur :', erreur);
        return;
    }
    
    console.log('Nom du serveur :', reponse.hostname);
    console.log('Joueurs :', reponse.onlinePlayers);
    console.log('Mode de jeu :', reponse.gamemode);
    
    // Traitement de la liste des joueurs
    reponse.players.forEach(joueur => {
        console.log(`${joueur.name}: ${joueur.score} points`);
    });
});
```

#### 3. Utilisation des Promises

```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Interroger_Serveur() {
    try {
        const info = await Query_Async('127.0.0.1:7777');
        
        console.log('Serveur :', info.hostname);
        console.log('Joueurs :', info.onlinePlayers);
        console.log('Ping :', info.ping, 'ms');
        
        // Traitement des règles du serveur
        if (info.rules.lagcomp === 'On') {
            console.log('Serveur avec compensation de lag activée');
        }
        
        // Liste des meilleurs joueurs
        const topJoueurs = info.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nTop 5 Joueurs :');
        topJoueurs.forEach((joueur, index) => {
            console.log(`${index + 1}. ${joueur.name}: ${joueur.score} points`);
        });
        
    } catch (erreur) {
        console.error('Erreur lors de l\'interrogation du serveur :', erreur);
    }
}
```

#### 4. Surveillance continue

```javascript
async function Surveiller_Serveur(adresse, intervalle = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`Démarrage de la surveillance de ${adresse}`);
    
    setInterval(async () => {
        try {
            const info = await Query_Async(adresse);
            
            console.log('\n=== Statut du Serveur ===');
            console.log(`Heure : ${new Date().toLocaleString()}`);
            console.log(`Joueurs : ${info.onlinePlayers}/${info.maxPlayers}`);
            console.log(`Ping : ${info.ping}ms`);
            console.log(`Mode : ${info.gamemode}`);
            
            if (info.onlinePlayers > 0) {
                console.log('\nJoueurs en ligne :');
                info.players.forEach(joueur => {
                    console.log(`- ${joueur.name} (Ping : ${joueur.ping}ms)`);
                });
            }
            
        } catch (erreur) {
            console.error('Erreur de surveillance :', erreur);
        }
    }, intervalle);
}
```

## Gestion des erreurs

L'API implémente un système robuste de gestion des erreurs :

### 1. Erreurs de connexion

```javascript
query('127.0.0.1:7777', (erreur, reponse) => {
    if (!reponse.hostname) {
        console.log('Serveur hors ligne ou inaccessible');
    }
});
```

### 2. Timeouts

```javascript
const options = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 secondes
};

query(options, (erreur, reponse) => {
    if (erreur) {
        console.log('Le serveur n\'a pas répondu dans le délai imparti');
    }
});
```

### 3. Validation des données

```javascript
query('127.0.0.1:7777', (erreur, reponse) => {
    // Vérifications de sécurité
    if (reponse.onlinePlayers > reponse.maxPlayers) {
        console.log('Données incohérentes reçues');
        return;
    }
    
    // Validation des joueurs
    reponse.players = reponse.players.filter(joueur => {
        return joueur.name && joueur.score >= 0 && joueur.ping >= 0;
    });
});
```

## Considérations de performance

### Optimisations implémentées

1. **Cache DNS :**
   - Réduction des requêtes DNS répétées
   - Cache avec durée de vie configurable
   - Nettoyage automatique du cache

2. **Gestion des connexions :**
   - Réutilisation des sockets quand possible
   - Timeouts optimisés
   - Système de retry intelligent

3. **Traitement des données :**
   - Parsing efficace des paquets
   - Validation optimisée des données
   - Gestion efficace de la mémoire

4. **Mesure de latence :**
   - Échantillons multiples pour la précision
   - Filtre des valeurs atypiques
   - Calcul optimisé des moyennes

## Limitations techniques

1. **Limitations du protocole :**
   - Taille maximale de paquet : 2048 octets
   - Maximum de joueurs interrogeables : 100
   - Timeout par défaut : 1000ms

2. **Limitations du cache :**
   - Temps maximum de cache DNS : 5 minutes
   - Limite d'entrées dans le cache

3. **Limitations réseau :**
   - Maximum de 3 tentatives par requête
   - Intervalle minimum entre tentatives : 150ms
   - Ping maximum valide : 800ms

4. **Limitations des données :**
   - Taille maximale des chaînes
   - Nombre maximum de règles du serveur
   - Limitations des caractères spéciaux

## Structure de réponse

L'API renvoie un objet détaillé avec toutes les informations du serveur :

```javascript
{
    // Informations de base
    address: "127.0.0.1", // Adresse du serveur
    port: 7777, // Port du serveur
    hostname: "Server", // Nom du serveur
    gamemode: "RolePlay", // Mode de jeu
    language: "Français", // Langue
    
    // Statut du serveur
    password: false, // Protection par mot de passe
    maxPlayers: 100, // Maximum de joueurs
    onlinePlayers: 45, // Joueurs en ligne
    ping: 58, // Latence en ms
    queryTime: 1635789012345, // Timestamp de la requête
    
    // Liste des joueurs
    players: [
        {
            id: 0, // ID du joueur
            name: "Calasans", // Nom
            score: 63, // Score
            ping: 117 // Ping du joueur
        },
    ],
    
    // Règles du serveur
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // Versions de clients autorisées
        artwork: 1, // Activation des artworks
        lagcomp: "On", // Statut de la compensation de lag
        mapname: "San Andreas", // Nom de la carte
        version: "0.3.7", // Version du serveur
        weather: 10, // ID de la météo
        weburl: "website.com", // URL du site web du serveur
        worldtime: "12:00" // Heure du monde dans le serveur
    }
}
```

## Licence

Cette API est protégée sous la Licence MIT, qui permet :
- ✔️ Utilisation commerciale et privée
- ✔️ Modification du code source
- ✔️ Distribution du code
- ✔️ Sous-licence

### Conditions

- Conserver l'avis de droits d'auteur
- Inclure une copie de la licence MIT

Pour plus de détails sur la licence : https://opensource.org/licenses/MIT

**Copyright (c) Calasans - Tous droits réservés**