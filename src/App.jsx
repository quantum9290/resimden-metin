import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createWorker } from 'tesseract.js';
import { v4 as uuidv4 } from 'uuid';
import { UploadCloud, FileText, CheckCircle, XCircle, Download, Play, Loader, Image as ImageIcon, X } from 'lucide-react';
import './App.css';
import './modal.css';

function App() {
  const [files, setFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  // Settings
  const [useTur, setUseTur] = useState(true);
  const [useEng, setUseEng] = useState(true);
  const [cleanTestFormat, setCleanTestFormat] = useState(false);

  const fileInputRef = useRef(null);

  // Object URL'lerini takip edip unmount'ta temizle (bellek sızıntısını önler)
  const fileObjectUrlsRef = useRef([]);

  useEffect(() => {
    return () => {
      fileObjectUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    };
  }, []);

  // --- Preprocessing Function ---
  const preprocessImage = async (file) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const reader = new FileReader();

      reader.onload = (e) => {
        img.src = e.target.result;
      };

      img.onload = () => {
        const canvas = document.createElement('canvas');

        // Görüntüyü büyüt (Upscaling) — ama 4K+ görüntülerde OOM'u önlemek için 4000px ile sınırla
        const MAX_OUTPUT_PX = 4000;
        const desiredScale = 2.5;
        const scale = Math.min(desiredScale, MAX_OUTPUT_PX / img.width, MAX_OUTPUT_PX / img.height);
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Gri tonlama (Grayscale) — Tesseract'ın kendi kontrast algoritması daha iyi sonuç verir
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Luma (Standart Gri Tonlama)
          const gray = (r * 0.299) + (g * 0.587) + (b * 0.114);

          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }

        ctx.putImageData(imageData, 0, 0);

        resolve(canvas.toDataURL('image/png', 1.0));
      };

      img.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // --- File Handlers ---
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const processFiles = (newFiles) => {
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20 MB

    const addedFiles = Array.from(newFiles)
      .filter(file => {
        if (!validTypes.includes(file.type)) return false;
        if (file.size > MAX_FILE_SIZE_BYTES) {
          alert(`"${file.name}" dosyası çok büyük (${(file.size / 1024 / 1024).toFixed(1)} MB). Maksimum dosya boyutu 20 MB'dır.`);
          return false;
        }
        return true;
      })
      .map(file => {
        const previewUrl = URL.createObjectURL(file);
        fileObjectUrlsRef.current.push(previewUrl);
        return {
          id: uuidv4(),
          file,
          preview: previewUrl,
          status: 'pending',
          progress: 0,
          text: '',
          errorMsg: ''
        };
      });

    if (addedFiles.length > 0) {
      setFiles(prev => [...prev, ...addedFiles]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const cleanOcrText = (text, isTestMode) => {
    let lines = text.split('\n');
    let cleanedLines = lines.map(line => {
      let l = line.trim();

      // -- HER ZAMAN ÇALIŞACAK GENEL TEMİZLİK --

      l = l.replace(/(^|\s)[*?_~|=]+(\s|$)/g, ' ');
      l = l.replace(/^["'"]|["'"]$/g, '');
      l = l.replace(/^(\d+)\s*,\s*/, '$1. ');
      l = l.replace(/\s{2,}/g, ' ');

      // -- SADECE SINAV/TEST MODUNDA ÇALIŞACAK AGRESİF TEMİZLİK --
      if (isTestMode) {
        l = l.replace(/\s*[,m]*\s*\(\s*\d{1,3}\s*$/, '');
        l = l.replace(/\s*[*?=""]*\s*Puan\s*\)?\s*$/i, '');
        l = l.replace(/\s*\*\s*\[\s*$/, '');

        l = l.replace(/^[\[\]|()=©*~_]{1,4}\s*/, '');
        l = l.replace(/^L\s*\|\s*/, '');

        const fakeBullets = ['Bn', 'Hv', 'Vv', 'OJ', 'İvi', 'ME', 'E', 'a', 'n', 'J', 'L', 'm', 'z', 'NA', 'An', 'TI', 'DD', 'Cİ'];
        const bulletRegex = new RegExp(`^(?:${fakeBullets.join('|')})\\s+(?=[A-ZÇĞİÖŞÜ])`);
        l = l.replace(bulletRegex, '');

        l = l.replace(/^[A-ZÇĞİÖŞÜa-zçğıöşü0-9]{1,3}[\)\]]\s*/, '');
        l = l.replace(/^[\)\]]\s*/, '');

        l = l.replace(/^[0Oo]\s+(?=[A-ZÇĞİÖŞÜ])/g, '');

        if (fakeBullets.includes(l.trim())) return '';
      }

      return l.trim();
    });

    cleanedLines = cleanedLines.filter(line => line.length > 0);

    let finalLines = [];
    for (let i = 0; i < cleanedLines.length; i++) {
      let current = cleanedLines[i];
      if (finalLines.length > 0 && /^[a-zçğıöşü]/.test(current)) {
         finalLines[finalLines.length - 1] += " " + current;
      } else {
         finalLines.push(current);
      }
    }

    return finalLines.join('\n\n');
  };

  const startOcr = async () => {
    if (files.length === 0 || isProcessing) return;
    setIsProcessing(true);

    const pendingFiles = files.filter(f => f.status === 'pending' || f.status === 'error');
    if (pendingFiles.length === 0) {
      setIsProcessing(false);
      return;
    }

    const langs = [];
    if (useTur) langs.push('tur');
    if (useEng) langs.push('eng');

    const langString = langs.length > 0 ? langs.join('+') : 'eng';

    let worker;
    try {
      worker = await createWorker(langString, 1, {
        logger: m => {
          console.log(m);
          setFiles(prev => prev.map(f => f.status === 'processing' ? {
            ...f,
            progress: Math.round(m.progress * 100),
            statusMsg: m.status
          } : f));
        }
      });
    } catch (err) {
      console.error("Worker Creation Error:", err);
      alert(`Dil dosyaları yüklenirken hata oluştu. Lütfen internet bağlantınızı kontrol edin.\n\nHata detayı: ${err.message}`);
      setIsProcessing(false);
      return;
    }

    // try-finally garantisi: worker her durumda terminate edilir
    try {
      for (const item of pendingFiles) {
        setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'processing', progress: 0, statusMsg: 'Görüntü İşleniyor...' } : f));

        try {
          const processedImage = await preprocessImage(item.file);

          // 60 saniyelik timeout — bozuk görüntülerde uygulamanın donmasını önler
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('OCR zaman aşımına uğradı (60 sn). Görüntü bozuk veya çok büyük olabilir.')), 60_000)
          );

          const { data: { text } } = await Promise.race([
            worker.recognize(processedImage),
            timeoutPromise
          ]);

          const cleanedText = cleanOcrText(text, cleanTestFormat);

          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'done', progress: 100, text: cleanedText } : f));
        } catch (err) {
          console.error("OCR Error:", err);
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'error', progress: 0, errorMsg: err.message } : f));
        }
      }
    } finally {
      await worker.terminate();
      setIsProcessing(false);
    }
  };

  // --- Download Handlers ---
  const downloadSingle = (fileItem) => {
    if (!fileItem.text) return;
    const element = document.createElement("a");
    const file = new Blob([fileItem.text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${fileItem.file.name.replace(/\.[^/.]+$/, "")}_ocr.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const downloadAllCombined = () => {
    const doneFiles = files.filter(f => f.status === 'done');
    if (doneFiles.length === 0) return;

    let combinedText = "";
    doneFiles.forEach((fileItem, index) => {
      combinedText += `--- Belge ${index + 1}: ${fileItem.file.name} ---\n\n`;
      combinedText += fileItem.text;
      combinedText += `\n\n${"=".repeat(50)}\n\n`;
    });

    const element = document.createElement("a");
    const fileBlob = new Blob([combinedText], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(fileBlob);
    element.download = `Toplu_Ceviri_${new Date().getTime()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(element.href);
  };

  const downloadAllSeparate = () => {
    const doneFiles = files.filter(f => f.status === 'done');
    doneFiles.forEach(f => downloadSingle(f));
  };

  const removeFile = (id) => {
    setFiles(prev => {
      const fileToRemove = prev.find(f => f.id === id);
      if (fileToRemove?.preview) URL.revokeObjectURL(fileToRemove.preview);
      return prev.filter(f => f.id !== id);
    });
  };

  // Genel ilerleme (JSX içinde türetilen değerler)
  const doneCount = files.filter(f => f.status === 'done' || f.status === 'error').length;
  const overallPct = files.length > 0 ? Math.round((doneCount / files.length) * 100) : 0;

  return (
    <div className="app-container">
      <header className="header">
        <h1>AI OCR Dönüştürücü</h1>
        <p>Resimlerdeki metinleri ve matematik formüllerini %99 doğrulukla çıkarın.</p>
      </header>

      <main>
        <section className="glass-panel">
          <div
            className={`dropzone ${dragActive ? 'active' : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="upload-icon" />
            <h2>Resimleri Buraya Sürükleyin</h2>
            <p className="text-muted" style={{marginTop: '0.5rem'}}>veya dosyaları seçmek için tıklayın (JPG, PNG — maks. 20 MB)</p>
            <input
              type="file"
              multiple
              accept="image/jpeg, image/png, image/jpg"
              ref={fileInputRef}
              onChange={handleChange}
              style={{ display: 'none' }}
            />
          </div>

          <div className="lang-selector">
            <label className="lang-checkbox">
              <input type="checkbox" checked={useTur} onChange={e => setUseTur(e.target.checked)} />
              Türkçe
            </label>
            <label className="lang-checkbox">
              <input type="checkbox" checked={useEng} onChange={e => setUseEng(e.target.checked)} />
              İngilizce
            </label>
          </div>
          <div className="lang-selector" style={{ marginTop: '0.5rem' }}>
            <label className="lang-checkbox" title="Form, anket veya test kağıtlarındaki şık kutucuklarını, madde işaretlerini ve arayüz sembollerini otomatik temizler.">
              <input type="checkbox" checked={cleanTestFormat} onChange={e => setCleanTestFormat(e.target.checked)} />
              Gelişmiş Form/Test Temizleyici (Kutucuk, Şık vb. Sembolleri Sil)
            </label>
          </div>
        </section>

        {files.length > 0 && (
          <section className="glass-panel">
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
              <h2>
                Yüklenen Dosyalar ({files.length})
                {isProcessing && (
                  <span style={{fontSize: '0.82rem', fontWeight: 400, color: 'var(--text-muted)', marginLeft: '0.75rem'}}>
                    — Genel: %{overallPct} ({doneCount}/{files.length})
                  </span>
                )}
              </h2>
              <button
                className="btn btn-primary"
                onClick={startOcr}
                disabled={isProcessing || files.filter(f => f.status === 'pending').length === 0}
              >
                {isProcessing ? <Loader className="animate-spin" size={20}/> : <Play size={20}/>}
                {isProcessing ? 'İşleniyor...' : 'Çeviriyi Başlat'}
              </button>
            </div>

            <div className="file-grid">
              {files.map(fileItem => (
                <div className="file-card" key={fileItem.id}>
                  <div className="file-card-preview" onClick={() => setPreviewImage(fileItem.preview)}>
                    <div className="preview-frame">
                      <img
                        src={fileItem.preview}
                        alt="preview"
                        className="file-preview-image"
                        title="Büyütmek için tıklayın"
                      />
                    </div>
                  </div>

                  <div className="file-card-info">
                    <div className="file-card-header">
                      <span className="file-card-title" title={fileItem.file.name}>{fileItem.file.name}</span>
                      <span className={`status-badge status-${fileItem.status}`}>
                        {fileItem.status === 'pending' && 'Bekliyor'}
                        {fileItem.status === 'processing' && 'İşleniyor'}
                        {fileItem.status === 'done' && 'Tamamlandı'}
                        {fileItem.status === 'error' && 'Hata!'}
                      </span>
                    </div>

                    {fileItem.status === 'processing' && (
                      <span className="file-card-status-text">
                        {`Dosya: %${fileItem.progress} — ${fileItem.statusMsg || 'Başlıyor...'}`}
                      </span>
                    )}

                    {(fileItem.status === 'processing' || fileItem.status === 'done') && (
                      <div className="progress-container">
                        <div className="progress-bar" style={{width: `${fileItem.progress}%`}}></div>
                      </div>
                    )}

                    {fileItem.status === 'error' && fileItem.errorMsg && (
                      <p className="file-card-error">
                        {fileItem.errorMsg}
                      </p>
                    )}

                    <div className="file-card-actions">
                      {fileItem.status === 'done' && (
                        <button className="btn btn-primary btn-sm" onClick={() => downloadSingle(fileItem)} title="Metni İndir">
                          <Download size={16} /> İndir
                        </button>
                      )}
                      <button className="btn btn-danger-link btn-sm" onClick={() => removeFile(fileItem.id)} title="Sil">
                        <XCircle size={16} /> Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {files.filter(f => f.status === 'done').length > 0 && (
              <div className="actions-panel">
                <p>{files.filter(f => f.status === 'done').length} dosya çevrildi.</p>
                <div style={{display: 'flex', gap: '1rem'}}>
                  <button className="btn btn-secondary" onClick={downloadAllSeparate}>
                    <FileText size={18} /> Ayrı Ayrı İndir
                  </button>
                  <button className="btn btn-success" onClick={downloadAllCombined}>
                    <Download size={18} /> Tek Dosyada Birleştir
                  </button>
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="modal-overlay" onClick={() => setPreviewImage(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setPreviewImage(null)}>
              <X size={32} />
            </button>
            <img src={previewImage} alt="Full Preview" className="modal-image" />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
