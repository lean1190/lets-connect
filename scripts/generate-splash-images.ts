#!/usr/bin/env node

import { existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');
const publicDir = join(projectRoot, 'public');
const splashDir = publicDir;

// Source image dimensions
const sourceImage = 'launch-2048x2732.png';
const sourcePath = join(splashDir, sourceImage);

// Target dimensions from the startupImage array
const targetDimensions = [
  { width: 640, height: 1136, filename: 'launch-640x1136.png' }, // iPhone 5/SE
  { width: 750, height: 1334, filename: 'launch-750x1334.png' }, // iPhone 6/7/8
  { width: 1242, height: 2208, filename: 'launch-1242x2208.png' }, // iPhone 6/7/8 Plus
  { width: 828, height: 1792, filename: 'launch-828x1792.png' }, // iPhone XR
  { width: 1125, height: 2436, filename: 'launch-1125x2436.png' }, // iPhone X/XS
  { width: 1242, height: 2688, filename: 'launch-1242x2688.png' }, // iPhone XS Max
  { width: 1170, height: 2532, filename: 'launch-1170x2532.png' }, // iPhone 12/13/14/15/16 (regular and Pro)
  { width: 1179, height: 2556, filename: 'launch-1179x2556.png' }, // iPhone 14/15/16 Pro
  { width: 1284, height: 2778, filename: 'launch-1284x2778.png' }, // iPhone 12/13 Pro Max
  { width: 1290, height: 2796, filename: 'launch-1290x2796.png' }, // iPhone 14/15 Pro Max
  { width: 1320, height: 2868, filename: 'launch-1320x2868.png' }, // iPhone 16 Pro Max
  { width: 1536, height: 2048, filename: 'launch-1536x2048.png' }, // iPad Mini/Air
  { width: 1668, height: 2224, filename: 'launch-1668x2224.png' } // iPad Pro 10.5"
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
