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
4. Kurulumu doğrulamak için `Win + R` → `cmd` yazıp Enter'a basın, ardından şunu yazın:

```
node --version
npm --version
```

Her ikisi de sürüm numarası gösteriyorsa kurulum tamamdır.

---

## Kurulum

### 1. Repoyu indirin

**Git kullanıyorsanız:**

```bash
git clone https://github.com/kullanici-adi/resim-den-metin.git
cd resim-den-metin
```

**Git yoksa:** Sağ üstteki yeşil **Code** butonuna tıklayıp **Download ZIP** seçin, ardından ZIP'i çıkartın.

---

## Çalıştırma

### Windows — Önerilen Yöntem

Proje klasöründeki **`baslat.bat`** dosyasına çift tıklayın.

`baslat.bat` otomatik olarak şunları yapar:
- Node.js kurulu değilse uyarı verir
- Port 5173 doluysa eski sunucuyu kapatır
- İlk çalıştırmada `npm install` ile bağımlılıkları kurar
- Sunucuyu arka planda başlatır
- Tarayıcıyı otomatik açar (`http://127.0.0.1:5173`)
- Tarayıcı sekmesini kapattığınızda sunucuyu otomatik durdurur

### macOS / Linux — Terminal ile

```bash
# 1. Bağımlılıkları yükle (yalnızca ilk seferde)
npm install

# 2. Geliştirme sunucusunu başlat
npm run dev
```

Tarayıcıda `http://localhost:5173` adresini açın. Sunucuyu durdurmak için terminalde `Ctrl + C` tuşlarına basın.

---

## Kullanım

1. PNG veya JPG dosyalarını büyük alana sürükleyin ya da alana tıklayarak seçin.
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
| `baslat.bat` açılıp kapanıyor | Sağ tıklayıp "Yönetici olarak çalıştır" deneyin. |
| Port 5173 zaten kullanımda | `baslat.bat` bunu otomatik çözer. Terminal kullanıyorsanız `vite.config.js` içine `server: { port: 3000 }` ekleyin. |
| OCR sonucu boş çıkıyor | Görüntünün yeterli çözünürlükte olduğundan emin olun. Çok bulanık görsellerde başarı düşer. |
| Dil dosyaları indirilemiyor | İnternet bağlantınızı kontrol edin. Kurumsal ağlardaki proxy, CDN bağlantısını engelliyor olabilir. |
| `npm install` hata veriyor | Node.js sürümünüzün 18+ olduğunu `node --version` ile doğrulayın. |

---

## Proje Yapısı

```
resim-den-metin/
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   └── hero.png
│   ├── App.jsx          # Ana bileşen — OCR mantığının tamamı burada
│   ├── App.css          # Bileşen stilleri
│   ├── index.css        # Global stiller ve CSS değişkenleri
│   ├── modal.css        # Görüntü önizleme modal stilleri
│   └── main.jsx         # React giriş noktası
├── baslat.bat           # Windows için tek tıkla başlatıcı
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── package-lock.json
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
