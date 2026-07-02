import sharp from 'sharp';
import fs from 'fs';

let inputPath = fs.existsSync('public/logo.png') ? 'public/logo.png' : 'logo.png';

sharp(inputPath)
  .resize(128, 128) // Görüntülenen alanın tam 2 katı (Kusursuz netlik)
  .webp({ quality: 65, alphaQuality: 70 }) // Sıkıştırma oranını biraz artırdık
  .toFile('public/logo.webp')
  .then(() => console.log('✓ Logo daha agresif şekilde (128x128) optimize edildi!'))
  .catch(err => console.error(err));
