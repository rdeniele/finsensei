const sharp = require('sharp');
const path = require('path');
const fs = require('fs').promises;
const toIco = require('to-ico');

const SOURCE_IMAGE = path.join(__dirname, '../public/finsensei.png');
const OUTPUT_DIR = path.join(__dirname, '../public');

async function generateIcons() {
  try {
    // Generate PWA icons
    await sharp(SOURCE_IMAGE)
      .resize(192, 192)
      .toFile(path.join(OUTPUT_DIR, 'icon-192x192.png'));

    await sharp(SOURCE_IMAGE)
      .resize(384, 384)
      .toFile(path.join(OUTPUT_DIR, 'icon-384x384.png'));

    await sharp(SOURCE_IMAGE)
      .resize(512, 512)
      .toFile(path.join(OUTPUT_DIR, 'icon-512x512.png'));

    // Generate apple-touch-icon
    await sharp(SOURCE_IMAGE)
      .resize(180, 180)
      .toFile(path.join(OUTPUT_DIR, 'apple-touch-icon.png'));

    // Generate favicon PNGs
    await sharp(SOURCE_IMAGE)
      .resize(32, 32)
      .toFile(path.join(OUTPUT_DIR, 'favicon-32x32.png'));

    await sharp(SOURCE_IMAGE)
      .resize(16, 16)
      .toFile(path.join(OUTPUT_DIR, 'favicon-16x16.png'));

    // Generate favicon.ico
    const images = await Promise.all([
      fs.readFile(path.join(OUTPUT_DIR, 'favicon-16x16.png')),
      fs.readFile(path.join(OUTPUT_DIR, 'favicon-32x32.png'))
    ]);
    
    const icoBuffer = await toIco(images);
    await fs.writeFile(path.join(OUTPUT_DIR, 'favicon.ico'), icoBuffer);

    // Generate OpenGraph image
    await sharp(SOURCE_IMAGE)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(OUTPUT_DIR, 'og-image.jpg'));

    // Generate Twitter image (same as OG image but with different name)
    await sharp(SOURCE_IMAGE)
      .resize(1200, 630, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 1 }
      })
      .toFile(path.join(OUTPUT_DIR, 'twitter-image.jpg'));

    console.log('✅ All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons(); 