import sharp from 'sharp';
import fs from 'fs';

let inputPath = '';

// Olası tüm konumları ve isimleri kontrol et
if (fs.existsSync('logo-2.png')) {
  inputPath = 'logo-2.png';
} else if (fs.existsSync('public/logo-2.png')) {
  inputPath = 'public/logo-2.png';
} else if (fs.existsSync('logo.png')) {
  inputPath = 'logo.png';
} else if (fs.existsSync('public/logo.png')) {
  inputPath = 'public/logo.png';
}

if (!inputPath) {
  console.error('❌ Hata: logo-2.png veya logo.png dosyası projenizde bulunamadı!');
  console.log('Lütfen logonuzu VS Code\'da projenin ana klasörüne "logo-2.png" adıyla sürükleyip bırakın.');
  process.exit(1);
}

sharp(inputPath)
  .resize(160, 160)
  .webp({ quality: 80 })
  .toFile('public/logo.webp')
  .then(() => console.log(`✓ Logo (${inputPath}) başarıyla 1-3 KiB boyutuna optimize edildi ve public/logo.webp konumuna yazıldı!`))
  .catch(err => console.error(err));
