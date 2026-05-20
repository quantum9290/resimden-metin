# AI OCR Dönüştürücü — Resimden Metne

Tarayıcıda çalışan, **sunucuya hiçbir şey göndermeyen**, ücretsiz ve açık kaynaklı bir OCR (görselden yazıya) uygulaması. PNG / JPG dosyalarınızdaki metinleri **Türkçe ve İngilizce** olarak çıkarır.

> Sınav kağıtları, formlar, kitap sayfaları, fotoğraf çekimi notlar — hepsi tek tıkla yazıya dönüşür.

---

## İçindekiler

1. [Bu Proje Ne Yapıyor?](#bu-proje-ne-yapıyor)
2. [Hızlı Başlangıç (En Kolay Yol)](#hızlı-başlangıç-en-kolay-yol)
3. [Adım Adım Kurulum](#adım-adım-kurulum)
4. [Kullanım](#kullanım)
5. [Sık Karşılaşılan Sorunlar](#sık-karşılaşılan-sorunlar)
6. [Geliştirici Notları](#geliştirici-notları)
7. [Lisans](#lisans)

---

## Bu Proje Ne Yapıyor?

- **Sürükle & bırak** ile PNG/JPG dosyaları yüklersiniz (en fazla 20 MB/dosya).
- Tarayıcınızda çalışan **Tesseract.js** motoru görseldeki yazıyı tanır.
- Sonucu `.txt` dosyası olarak indirebilir veya hepsini tek dosyada birleştirebilirsiniz.
- **Hiçbir dosya internete yüklenmez.** Tüm işlem sizin bilgisayarınızda gerçekleşir.

### Öne Çıkan Özellikler

| Özellik | Açıklama |
|--------|----------|
| 🇹🇷 Türkçe + 🇬🇧 İngilizce | Tek başına veya birlikte kullanılabilir |
| Akıllı ön işleme | 2.5× büyütme + gri tonlama ile doğruluk artar |
| Sınav / Form temizleyici | Kutucuk, şık, madde işareti gibi gereksiz işaretleri otomatik ayıklar |
| Toplu işlem | Birden fazla dosyayı aynı anda işleyin |
| Gerçek zamanlı ilerleme | Her dosya için ayrı yüzde göstergesi |
| %100 çevrimdışı | İlk yüklemeden sonra internetsiz çalışır |

---

## Hızlı Başlangıç (En Kolay Yol)

> Windows kullanıyorsanız bu bölüm yeterli. Bilgisayarınızda Node.js'in kurulu olduğundan emin olun. ([Aşağıda nasıl kuracağınız anlatılıyor.](#1-nodejs-kurulumu-yalnızca-i̇lk-defa))

1. Bu repoyu indirin: sağ üstteki yeşil **Code** butonuna tıklayın → **Download ZIP** seçin → indirilen dosyayı çıkartın.
2. Çıkarttığınız klasöre girin.
3. **`baslat.bat`** dosyasına çift tıklayın.
4. Açılan tarayıcıda uygulamayı kullanmaya başlayın.

Bu kadar. `baslat.bat` gerekli her şeyi otomatik halleder:
- ✅ Node.js kontrolü yapar
- ✅ Eksik kütüphaneleri ilk seferde yükler (`npm install`)
- ✅ Sunucuyu başlatır
- ✅ Tarayıcıyı otomatik açar (`http://127.0.0.1:5173`)
- ✅ Tarayıcıyı kapattığınızda sunucuyu otomatik durdurur

---

## Adım Adım Kurulum

Hızlı başlangıç çalışmadıysa ya da macOS / Linux kullanıyorsanız aşağıdaki adımları takip edin.

### 1. Node.js Kurulumu (Yalnızca İlk Defa)

Bu projenin çalışması için **Node.js 18 veya üzeri** gerekir.

1. [https://nodejs.org](https://nodejs.org) adresine gidin.
2. Yeşil **LTS** butonuna basıp kurulum dosyasını indirin.
3. İndirilen dosyaya çift tıklayın, "Next → Next → Install" diyerek bitirin (hiçbir ayarı değiştirmeyin).
4. Kurulumu doğrulamak için:
   - **Windows:** `Win + R` → `cmd` yazıp Enter'a basın.
   - **macOS:** Spotlight'ta (`Cmd + Space`) "Terminal" arayıp açın.
   - **Linux:** Terminal'i açın.

   Ardından şu komutu yazın:

   ```bash
   node --version
   ```

   Eğer `v18.x.x` veya üzeri bir sürüm görüyorsanız hazırsınız demektir.

### 2. Projeyi İndirin

**Yöntem A — ZIP olarak (Git bilmiyorsanız):**
- GitHub sayfasında yeşil **Code** butonuna tıklayın → **Download ZIP** seçin.
- ZIP'i istediğiniz bir klasöre çıkartın.

**Yöntem B — Git ile:**

```bash
git clone https://github.com/<kullanici-adi>/<repo-adi>.git
cd <repo-adi>
```

### 3. Bağımlılıkları Yükleyin

Terminali proje klasöründe açın ve şunu çalıştırın:

```bash
npm install
```

> İlk kurulumda biraz beklemeniz gerekebilir. Bir kez yaptıktan sonra bir daha gerekmez.

### 4. Uygulamayı Başlatın

```bash
npm run dev
```

Terminalde şuna benzer bir mesaj göreceksiniz:

```
  VITE v8.x.x  ready in 500 ms
  ➜  Local:   http://localhost:5173/
```

Tarayıcıdan `http://localhost:5173` adresini açın. **Hepsi bu kadar.**

Sunucuyu durdurmak için terminalde `Ctrl + C` tuşlarına basın.

---

## Kullanım

1. Uygulama açıldığında karşınıza büyük bir yükleme alanı çıkar.
2. PNG / JPG dosyalarınızı alana **sürükleyin** veya alanı tıklayıp **dosya seçin**.
3. Aşağıdaki ayarları ihtiyacınıza göre düzenleyin:
   - **Türkçe** ve/veya **İngilizce** dilini seçin.
   - Sınav kağıdı, test veya form belgesi işliyorsanız **"Gelişmiş Form/Test Temizleyici"** kutucuğunu işaretleyin.
4. **"Çeviriyi Başlat"** butonuna tıklayın.
5. İşlem bitince:
   - Her dosyayı tek tek `.txt` olarak indirebilirsiniz.
   - Hepsini **tek bir birleşik metin dosyasında** indirebilirsiniz.

> 💡 **İlk kullanım notu:** Tesseract.js, Türkçe ve İngilizce dil dosyalarını tarayıcı önbelleğine indirir (~50 MB). Bu yalnızca bir kez gerçekleşir — sonraki kullanımlarınız çevrimdışı bile çalışır.

---

## Sık Karşılaşılan Sorunlar

| Sorun | Çözüm |
|-------|-------|
| `npm: command not found` veya `'npm' is not recognized` | Node.js kurulmamış. [nodejs.org](https://nodejs.org) adresinden LTS sürümünü yükleyin, bilgisayarı yeniden başlatın. |
| `baslat.bat` açılır açılmaz kapanıyor | Üzerine sağ tıklayın → "Yönetici olarak çalıştır" deneyin. Yine de olmuyorsa terminal yöntemini kullanın. |
| Port 5173 zaten kullanımda | `baslat.bat` bunu otomatik çözer. Terminal yöntemindeyseniz açık olan diğer `npm run dev` sekmesini kapatın veya `vite.config.js` içine `server: { port: 3000 }` ekleyin. |
| OCR sonucu boş geliyor | Görüntünün yeterince net ve yüksek çözünürlüklü olduğundan emin olun. Aşırı bulanık fotoğraflarda OCR başarısı düşer. |
| Dil dosyaları indirilemiyor | İnternet bağlantınızı kontrol edin. Kurumsal/okul ağlarındaki proxy CDN bağlantısını engelliyor olabilir — kişisel ağ ya da mobil hotspot deneyin. |
| `npm install` hata veriyor | `node --version` ile sürümünüzü kontrol edin. **18 veya üzeri** olmalı. Eski sürümünüz varsa Node.js'i yeniden yükleyin. |
| Sayfa açılıyor ama hiçbir şey görünmüyor | Tarayıcının WebAssembly desteklediğinden emin olun (Chrome 90+, Firefox 90+, Edge 90+). Çok eski tarayıcılar çalışmaz. |

---

## Geliştirici Notları

### Sistem Gereksinimleri

| Araç | Minimum Sürüm |
|------|---------------|
| Node.js | 18 veya üzeri |
| Tarayıcı | Chrome 90+, Firefox 90+, Edge 90+ |

### Proje Yapısı

```
.
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
├── LICENSE
└── README.md
```

### Kullanılabilir Komutlar

```bash
npm run dev       # Geliştirme sunucusunu başlat (http://localhost:5173)
npm run build     # Üretim için statik derleme yapar (dist/ klasörüne yazar)
npm run preview   # Derlenmiş sürümü lokal önizle
npm run lint      # ESLint ile kod kalite kontrolü
```

### Teknoloji Yığını

| Teknoloji | Sürüm | Rol |
|-----------|-------|-----|
| React | 19 | Kullanıcı arayüzü |
| Vite | 8 | Geliştirme sunucusu ve derleme |
| Tesseract.js | 7 | OCR motoru (Türkçe + İngilizce) |
| lucide-react | 1 | İkonlar |
| uuid | 14 | Dosya kimliği üretimi |

### Web Sunucusuna Yayınlamak İçin

```bash
npm run build
```

`dist/` klasörü oluşur. Bu klasörü olduğu gibi **Netlify**, **Vercel**, **GitHub Pages**, **Cloudflare Pages** veya başka herhangi bir statik hosting hizmetine yükleyebilirsiniz. Backend kurmanıza gerek yoktur — proje tamamen istemci taraflıdır.

---

## Katkıda Bulunma

Pull request'ler memnuniyetle karşılanır. Büyük değişiklikler için önce bir issue açıp tartışmayı tercih ederim.

---

## Lisans

[MIT Lisansı](LICENSE) — Özgürce kullanabilir, değiştirebilir ve dağıtabilirsiniz.
