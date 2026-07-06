const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir);

async function convertImages() {
    console.log('🚀 Starting image optimization...');

    for (const file of files) {
        if (file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.png')) {
            const inputPath = path.join(publicDir, file);
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const outputPath = path.join(publicDir, `${baseName}.webp`);

            console.log(`📦 Converting: ${file} -> ${baseName}.webp`);

            try {
                await sharp(inputPath)
                    .resize(1920, null, { // Resize to max width 1920px
                        withoutEnlargement: true,
                        fit: 'inside'
                    })
                    .webp({ quality: 80 }) // Convert to WebP with 80% quality
                    .toFile(outputPath);

                console.log(`✅ Success: ${baseName}.webp`);
            } catch (err) {
                console.error(`❌ Error converting ${file}:`, err);
            }
        }
    }

    console.log('🏁 Optimization finished!');
}

convertImages();
