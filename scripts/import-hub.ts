import { PrismaClient } from '@prisma/client';
import { config } from 'dotenv';
import { resolve } from 'path';
import fs from 'fs';

// Charger les variables d'environnement
config({ path: resolve(process.cwd(), '.env.local') });

const prisma = new PrismaClient();

interface ImportMapping {
    sku: string;
    name_es: string;
    name_fr?: string;
    description_es: string;
    description_fr?: string;
    priceHT: string; // key in source
    stock: string;
    brand: string;
    category: string;
    images: string; // key in source (comma separated)
}

/**
 * Script d'importation universel (Import Hub)
 * Usage: tsx scripts/import-hub.ts <file-path> <mapping-json-path>
 */
async function main() {
    const [filePath, mappingPath] = process.argv.slice(2);

    if (!filePath) {
        console.error('Usage: tsx scripts/import-hub.ts <file-path> [mapping-json-path]');
        process.exit(1);
    }

    console.log(`🚀 Starting import of ${filePath}...`);

    let data: any[] = [];
    if (filePath.endsWith('.json')) {
        data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } else if (filePath.endsWith('.csv')) {
        // Simple CSV parser (no external deps)
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim());
        const headers = lines[0].split(',').map(h => h.trim());
        data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim());
            const obj: any = {};
            headers.forEach((h, i) => {
                obj[h] = values[i];
            });
            return obj;
        });
    }

    // Default mapping if none provided
    const mapping: ImportMapping = mappingPath
        ? JSON.parse(fs.readFileSync(mappingPath, 'utf-8'))
        : {
            sku: 'sku',
            name_es: 'name_es',
            description_es: 'description_es',
            priceHT: 'price',
            stock: 'stock',
            brand: 'brand',
            category: 'category',
            images: 'images'
        };

    let count = 0;
    for (const item of data) {
        try {
            const sku = item[mapping.sku];
            if (!sku) continue;

            // Construction de l'objet produit
            const productData = {
                name: {
                    es: item[mapping.name_es] || item[mapping.sku],
                    fr: mapping.name_fr ? (item[mapping.name_fr] || item[mapping.name_es]) : item[mapping.name_es]
                },
                description: {
                    es: item[mapping.description_es] || "",
                    fr: mapping.description_fr ? (item[mapping.description_fr] || item[mapping.description_es]) : item[mapping.description_es]
                },
                priceHT: Math.round(parseFloat(item[mapping.priceHT]) * 100) || 0, // Convert to cents
                stock: parseInt(item[mapping.stock]) || 0,
                brand: item[mapping.brand] || "Generic",
                category: item[mapping.category] || "garden",
                images: item[mapping.images] ? item[mapping.images].split(';') : [],
                weight: 1.0, // Default weight
                dimensions: { length: 0, width: 0, height: 0 },
                defaultVATRate: 0.21, // Default ES VAT
                isActive: true,
                updatedAt: new Date()
            };

            await prisma.products.upsert({
                where: { sku },
                update: productData,
                create: {
                    ...productData,
                    id: crypto.randomUUID(),
                    sku: sku
                }
            });

            count++;
            if (count % 10 === 0) console.log(`📦 Imported ${count} products...`);
        } catch (error) {
            console.error(`❌ Error importing product ${item[mapping.sku]}:`, error);
        }
    }

    console.log(`✅ Import finished. Total products upserted: ${count}`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
