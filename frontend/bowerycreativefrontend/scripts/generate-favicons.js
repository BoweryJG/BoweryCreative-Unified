import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the SVG favicon
const svgPath = join(__dirname, '../public/favicon.svg');
const svgContent = readFileSync(svgPath, 'utf8');

// Sizes needed for Apple and other devices
const sizes = [
  { size: 16, name: 'favicon-16x16.png' },
  { size: 32, name: 'favicon-32x32.png' },
  { size: 57, name: 'apple-touch-icon-57.png' },
  { size: 60, name: 'apple-touch-icon-60.png' },
  { size: 72, name: 'apple-touch-icon-72.png' },
  { size: 76, name: 'apple-touch-icon-76.png' },
  { size: 114, name: 'apple-touch-icon-114.png' },
  { size: 120, name: 'apple-touch-icon-120.png' },
  { size: 144, name: 'apple-touch-icon-144.png' },
  { size: 152, name: 'apple-touch-icon-152.png' },
  { size: 180, name: 'apple-touch-icon.png' },
  { size: 192, name: 'android-chrome-192x192.png' },
  { size: 512, name: 'android-chrome-512x512.png' }
];

// Convert SVG to PNG for each size
async function generateFavicons() {
  for (const { size, name } of sizes) {
    try {
      await sharp(Buffer.from(svgContent))
        .resize(size, size)
        .png()
        .toFile(join(__dirname, '../public', name));
      console.log(`✓ Generated ${name}`);
    } catch (error) {
      console.error(`✗ Failed to generate ${name}:`, error.message);
    }
  }
  
  // Also create safari-pinned-tab.svg (monochrome version)
  const monoSvg = svgContent.replace(/#FFD700/g, '#000000');
  writeFileSync(join(__dirname, '../public/safari-pinned-tab.svg'), monoSvg);
  console.log('✓ Generated safari-pinned-tab.svg');
}

generateFavicons();