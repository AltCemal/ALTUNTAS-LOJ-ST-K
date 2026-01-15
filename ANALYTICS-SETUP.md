# Analytics ve Tracking Kurulum Rehberi

## ✅ Eklenen Kodlar

Projenize şu tracking kodları eklendi:
- ✅ Google Analytics 4 (GA4)
- ✅ Google Tag Manager (GTM)

## 🔧 Yapmanız Gerekenler

### 1. Google Analytics 4 Kurulumu

1. **Google Analytics hesabı açın:**
   - https://analytics.google.com adresine gidin
   - Google hesabınızla giriş yapın
   - "Yönetici" > "Hesap Oluştur" tıklayın

2. **Property (Özellik) oluşturun:**
   - Özellik adı: "Altuntaş Nakliyat"
   - Raporlama saat dilimi: "Türkiye"
   - Para birimi: "Türk Lirası (TRY)"

3. **Measurement ID'yi alın:**
   - "Veri Akışları" > "Web" seçin
   - Measurement ID'niz `G-XXXXXXXXXX` formatında olacak

4. **index.html dosyasında değiştirin:**
   ```html
   <!-- İki yerde G-XXXXXXXXXX yerine kendi ID'nizi yazın -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=G-BURAYA"></script>
   gtag('config', 'G-BURAYA');
   ```

### 2. Google Tag Manager Kurulumu

1. **Tag Manager hesabı açın:**
   - https://tagmanager.google.com adresine gidin
   - "Hesap Oluştur" tıklayın

2. **Container (Konteyner) oluşturun:**
   - Konteyner adı: "Altuntaş Nakliyat Website"
   - Hedef platform: "Web"

3. **Container ID'yi alın:**
   - Container ID'niz `GTM-XXXXXXX` formatında olacak

4. **index.html dosyasında değiştirin:**
   ```html
   <!-- İki yerde GTM-XXXXXXX yerine kendi ID'nizi yazın -->
   <!-- Head kısmında -->
   'https://www.googletagmanager.com/gtm.js?id=GTM-BURAYA'
   
   <!-- Body kısmında -->
   <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-BURAYA"
   ```

### 3. Diğer Servisler (Opsiyonel)

#### Google Search Console
1. https://search.google.com/search-console adresine gidin
2. "Özellik Ekle" > "URL Öneki" seçin
3. Site URL'nizi girin
4. Doğrulama için HTML tag metodunu seçin
5. Verilen meta tag'i `index.html` head bölümüne ekleyin

#### Bing Webmaster Tools
1. https://www.bing.com/webmasters adresine gidin
2. "Site Ekle" tıklayın
3. Site bilgilerini girin
4. Doğrulama için meta tag metodunu seçin

#### Yandex Webmaster
1. https://webmaster.yandex.com adresine gidin
2. "Site Ekle" tıklayın
3. Doğrulama adımlarını takip edin

## 📊 Test Etme

### Site Canlıya Çıktıktan Sonra:

1. **Google Analytics Test:**
   - Analytics hesabınıza gidin
   - "Gerçek Zamanlı" raporuna bakın
   - Sitenizi ziyaret edin
   - 1-2 dakika içinde ziyaretçi görünmeli

2. **Tag Manager Test:**
   - Tag Manager'da "Önizle" butonuna tıklayın
   - Sitenizi başka bir sekmede açın
   - Debug panel'de tag'lerin çalıştığını görün

3. **Chrome Extension ile Test:**
   - "Google Analytics Debugger" extension'ı kurun
   - Sitenizi ziyaret edin
   - Console'da GA izleme görünmeli

## ⚠️ Önemli Notlar

- **Localhost'ta çalışmaz:** Analytics ve Tag Manager sadece canlı domain'de çalışır
- **HTTPS gerekli:** SSL sertifikası olmadan bazı özellikler çalışmayabilir
- **Cookie izni:** KVKK/GDPR uyumluluğu için cookie consent banner eklemelisiniz
- **Privacy Policy:** Gizlilik politikası sayfası oluşturun

## 🎯 Sonraki Adımlar

1. ✅ Tracking kodları eklendi
2. ⏳ Hesap aç ve ID'leri al
3. ⏳ index.html'deki ID'leri güncelle
4. ⏳ Siteyi canlıya al
5. ⏳ Tracking'i test et
6. ⏳ Cookie consent ekle
7. ⏳ Privacy policy oluştur

## 📝 ID'leri Değiştirme Örneği

**Şu anki kod:**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
gtag('config', 'G-XXXXXXXXXX');
```

**Değiştirilmiş kod (örnek):**
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-ABC123XYZ"></script>
gtag('config', 'G-ABC123XYZ');
```

Kendi Measurement ID'nizi aldıktan sonra `G-XXXXXXXXXX` yerine yazın.
