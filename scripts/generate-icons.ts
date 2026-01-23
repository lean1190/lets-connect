#!/usr/bin/env node

import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const appDir = join(projectRoot, 'src', 'app');

const sourceImage = 'logo.png';
const sourcePath = join(publicDir, sourceImage);

const iconConfigs = [
  { width: 32, height: 32, filename: 'favicon.ico', outputDir: appDir },
  { width: 512, height: 512, filename: 'icon.png', outputDir: appDir },
  { width: 180, height: 180, filename: 'apple-icon.png', outputDir: appDir },
  { width: 512, height: 512, filename: 'web-app-manifest-512x512.png', outputDir: publicDir },
  { width: 192, height: 192, filename: 'web-app-manifest-192x192.png', outputDir: publicDir }
];

async function generateIcons() {
  if (!existsSync(sourcePath)) {
    console.error(`Error: Source image not found at ${sourcePath}`);
    console.error('Please ensure the logo.png exists in the public directory.');
    process.exit(1);
  }

  console.log(`Source image: ${sourcePath}`);
  console.log(`Generating ${iconConfigs.length} icon files...\n`);

  for (const { width, height, filename, outputDir } of iconConfigs) {
    const outputPath = join(outputDir, filename);

    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
      console.log(`Created directory: ${outputDir}`);
    }

    try {
      const resizedLogo = await sharp(sourcePath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toBuffer();

      await sharp({
        create: {
          width,
          height,
          channels: 4,
          background: '1a1c24'
        }
      })
        .composite([{ input: resizedLogo, gravity: 'center' }])
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated: ${filename} (${width}x${height})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${filename}:`, error);
    }
  }

  console.log('\n✓ All icon files generated successfully!');
}

generateIcons().catch((error) => {
  console.error('Error generating icons:', error);
  process.exit(1);
});
