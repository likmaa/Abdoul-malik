'use client';



interface PartnerLogo {
  name: string;
  logoPath: string;
  width: number;
  height: number;
  alt: string;
}

const partners: PartnerLogo[] = [
  {
    name: 'Apple',
    logoPath: '/logos/apple.svg',
    width: 120,
    height: 40,
    alt: 'Apple Logo',
  },
  {
    name: 'Sony',
    logoPath: '/logos/sony.svg',
    width: 120,
    height: 40,
    alt: 'Sony Logo',
  },
  {
    name: 'Husqvarna',
    logoPath: '/logos/husqvarna.svg',
    width: 150,
    height: 40,
    alt: 'Husqvarna Logo',
  },
  {
    name: 'STIHL',
    logoPath: '/logos/stihl.svg',
    width: 120,
    height: 40,
    alt: 'STIHL Logo',
  },
];

export function PartnerLogos() {
  return (
    <>
      {partners.map((partner) => (
        <div
          key={partner.name}
          className="mx-12 flex items-center justify-center h-16"
        >
          <div className="relative opacity-40 hover:opacity-70 transition-opacity duration-300">
            <img
              src={partner.logoPath}
              alt={partner.alt}
              className="h-12 w-auto object-contain filter grayscale"
              style={{ filter: 'grayscale(100%) opacity(0.6)' }}
              onError={(e) => {
                // Fallback si l'image n'existe pas
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.parentElement!.innerHTML = `<div class="text-4xl font-bold text-black-deep opacity-40">${partner.name}</div>`;
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}


