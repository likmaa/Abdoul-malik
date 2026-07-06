/**
 * Script pour télécharger les logos de paiement depuis Simple Icons CDN
 * et les logos de partenaires
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public');

// Logos de paiement
const paymentLogos = [
  { name: 'visa', url: 'https://cdn.simpleicons.org/visa/1434CB', filename: 'visa.svg' },
  { name: 'mastercard', url: 'https://cdn.simpleicons.org/mastercard/EB001B', filename: 'mastercard.svg' },
  { name: 'paypal', url: 'https://cdn.simpleicons.org/paypal/003087', filename: 'paypal.svg' },
  { name: 'amex', url: 'https://cdn.simpleicons.org/americanexpress/006FCF', filename: 'amex.svg' },
  { name: 'stripe', url: 'https://cdn.simpleicons.org/stripe/635BFF', filename: 'stripe.svg' },
];

// Logos de partenaires - Électronique et Jardinage
const partnerLogos = [
  // Électronique - Smartphones & Ordinateurs
  { name: 'apple', url: 'https://cdn.simpleicons.org/apple/000000', filename: 'apple.svg' },
  { name: 'samsung', url: 'https://cdn.simpleicons.org/samsung/1428A0', filename: 'samsung.svg' },
  { name: 'sony', url: 'https://cdn.simpleicons.org/sony/000000', filename: 'sony.svg' },
  { name: 'lg', url: 'https://cdn.simpleicons.org/lg/A50034', filename: 'lg.svg' },
  { name: 'dell', url: 'https://cdn.simpleicons.org/dell/007DB8', filename: 'dell.svg' },
  { name: 'hp', url: 'https://cdn.simpleicons.org/hp/0096D6', filename: 'hp.svg' },
  { name: 'lenovo', url: 'https://cdn.simpleicons.org/lenovo/E2231A', filename: 'lenovo.svg' },
  { name: 'asus', url: 'https://cdn.simpleicons.org/asus/000000', filename: 'asus.svg' },
  { name: 'acer', url: 'https://cdn.simpleicons.org/acer/83B81A', filename: 'acer.svg' },
  { name: 'msi', url: 'https://cdn.simpleicons.org/msi/FF0000', filename: 'msi.svg' },
  
  // Électronique - Photo & Vidéo
  { name: 'nikon', url: 'https://cdn.simpleicons.org/nikon/000000', filename: 'nikon.svg' },
  { name: 'panasonic', url: 'https://cdn.simpleicons.org/panasonic/EB1923', filename: 'panasonic.svg' },
  { name: 'jbl', url: 'https://cdn.simpleicons.org/jbl/FF3300', filename: 'jbl.svg' },
  { name: 'google', url: 'https://cdn.simpleicons.org/google/4285F4', filename: 'google.svg' },
  { name: 'playstation', url: 'https://cdn.simpleicons.org/playstation/003087', filename: 'playstation.svg' },
  { name: 'intel', url: 'https://cdn.simpleicons.org/intel/0071C5', filename: 'intel.svg' },
  { name: 'amd', url: 'https://cdn.simpleicons.org/amd/ED1C24', filename: 'amd.svg' },
  { name: 'nvidia', url: 'https://cdn.simpleicons.org/nvidia/76B900', filename: 'nvidia.svg' },
  
  // Électronique - Autres marques
  { name: 'xiaomi', url: 'https://cdn.simpleicons.org/xiaomi/FF6900', filename: 'xiaomi.svg' },
  { name: 'oneplus', url: 'https://cdn.simpleicons.org/oneplus/EB0028', filename: 'oneplus.svg' },
  { name: 'canon', url: 'https://cdn.simpleicons.org/canon/000000', filename: 'canon.svg' },
  { name: 'xbox', url: 'https://cdn.simpleicons.org/xbox/107C10', filename: 'xbox.svg' },
  { name: 'nintendo', url: 'https://cdn.simpleicons.org/nintendo/E60012', filename: 'nintendo.svg' },
  { name: 'razer', url: 'https://cdn.simpleicons.org/razer/00FF00', filename: 'razer.svg' },
  { name: 'logitech', url: 'https://cdn.simpleicons.org/logitech/00B8FC', filename: 'logitech.svg' },
  
  // Jardinage & Outils
  { name: 'husqvarna', url: 'https://cdn.simpleicons.org/husqvarna/27378C', filename: 'husqvarna.svg' },
  { name: 'stihl', url: 'https://cdn.simpleicons.org/stihl/000000', filename: 'stihl.svg' },
  { name: 'bosch', url: 'https://cdn.simpleicons.org/bosch/EA0016', filename: 'bosch.svg' },
];

async function downloadFile(url, filepath) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const fileStream = fs.createWriteStream(filepath);
        response.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          console.log(`✓ Téléchargé: ${path.basename(filepath)}`);
          resolve();
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        // Suivre les redirections
        downloadFile(response.headers.location, filepath).then(resolve).catch(reject);
      } else {
        reject(new Error(`Erreur ${response.statusCode} pour ${url}`));
      }
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllLogos() {
  console.log('📥 Téléchargement des logos...\n');

  // Créer les dossiers si nécessaire
  const paymentLogosDir = path.join(publicDir, 'payment-logos');
  const logosDir = path.join(publicDir, 'logos');

  if (!fs.existsSync(paymentLogosDir)) {
    fs.mkdirSync(paymentLogosDir, { recursive: true });
  }
  if (!fs.existsSync(logosDir)) {
    fs.mkdirSync(logosDir, { recursive: true });
  }

  // Télécharger les logos de paiement
  console.log('Logos de paiement:');
  for (const logo of paymentLogos) {
    const filepath = path.join(paymentLogosDir, logo.filename);
    try {
      await downloadFile(logo.url, filepath);
    } catch (error) {
      console.error(`✗ Erreur pour ${logo.name}:`, error.message);
    }
  }

  // Télécharger les logos de partenaires
  console.log('\nLogos de partenaires:');
  let successCount = 0;
  let errorCount = 0;
  for (const logo of partnerLogos) {
    const filepath = path.join(logosDir, logo.filename);
    try {
      // Télécharger même si existe déjà (option --force pourrait être ajoutée plus tard)
      await downloadFile(logo.url, filepath);
      successCount++;
    } catch (error) {
      // Si le logo existe déjà, ne pas considérer comme erreur
      if (fs.existsSync(filepath)) {
        console.log(`⊘ Déjà existant: ${logo.filename}`);
        successCount++;
      } else {
        console.error(`✗ Erreur pour ${logo.name}:`, error.message);
        errorCount++;
      }
    }
  }
  
  console.log(`\n📊 Résumé: ${successCount} logos téléchargés, ${errorCount} erreurs`);

  console.log('\n✅ Téléchargement terminé!');
}

downloadAllLogos().catch(console.error);

