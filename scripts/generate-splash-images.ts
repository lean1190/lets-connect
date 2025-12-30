#!/usr/bin/env node

import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const splashDir = join(publicDir, 'splash');

// Source image dimensions
const sourceImage = 'launch-2048x2732.png';
const sourcePath = join(splashDir, sourceImage);

// Target dimensions from the startupImage array
const targetDimensions = [
  { width: 640, height: 1136, filename: 'launch-640x1136.png' },
  { width: 750, height: 1294, filename: 'launch-750x1294.png' },
  { width: 1242, height: 2148, filename: 'launch-1242x2148.png' },
  { width: 1125, height: 2436, filename: 'launch-1125x2436.png' },
  { width: 1536, height: 2048, filename: 'launch-1536x2048.png' },
  { width: 1668, height: 2224, filename: 'launch-1668x2224.png' }
  // 2048x2732 is the source, so we skip it
];

async function generateSplashImages() {
  // Ensure splash directory exists
  if (!existsSync(splashDir)) {
    mkdirSync(splashDir, { recursive: true });
    console.log(`Created directory: ${splashDir}`);
  }

  // Check if source image exists
  if (!existsSync(sourcePath)) {
    console.error(`Error: Source image not found at ${sourcePath}`);
    console.error('Please ensure the source image exists before running this script.');
    process.exit(1);
  }

  console.log(`Source image: ${sourcePath}`);
  console.log(`Generating ${targetDimensions.length} splash images...\n`);

  // Process each target dimension
  for (const { width, height, filename } of targetDimensions) {
    const outputPath = join(splashDir, filename);

    try {
      await sharp(sourcePath)
        .resize(width, height, {
          fit: 'cover',
          position: 'center'
        })
        .png()
        .toFile(outputPath);

      console.log(`✓ Generated: ${filename} (${width}x${height})`);
    } catch (error) {
      console.error(`✗ Failed to generate ${filename}:`, error);
    }
  }

  console.log('\n✓ All splash images generated successfully!');
}

generateSplashImages().catch((error) => {
  console.error('Error generating splash images:', error);
  process.exit(1);
});
