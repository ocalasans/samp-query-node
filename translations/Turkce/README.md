# samp-query-node

SA-MP (San Andreas Multiplayer) sunucularını sorgulamak ve OPEN.MP (Open Multiplayer) ile uyumlu **Node.js** ortamları için tasarlanmış eksiksiz bir API. Gerçek zamanlı izleme ve bilgi toplama için gelişmiş özellikler sunar.

### Diller

- Português: [README](../../)
- Deutsch: [README](../Deutsch/README.md)
- English: [README](../English/README.md)
- Español: [README](../Espanol/README.md)
- Français: [README](../Francais/README.md)
- Italiano: [README](../Italiano/README.md)
- Polski: [README](../Polski/README.md)
- Русский: [README](../Русский/README.md)
- Svenska: [README](../Svenska/README.md)

## İçindekiler

- [samp-query-node](#samp-query-node)
    - [Diller](#diller)
  - [İçindekiler](#i̇çindekiler)
  - [API Hakkında](#api-hakkında)
  - [Kurulum](#kurulum)
  - [Özellikler](#özellikler)
    - [Ana Sorgulama Sistemi](#ana-sorgulama-sistemi)
  - [API Yapısı](#api-yapısı)
    - [Ana Sınıflar](#ana-sınıflar)
      - [1. DNS\_Cache](#1-dns_cache)
      - [2. Query\_Manager](#2-query_manager)
      - [3. SAMP\_Strings](#3-samp_strings)
  - [DNS Önbellek Sistemi](#dns-önbellek-sistemi)
  - [Gecikme Sistemi](#gecikme-sistemi)
    - [Ping Ölçümü](#ping-ölçümü)
    - [Kullanım Örnekleri](#kullanım-örnekleri)
      - [1. Temel Sorgu](#1-temel-sorgu)
      - [2. Özel Seçeneklerle Sorgu](#2-özel-seçeneklerle-sorgu)
      - [3. Promise Kullanımı](#3-promise-kullanımı)
      - [4. Sürekli İzleme](#4-sürekli-i̇zleme)
  - [Hata İşleme](#hata-i̇şleme)
    - [1. Bağlantı Hataları](#1-bağlantı-hataları)
    - [2. Zaman Aşımları](#2-zaman-aşımları)
    - [3. Veri Doğrulama](#3-veri-doğrulama)
  - [Performans Değerlendirmeleri](#performans-değerlendirmeleri)
    - [Uygulanan Optimizasyonlar](#uygulanan-optimizasyonlar)
  - [Teknik Sınırlamalar](#teknik-sınırlamalar)
  - [Yanıt Yapısı](#yanıt-yapısı)
  - [Lisans](#lisans)
    - [Koşullar:](#koşullar)

## API Hakkında

**SA-MP Query Node**, SA-MP sunucularıyla etkileşim kurmak ve sunucu hakkında ayrıntılı bilgileri gerçek zamanlı olarak toplamak için özel olarak geliştirilmiş bir API'dir. API, SA-MP'nin yerel sorgu protokolünü kullanır ve verimli ve güvenilir sorgular sağlamak için çeşitli optimizasyon katmanları uygular.

API aşağıdaki noktalara odaklanarak tasarlanmıştır:
- Sorgu güvenilirliği
- İşlem verimliliği
- Kullanım kolaylığı
- Sağlam hata işleme
- SA-MP protokolünün tüm özelliklerine tam destek

## Kurulum

Depoyu yerel makinenize klonlayın:

```bash
git clone https://github.com/ocalasans/samp-query-node.git
```

## Özellikler

### Ana Sorgulama Sistemi

API, aşağıdakileri elde etmenizi sağlayan eksiksiz bir sorgulama sistemi sunar:

1. **Temel Sunucu Bilgileri:**
   - Sunucu adı
   - Mevcut oyun modu
   - Yapılandırılmış dil
   - Şifre koruma durumu
   - Maksimum oyuncu sayısı
   - Mevcut çevrimiçi oyuncu sayısı

2. **Ayrıntılı Oyuncu Listesi:**
   - Oyuncu kimliği
   - Oyuncu adı
   - Mevcut puan
   - Oyuncu gecikmesi (ping)

3. **Sunucu Kuralları:**
   - Gecikme telafisi ayarları
   - Mevcut hava durumu
   - Sunucu tarafından tanımlanan diğer özel kurallar

4. **Performans Ölçümleri:**
   - Sunucu gecikmesi (ping)
   - Sorgu yanıt süresi
   - Bağlantı istatistikleri

## API Yapısı

### Ana Sınıflar

#### 1. DNS_Cache

```javascript
class DNS_Cache {
    constructor() {
        this.cache = new Map();
        this.Resolve_DNS = promisify(dns.resolve4);
    }
}
```

**DNS_Cache** sınıfı şunlardan sorumludur:
- DNS çözümlerini geçici olarak depolama
- Tekrarlanan sorguları optimize etme
- Bağlantı gecikmesini azaltma
- Önbellek ömrünü yönetme

Ana yöntemler:
- `Get_IP_Address(host_name)`: IP adreslerini çözer ve önbelleğe alır
- Yapılandırılabilir süreyle otomatik önbellek (varsayılan: 5 dakika)
- Çözümleme başarısız olursa ana bilgisayar adına geri dönüş

#### 2. Query_Manager

```javascript
class Query_Manager extends EventEmitter {
    constructor() {
        super();
        this.Active_Queries = new Map();
    }
}
```

**Query_Manager** şunları kontrol eder:
- Aktif sorguların yönetimi
- Zaman aşımları ve yeniden denemeler
- Sorgu tamamlama olayları
- Süresi dolmuş sorguların temizlenmesi

Özellikler:
- Otomatik yeniden deneme sistemi
- Zaman aşımı kontrolü
- Birden çok eşzamanlı sorgu yönetimi
- Tamamlama olaylarının yayını

#### 3. SAMP_Strings

```javascript
class SAMP_Strings {
    static charset = [/* SA-MP karakter seti */];
    static Decode_String(buffer_data) { /* ... */ }
}
```

Şunlardan sorumludur:
- SA-MP dizelerinin çözülmesi
- Özel karakterlere destek
- Dize temizleme ve sanitizasyon
- Tamponları metne dönüştürme

## DNS Önbellek Sistemi

DNS önbellek sistemi, API'nin kritik bir parçasıdır ve şunları uygular:

1. **Önbellek Yönetimi:**
   - Verimli DNS çözümleme depolama
   - Zamansal geçerlilik kontrolü
   - Eski girişlerin otomatik temizlenmesi

2. **Performans Optimizasyonu:**
   - Gereksiz DNS sorgularının azaltılması
   - Yanıt süresinde iyileştirme
   - Ağ kaynaklarından tasarruf

3. **Önbellek Ayarları:**
   ```javascript
   const DNS_CACHE_TIME = 300000; // 5 dakika
   ```

4. **Hata İşleme:**
   - Ana bilgisayar adına geri dönüş
   - Geçici hatalarda otomatik yeniden deneme
   - Çözümleme hatalarının kaydedilmesi

## Gecikme Sistemi

### Ping Ölçümü

Gecikme ölçüm sistemi şunları uygular:

1. **Örnek Toplama:**
   ```javascript
   const LATENCY = {
       SAMPLES: 5,
       CHECK_INTERVAL: 50,
       TIMEOUT: 2000,
       MAX_VALID_PING: 800
   };
   ```

2. **Sonuç İşleme:**
   - Ortalama gecikme hesaplama
   - Aykırı değerleri filtreleme
   - Zaman aşımı tespiti

3. **Optimizasyonlar:**
   - Hassasiyet için çoklu örnekler
   - Yapılandırılabilir aralıklar
   - Bağımsız zaman aşımları

### Kullanım Örnekleri

#### 1. Temel Sorgu

```javascript
const query = require('samp-query-node');

query('127.0.0.1:7777', (hata, yanit) => {
    if (hata) {
        console.error('Sorgu hatası:', hata);
        return;
    }
    
    console.log('Sunucu bilgileri:', yanit);
});
```

#### 2. Özel Seçeneklerle Sorgu

```javascript
const secenekler = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 1500  // 1.5 saniye zaman aşımı
};

query(secenekler, (hata, yanit) => {
    if (hata) {
        console.error('Hata:', hata);
        return;
    }
    
    console.log('Sunucu adı:', yanit.hostname);
    console.log('Oyuncular:', yanit.onlinePlayers);
    console.log('Oyun modu:', yanit.gamemode);
    
    // Oyuncu listesini işleme
    yanit.players.forEach(oyuncu => {
        console.log(`${oyuncu.name}: ${oyuncu.score} puan`);
    });
});
```

#### 3. Promise Kullanımı

```javascript
const util = require('util');
const Query_Async = util.promisify(query);

async function Sunucu_Sorgula() {
    try {
        const bilgi = await Query_Async('127.0.0.1:7777');
        
        console.log('Sunucu:', bilgi.hostname);
        console.log('Oyuncular:', bilgi.onlinePlayers);
        console.log('Ping:', bilgi.ping, 'ms');
        
        // Sunucu kurallarını işleme
        if (bilgi.rules.lagcomp === 'On') {
            console.log('Gecikme telafisi etkin');
        }
        
        // En iyi oyuncuları listeleme
        const enIyiOyuncular = bilgi.players
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);
            
        console.log('\nEn İyi 5 Oyuncu:');
        enIyiOyuncular.forEach((oyuncu, index) => {
            console.log(`${index + 1}. ${oyuncu.name}: ${oyuncu.score} puan`);
        });
        
    } catch (hata) {
        console.error('Sunucu sorgulama hatası:', hata);
    }
}
```

#### 4. Sürekli İzleme

```javascript
async function Sunucu_Izle(adres, aralik = 60000) {
    const Query_Async = util.promisify(query);
    
    console.log(`${adres} izlemesi başlatılıyor`);
    
    setInterval(async () => {
        try {
            const bilgi = await Query_Async(adres);
            
            console.log('\n=== Sunucu Durumu ===');
            console.log(`Zaman: ${new Date().toLocaleString()}`);
            console.log(`Oyuncular: ${bilgi.onlinePlayers}/${bilgi.maxPlayers}`);
            console.log(`Ping: ${bilgi.ping}ms`);
            console.log(`Mod: ${bilgi.gamemode}`);
            
            if (bilgi.onlinePlayers > 0) {
                console.log('\nÇevrimiçi Oyuncular:');
                bilgi.players.forEach(oyuncu => {
                    console.log(`- ${oyuncu.name} (Ping: ${oyuncu.ping}ms)`);
                });
            }
            
        } catch (hata) {
            console.error('İzleme hatası:', hata);
        }
    }, aralik);
}
```

## Hata İşleme

API sağlam bir hata işleme sistemi uygular:

### 1. Bağlantı Hataları

```javascript
query('127.0.0.1:7777', (hata, yanit) => {
    if (!yanit.hostname) {
        console.log('Sunucu çevrimdışı veya erişilemez');
    }
});
```

### 2. Zaman Aşımları

```javascript
const secenekler = {
    host: '127.0.0.1',
    port: 7777,
    timeout: 2000  // 2 saniye
};

query(secenekler, (hata, yanit) => {
    if (hata) {
        console.log('Sunucu zaman aşımı süresinde yanıt vermedi');
    }
});
```

### 3. Veri Doğrulama

```javascript
query('127.0.0.1:7777', (hata, yanit) => {
    // Güvenlik kontrolleri
    if (yanit.onlinePlayers > yanit.maxPlayers) {
        console.log('Tutarsız veriler alındı');
        return;
    }
    
    // Oyuncu doğrulama
    yanit.players = yanit.players.filter(oyuncu => {
        return oyuncu.name && oyuncu.score >= 0 && oyuncu.ping >= 0;
    });
});
```

## Performans Değerlendirmeleri

### Uygulanan Optimizasyonlar

1. **DNS Önbelleği:**
   - Tekrarlanan DNS sorgularını azaltır
   - Yapılandırılabilir önbellek ömrü
   - Otomatik önbellek temizleme

2. **Bağlantı Yönetimi:**
   - Mümkün olduğunda soket yeniden kullanımı
   - Optimize edilmiş zaman aşım
   - Akıllı yeniden deneme sistemi

3. **Veri İşleme:**
   - Verimli paket ayrıştırma
   - Optimize edilmiş veri doğrulama
   - Verimli bellek yönetimi

4. **Gecikme Ölçümü:**
   - Hassasiyet için çoklu örnekler
   - Aykırı değerlerin filtrelenmesi
   - Optimize edilmiş ortalama hesaplama

## Teknik Sınırlamalar

1. **Protokol Sınırlamaları:**
   - Maksimum paket boyutu: 2048 bayt
   - Sorgulanabilir maksimum oyuncu: 100
   - Varsayılan zaman aşımı: 1000ms

2. **Önbellek Sınırlamaları:**
   - Maksimum DNS önbellek süresi: 5 dakika
   - Önbellek giriş limiti

3. **Ağ Sınırlamaları:**
   - Sorgu başına maksimum 3 deneme
   - Denemeler arası minimum aralık: 150ms
   - Geçerli maksimum ping: 800ms

4. **Veri Sınırlamaları:**
   - Maksimum dize boyutu
   - Maksimum sunucu kuralı sayısı
   - Özel karakter sınırlamaları

## Yanıt Yapısı

API, sunucu hakkındaki tüm bilgileri içeren ayrıntılı bir nesne döndürür:

```javascript
{
    // Temel bilgiler
    address: "127.0.0.1", // Sunucu adresi
    port: 7777, // Sunucu portu
    hostname: "Server", // Sunucu adı
    gamemode: "RolePlay", // Oyun modu
    language: "Türkçe", // Dil
    
    // Sunucu durumu
    password: false, // Şifre koruması
    maxPlayers: 100, // Maksimum oyuncu
    onlinePlayers: 45, // Çevrimiçi oyuncular
    ping: 58, // Gecikme (ms)
    queryTime: 1635789012345, // Sorgu zaman damgası
    
    // Oyuncu listesi
    players: [
        {
            id: 0, // Oyuncu kimliği
            name: "Calasans", // Ad
            score: 63, // Puan
            ping: 117 // Oyuncu pingi
        },
    ],
    
    // Sunucu kuralları
    rules: {
        allowed_clients: "0.3.7, 0.3.DL", // İzin verilen istemci versiyonları
        artwork: 1, // Artwork etkinleştirme
        lagcomp: "On", // Gecikme telafisi durumu
        mapname: "San Andreas", // Harita adı
        version: "0.3.7", // Sunucu versiyonu
        weather: 10, // Hava durumu kimliği
        weburl: "website.com", // Sunucu web sitesi URL'si
        worldtime: "12:00" // Sunucu dünya saati
    }
}
```

## Lisans

Bu API MIT Lisansı altında korunmaktadır ve şunlara izin verir:
- ✔️ Ticari ve özel kullanım
- ✔️ Kaynak kodunda değişiklik
- ✔️ Kodun dağıtımı
- ✔️ Alt lisanslama

### Koşullar:

- Telif hakkı bildirimini korumak
- MIT lisansının bir kopyasını eklemek

Lisans hakkında daha fazla bilgi için: https://opensource.org/licenses/MIT

**Copyright (c) Calasans - Tüm hakları saklıdır**