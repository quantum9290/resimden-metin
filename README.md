# AI OCR Dönüştürücü

Resimlerdeki (PNG, JPG) metinleri tarayıcıda, sunucuya hiçbir şey göndermeden çıkaran ücretsiz ve açık kaynaklı bir web uygulaması.

**Türkçe ve İngilizce** metin tanıma, sınav/form kağıtları için özel temizleme modu ve toplu indirme desteği içerir.

---

## Özellikler

- **Sürükle & Bırak veya Dosya Seç** — PNG ve JPG desteklenir (maksimum 20 MB/dosya)
- **%100 istemci taraflı** — Tesseract.js sayesinde tüm işlem cihazınızda gerçekleşir, dosyalarınız hiçbir sunucuya gönderilmez
- **Türkçe + İngilizce dil desteği** — tek başına veya birlikte kullanılabilir
- **Akıllı görüntü ön işleme** — 2.5× büyütme ve gri tonlamaya dönüştürme ile OCR doğruluğu artırılır
- **Sınav / Form Temizleyici** — kutucuk, şık ve madde işareti gibi OCR artifactlarını otomatik ayıklar
- **Toplu işlem** — birden fazla dosyayı aynı anda işleyin, ayrı ayrı veya tek bir birleşik metin dosyasında indirin
- **Gerçek zamanlı ilerleme** — her dosya için ayrı yüzde göstergesi

---

## Gereksinimler

| Araç | Minimum Sürüm | Notlar |
|------|---------------|--------|
| Node.js | **18** veya üzeri | npm de birlikte gelir |
| Tarayıcı | Chrome 90+, Firefox 90+, Edge 90+ | WebAssembly desteği zorunlu |
| İnternet | — | Yalnızca ilk açılışta Tesseract dil dosyaları (~50 MB) indirilir |

---

## Node.js Kurulumu (Hiç Yapmadıysanız)

> Node.js zaten kuruluysa bu adımı atlayın.

1. [nodejs.org](https://nodejs.org) adresine gidin.
2. Yeşil **LTS** butonuna tıklayıp kurulum dosyasını indirin.
3. İndirilen dosyayı çalıştırın ve kurulum sihirbazını takip edin (tüm seçenekleri varsayılan bırakın).
4. Kurulumu doğrulamak için terminal/komut istemi açın ve şunu yazın:

```
node --version
npm --version
```

Her ikisi de sürüm numarası gösteriyorsa kurulum tamamdır.

**Terminal nasıl açılır?**
- **Windows:** `Win + R` → `cmd` yazıp Enter
- **macOS:** `Cmd + Space` → `Terminal` yazıp Enter
- **Linux:** `Ctrl + Alt + T`

---

## Kurulum

### 1. Repoyu indirin

**Git kullanıyorsanız:**

```bash
git clone https://github.com/kullanici-adi/png-to-text.git
cd png-to-text
```

**Git yoksa:** Sağ üstteki yeşil **Code** butonuna tıklayıp **Download ZIP** seçin, ardından ZIP'i çıkartın.

### 2. Bağımlılıkları yükleyin

Proje klasörüne terminal açın ve şunu çalıştırın:

```bash
npm install
```

Bu komut `node_modules/` klasörünü oluşturur ve gerekli paketleri indirir. Sadece bir kez yapılır.

**Proje klasöründe terminal nasıl açılır?**
- **Windows:** Klasörü açın → adres çubuğuna `cmd` yazıp Enter
- **macOS / Linux:** Klasöre sağ tıklayın → "Terminalde Aç"

---

## Çalıştırma

```bash
npm run dev
```

Terminalde şuna benzer bir çıktı görünecek:

```
  VITE v8.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

Tarayıcınızda **http://localhost:5173** adresini açın — uygulama hazır.

> Sunucuyu durdurmak için terminalde `Ctrl + C` tuşlarına basın.

---

## Kullanım

1. PNG veya JPG dosyalarını büyük alanın üzerine sürükleyin ya da alana tıklayarak seçin.
2. **Dil seçeneklerini** ayarlayın (Türkçe / İngilizce / ikisi birden).
3. Sınav kağıdı veya form belgesi işliyorsanız **Gelişmiş Form/Test Temizleyici** kutucuğunu işaretleyin.
4. **Çeviriyi Başlat** butonuna tıklayın.
5. İşlem tamamlanınca dosyaları ayrı ayrı ya da tek bir birleşik metin dosyasında indirin.

> **İlk kullanımda not:** Tesseract.js, Türkçe ve İngilizce dil dosyalarını tarayıcı önbelleğine indirir (~50 MB). Bu indirme yalnızca bir kez gerçekleşir; sonraki kullanımlar çevrimdışı da çalışır.

---

## Production Build (Web Sunucusuna Yayınlama)

Statik dosyaları derlemek için:

```bash
npm run build
```

Çıktı `dist/` klasörüne yazılır. Bu klasörü Netlify, Vercel, GitHub Pages veya herhangi bir statik hosting hizmetine yükleyebilirsiniz.

Derlenen sürümü lokal olarak önizlemek için:

```bash
npm run preview
```

---

## Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|-------|-------|
| `npm: command not found` | Node.js kurulmamış. [nodejs.org](https://nodejs.org) adresinden LTS sürümünü yükleyin. |
| Port 5173 zaten kullanımda | `vite.config.js` dosyasına `server: { port: 3000 }` ekleyip farklı bir port belirleyin. |
| OCR sonucu boş çıkıyor | Görüntünün yeterli çözünürlükte olduğundan emin olun. Çok bulanık görsellerde başarı düşer. |
| Dil dosyaları indirilemiyor | İnternet bağlantınızı kontrol edin. Kurumsal ağlardaki proxy, CDN bağlantısını engelliyor olabilir. |
| `npm install` hata veriyor | Node.js sürümünüzün 18+ olduğunu `node --version` ile doğrulayın. |

---

## Proje Yapısı

```
png-to-text/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/          # Görseller
│   ├── App.jsx          # Ana bileşen — OCR mantığının tamamı burada
│   ├── App.css          # Bileşen stilleri
│   ├── index.css        # Global stiller ve CSS değişkenleri
│   ├── modal.css        # Görüntü önizleme modal stilleri
│   └── main.jsx         # React giriş noktası
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

---

## Teknoloji Yığını

| Teknoloji | Sürüm | Rol |
|-----------|-------|-----|
| React | 19 | Kullanıcı arayüzü |
| Vite | 8 | Geliştirme sunucusu ve derleme |
| Tesseract.js | 7 | OCR motoru (Türkçe + İngilizce) |
| lucide-react | — | İkonlar |
| uuid | — | Dosya ID üretimi |

---

## Lisans

[MIT](LICENSE) — Özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz.
