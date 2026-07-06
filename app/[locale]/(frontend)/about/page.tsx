'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AboutPage() {
  const [activeSection, setActiveSection] = useState('intro');

    useEffect(() => {
    const handleScroll = () => {
      const sections = ['intro', 'experience', 'projects', 'companyProjects', 'volunteering', 'studies', 'certifications', 'skills'];
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { top, bottom } = element.getBoundingClientRect();
          // Offset by top navbar if any
          const elementTop = top + window.scrollY;
          const elementBottom = bottom + window.scrollY;
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            setActiveSection(section);
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
      setActiveSection(id);
    }
  };

  const experiences = [
    {
      company: 'Tournée Origine Light Tour (Artiste Fanicko)',
      role: 'Assistant en Gestion de Projet',
      date: 'Août 2025 — Présent',
      bullets: [
        "Assistant du Chef Projet (M. Marius WATEBA) pour cette tournée nationale de 8 villes célébrant les 10 ans de carrière de Fanicko.",
        "Appui à la coordination d'un projet à triple impact : grands concerts, don et installation de lampadaires solaires (ESOM), et formations à l'entrepreneuriat vert.",
        "Lead pour l'étape d'Abomey-Bohicon : mobilisation de 1 210 personnes, certification de 676 jeunes, et organisation d'une conférence avec panel d'entrepreneurs locaux."
      ],
    },
    {
      company: 'Naturopharma',
      role: 'Responsable Digital',
      date: 'Févr. 2025 — Présent',
      bullets: [
        "Mise en place du système de vente en ligne des produits parapharmaceutiques.",
        "Pilotage de la stratégie digitale, du e-commerce et de la communication numérique."
      ],
    },
    {
      company: 'TIC- Transport InterCité',
      role: 'Directeur Technique & Informatique',
      date: 'Oct. 2024 — Présent',
      bullets: [
        "Pilotage de la stratégie technique et numérique de l'entreprise.",
        "Conception et supervision du développement d'applications web et mobiles.",
        "Encadrement de l'équipe technique et coordination des projets digitaux."
      ],
    },
    {
      company: 'École Internationale de Graphisme du Bénin (EIG)',
      role: 'Enseignant en Développement Web & Informatique',
      date: 'Oct. 2024 — Présent',
      bullets: [
        "Animation de cours de développement web et d'informatique auprès des apprenants.",
        "Supervision d'équipes lors des hackathons organisés par l'école (rôle de Scrum Master).",
        "Membre du jury de soutenances et de hackathons à plusieurs reprises."
      ],
    },
    {
      company: 'Nextmux SAS',
      role: 'Gestionnaire de Projet & Directeur Administratif',
      date: 'Août 2023 — Juil. 2024',
      bullets: [
        "Pilotage de la gestion administrative et opérationnelle de l'entreprise.",
        "Coordination et suivi des projets IT et TIC menés par l'entreprise.",
        "Encadrement des équipes et supervision des relations avec les partenaires et clients."
      ],
    },
    {
      company: 'Team ABZ (Cabinet du Dr Arnaud ZANNOU)',
      role: 'Graphiste & Community Manager',
      date: 'Janv. 2023 — Juin 2023',
      bullets: [
        "Gestion de la communication digitale et animation des réseaux sociaux du cabinet (expert international et hydrologue).",
        "Création de supports graphiques pour diverses missions internationales."
      ]
    },
    {
      company: 'Expert IT Lab',
      role: 'Digital Marketer & Graphiste',
      date: 'Mars — Juil. 2023',
      bullets: [
        "Conception graphique et développement de la stratégie marketing digital.",
        "Communication visuelle pour une entreprise spécialisée en expertise IT et cybersécurité."
      ],
    }
  ];

  const personalProjects = [
    {
      name: 'Klirô × Allô Lavage',
      role: 'Fondateur & Porteur de projet',
      date: '2026 — En cours',
      bullets: [
        "Conception d'une plateforme digitale de lavage automobile éco-responsable à domicile à Cotonou, alliant lavage classique et technologie waterless.",
        "Partenariat stratégique exclusif avec Allô Lavage, opérateur expérimenté du mobile wash.",
        "Candidature présentée à l'appel à projets #CAP Innovation de l'Organisation Internationale de la Francophonie (OIF)."
      ]
    },
        {
      company: 'Aliho',
      role: 'Co-fondateur',
      date: 'En développement',
      bullets: [
        "Conception d'une solution cartographique et de géolocalisation pensée pour le continent africain.",
        "Intégration des réalités locales : adresses informelles, points d'intérêt communautaires, zones non couvertes par les plateformes mondiales."
      ]
    },
    {
      company: 'Kêkênon',
      role: 'Co-fondateur',
      date: 'En développement',
      bullets: [
        "Plateforme mobile de mise en relation intelligente pour les zémidjans (moto-taxis) au Bénin.",
        "Écosystème numérique complet : application Client, application Conducteur et back-office d'administration centralisé.",
        "Fonctionnalités clés : géolocalisation en temps réel, tarification transparente à l'avance et intégration des paiements Mobile Money."
      ]
    },
    {
      company: 'Nadish Food',
      role: 'Fondateur',
      date: 'En développement',
      bullets: [
        "Application mobile centralisée de commande de repas et d'alimentation générale à Cotonou (cuisine interne, restaurants partenaires et courses au marché).",
        "Architecture technique complète : Django 5 / DRF (Backend), React Native / Expo (Mobile), Next.js 15 (Dashboard Admin) et temps réel via WebSocket.",
        "Intégration de solutions de paiement locales (FedaPay) et authentification sécurisée par OTP SMS."
      ]
    },
        {
      company: 'AI Forge',
      role: 'Fondateur',
      date: 'En développement',
      bullets: [
        "Plateforme d'IA conçue pour accompagner et co-fonder des entreprises avec les entrepreneurs africains.",
        "Mise à disposition d'outils adaptés aux étapes clés de la création et du développement d'activité."
      ]
    }
  ];

  const volunteering = [
    {
      company: 'OJEMAO (Organisation de la Jeunesse Musulmane en Afrique de l\'Ouest)',
      role: 'Responsable à l\'Information et la Communication',
      date: 'En cours',
      bullets: [
        "Membre du Comité d'organisation du prochain Congrès et CIF de l'OJEMAO.",
        "Participation antérieure à l'AG et au CIF de l'OJEMAO au Togo en tant que membre de la commission Information et Communication.",
        "Représentant du Bénin au sein du Bureau National de Coordination (BNC-OJEMAO) de 2019 à 2023."
      ]
    },
    {
      company: 'ACEEMUB (Association Culturelle des Élèves et Étudiants Musulmans du Bénin)',
      role: 'Chargé des Relations et Affaires Extérieures / Membre',
      date: '2014 — 2023',
      bullets: [
        "Membre actif de l'association depuis 2014.",
        "Membre du Bureau Exécutif National (2019-2023) en charge du pilotage des relations extérieures et du développement.",
        "Coordination et participation active aux initiatives sous-régionales avec l'OJEMAO."
      ]
    }
  ];

  const enterpriseProjects = [
    {
      name: 'App mobile TIC Miton',
      role: 'Directeur Technique',
      date: 'En cours',
      bullets: [
        "Développement et conception de l'application mobile pour TIC Miton."
      ]
    },
    {
      name: 'Naturo pharma',
      role: 'Responsable Digital',
      date: 'Févr. 2025 — Présent',
      bullets: [
        "Mise en place du système de vente en ligne et élaboration de la stratégie digitale globale."
      ]
    },
    {
      name: 'La faaz',
      role: 'Lead',
      date: 'Terminé',
      bullets: [
        "Projet d'entreprise avec mise en place de solutions technologiques sur mesure."
      ]
    },
    {
      name: 'Yupi Global',
      role: 'Lead Developer',
      date: 'Terminé',
      bullets: [
        "Conception, design et développement complet du site web institutionnel de Yupi Global et yupimall, leur plateforme E-commerce."
      ]
    },
    {
      name: 'Nextmux',
      role: 'Directeur Administratif',
      date: 'Terminé',
      bullets: [
        "Gestion et supervision des opérations internes et technologiques."
      ]
    }
  ];

  const studies = [
    {
      degree: 'Certification en Gestion de Projet Numérique',
      school: 'Expert It School de Nextmux',
      date: '2023 — 2024'
    },
    {
      degree: 'Formation en Web Design',
      school: 'École Internationale de Graphisme du Bénin (EIG)',
      date: '2023'
    },
    {
      degree: 'Marketing Numérique',
      school: 'Google — Atelier Numérique',
      date: '2021 — 2022'
    },
    {
      degree: 'Formation en Graphisme & Design',
      school: "Aquil'Art Studio",
      date: '2019 — 2021'
    },
    {
      degree: 'Licence 1 & 2 — Chimie, Biologie, Géologie (CBG-FAST)',
      school: "Université d'Abomey-Calavi",
      date: '2018 — 2020'
    }
  ];

  const companyProjects = [
    {
      company: 'App mobile TIC Miton',
      role: 'Chef de Projet / Tech Lead',
      date: 'Projet d\'Entreprise',
      bullets: [
        "Projet de conception et developpement de plateforme web et mobile de VTC pour la ville de Porto-Novo."
      ],
      link: 'https://ticmiton.com'
    },
    {
      company: 'Naturo pharma',
      role: 'Responsable Digital',
      date: 'Projet d\'Entreprise',
      bullets: [
        "Plateforme E-commerce de vente de produit de santé et tout produit naturel."
      ],
      link: 'https://naturopharma.shop'
    },
    {
      company: 'La faaz',
      role: 'Consultant / Chef de Projet',
      date: 'Projet d\'Entreprise',
      bullets: [
        "Plateforme web de collecte de don et de recrutement de bénévole et stagiaire."
      ],
      link: 'https://lafaaz.org'
    },
    {
      company: 'Yupi Global',
      role: 'Conception et réalisation web',
      date: 'Projet d\'Entreprise',
      bullets: [
        "Conception, design et développement complet du site web institutionnel de Yupi Global et yupimall, leur plateforme E-commerce."
      ],
      link: 'https://yupiglobal.net'
    },
    {
      company: 'Nextmux',
      role: 'Gestionnaire de Projet',
      date: 'Projet d\'Entreprise',
      bullets: [
        "Participation à la conception de la première version de la plateforme web."
      ],
      link: 'https://nextmux.net'
    },
    {
      company: 'Plateforme OJEMAO 2026',
      role: 'Concepteur & Développeur Web',
      date: 'Projet d\'Entreprise',
      bullets: [
        "Conception de la plateforme web de gestion d'inscription et d'événement du D2C2026 et 11ème Congrès et CIF 2026 de l'OJEMAO."
      ],
      link: 'https://ojemao26.logtech.tech'
    }
  ];

  const certifications = [
    {
      title: 'Entrepreunariat Numérique',
      issuer: 'FORCE-N et ADPME, propulsé par Mastercard',
      date: 'En cours'
    },
    {
      title: 'IA pour tous',
      issuer: 'Certificat',
      date: 'En cours'
    },
    {
      title: 'Boostez votre productivité avec Copilot',
      issuer: 'Microsoft Learn / MTN Skills Academy',
      date: 'Mars 2026'
    },
    {
      title: 'Les fondamentaux d\'Internet',
      issuer: 'GSMA / MTN Skills Academy',
      date: 'Mars 2026'
    },
    {
      title: 'Les bases de l\'Intelligence Artificielle',
      issuer: 'MTN Skills Academy',
      date: 'Mars 2026'
    }
  ];

  return (
    <div className="min-h-screen bg-[#050508] text-white selection:bg-blue-500/30 font-sans">
      {/* Background Glow */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-900/10 via-[#050508] to-[#050508]"></div>

      <div className="relative z-10 flex flex-col md:flex-row max-w-[1400px] mx-auto min-h-screen">
        
        {/* Sidebar Navigation - Fixed on Desktop */}
        <nav className="hidden lg:flex w-[250px] fixed h-screen flex-col justify-center pl-12 border-r border-white/5">
          <ul className="space-y-6 relative">
            <li>
              <button onClick={() => scrollTo('experience')} className={`flex items-center gap-4 text-sm font-medium transition-colors ${activeSection === 'experience' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`h-[1px] transition-all duration-300 ${activeSection === 'experience' ? 'w-6 bg-white' : 'w-3 bg-gray-600'}`}></span>
                Parcours
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('projects')} className={`flex items-center gap-4 text-sm font-medium transition-colors ${activeSection === 'projects' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`h-[1px] transition-all duration-300 ${activeSection === 'projects' ? 'w-6 bg-white' : 'w-3 bg-gray-600'}`}></span>
                Projets Personnels
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('companyProjects')} className={`flex items-center gap-4 text-sm font-medium transition-colors ${activeSection === 'companyProjects' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`h-[1px] transition-all duration-300 ${activeSection === 'companyProjects' ? 'w-6 bg-white' : 'w-3 bg-gray-600'}`}></span>
                Projets d'Entreprise
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('volunteering')} className={`flex items-center gap-4 text-sm font-medium transition-colors ${activeSection === 'volunteering' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`h-[1px] transition-all duration-300 ${activeSection === 'volunteering' ? 'w-6 bg-white' : 'w-3 bg-gray-600'}`}></span>
                Associatif
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('studies')} className={`flex items-center gap-4 text-sm font-medium transition-colors ${activeSection === 'studies' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`h-[1px] transition-all duration-300 ${activeSection === 'studies' ? 'w-6 bg-white' : 'w-3 bg-gray-600'}`}></span>
                Études
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('certifications')} className={`flex items-center gap-4 text-sm font-medium transition-colors ${activeSection === 'certifications' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`h-[1px] transition-all duration-300 ${activeSection === 'certifications' ? 'w-6 bg-white' : 'w-3 bg-gray-600'}`}></span>
                Certifications
              </button>
            </li>
            <li>
              <button onClick={() => scrollTo('skills')} className={`flex items-center gap-4 text-sm font-medium transition-colors ${activeSection === 'skills' ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}>
                <span className={`h-[1px] transition-all duration-300 ${activeSection === 'skills' ? 'w-6 bg-white' : 'w-3 bg-gray-600'}`}></span>
                Compétences
              </button>
            </li>
          </ul>
        </nav>

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-[250px] flex flex-col lg:flex-row pt-24 lg:pt-32 p-6 md:p-12 lg:p-24 gap-12 lg:gap-24">
          
          {/* Left Column (Profile Info) - Sticky on Desktop */}
          <div className="w-full lg:w-[280px] flex-shrink-0">
            <div className="lg:sticky lg:top-32 flex flex-col items-center lg:items-start">
              {/* Profile Picture */}
              <div className="w-48 h-48 rounded-full overflow-hidden border border-white/10 mb-6 bg-black relative">
                <img src="/images/11.jpg" alt="Abdoul Malik AKOGO" className="w-full h-full object-cover object-top" />
                <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] pointer-events-none"></div>
              </div>
              
              {/* Location */}
              <div className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-6 px-4 py-2 rounded-full border border-white/5 bg-white/5 backdrop-blur-sm">
                <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Afrique/Cotonou
              </div>
              
              {/* Languages */}
              <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                <span className="px-4 py-1.5 bg-transparent border border-white/10 rounded-full text-xs font-medium text-gray-400">Français</span>
                <span className="px-4 py-1.5 bg-transparent border border-white/10 rounded-full text-xs font-medium text-gray-400">Anglais</span>
                <span className="px-4 py-1.5 bg-transparent border border-white/10 rounded-full text-xs font-medium text-gray-400">Arabe</span>
              </div>
            </div>
          </div>

          {/* Right Column (Content) */}
          <div className="flex-1 max-w-[800px]">
            {/* Schedule a call button */}
            <div className="flex justify-start mb-8">
              <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#1a2333] text-blue-400 rounded-full border border-blue-500/20 text-sm font-semibold hover:bg-[#1f2b40] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Schedule a call
                <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>

            {/* Name and Title */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 tracking-tight">Abdoul Malik AKOGO</h1>
            <h2 className="text-2xl md:text-3xl text-gray-400 font-normal mb-8">Product & Technology Leader</h2>

            {/* Social Badges */}
            <div className="flex flex-wrap gap-3 mb-16">
              <a href="https://github.com/likmaa" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                GitHub
              </a>
              <a href="https://www.linkedin.com/in/abdoul-malik-akogo-023b8819b/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                LinkedIn
              </a>
              <a href="mailto:call@abdoulmalik-akogo.logtech.tech" className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                Email
              </a>
              <a href="https://wa.me/229016950646" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 border border-white/10 rounded-full text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.888-4.435 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.88-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                WhatsApp
              </a>
            </div>

            {/* Introduction Section */}
            <section id="intro" className="mb-24 scroll-mt-32">
              <p className="text-gray-200 leading-relaxed text-lg font-medium mb-6">
                Entrepreneur du numérique passionné par la technologie et l'innovation, je conjugue compétences en design graphique et web, gestion de projets digitaux et leadership opérationnel.
              </p>
              <p className="text-gray-300 leading-relaxed text-lg font-light">
                Co-fondateur et porteur de plusieurs initiatives technologiques au Bénin (Klirô-Allô Lavage, Aliho, AI Forge), je m'engage à concevoir des solutions numériques utiles, durables et ancrées dans les réalités africaines. Ma double casquette d'enseignant et d'opérateur tech me permet de transmettre, de structurer et de piloter des équipes vers des résultats concrets.
              </p>
            </section>

            {/* Work Experience Section */}
            <section id="experience" className="mb-24 scroll-mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Expérience Professionnelle</h3>
              <div className="space-y-16">
                {experiences.map((exp: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">{exp.company}</h4>
                      <div className="text-[#38bdf8] font-medium text-sm mb-4">{exp.role}</div>
                      <ul className="space-y-3">
                        {exp.bullets.map((bullet: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="text-gray-300 leading-relaxed text-[15px]">{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="text-gray-400 text-sm font-medium whitespace-nowrap mt-1 sm:mt-0">
                      {exp.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projets Personnels Section */}
            <section id="projects" className="mb-24 scroll-mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Projets Personnels</h3>
              <div className="space-y-16">
                {personalProjects.map((proj: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">{proj.name || proj.company}</h4>
                      <div className="text-[#a855f7] font-medium text-sm mb-4">{proj.role}</div>
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {proj.bullets.map((bullet: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-gray-300 leading-relaxed text-[15px]">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {/* Actions */}
                      <div className="mt-4">
                        {(proj.date.toLowerCase().includes('développement') || proj.date.toLowerCase().includes('cours')) ? (
                          <Link href="/contact" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 text-purple-400 rounded-full border border-purple-500/20 text-xs font-semibold hover:bg-purple-500/20 transition-colors">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Collaborer / Investir
                          </Link>
                        ) : (
                          <a href="#" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 rounded-full border border-white/10 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors">
                            Voir le projet
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        )}
                      </div>
                    </div>
                    <div className="text-gray-400 text-sm font-medium whitespace-nowrap mt-1 sm:mt-0">
                      {proj.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Projets d'Entreprise Section */}
            <section id="companyProjects" className="mb-24 scroll-mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Projets d'Entreprise</h3>
              <div className="space-y-16">
                {companyProjects.map((proj: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">{proj.company}</h4>
                      <div className="text-[#a855f7] font-medium text-sm mb-4">{proj.role}</div>
                      {proj.bullets && proj.bullets.length > 0 && (
                        <ul className={`space-y-3 ${(proj as any).link ? 'mb-6' : ''}`}>
                          {proj.bullets.map((bullet: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-gray-300 leading-relaxed text-[15px]">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {/* Actions */}
                      {(proj as any).link && (
                        <div className="mt-4">
                          <a href={(proj as any).link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-gray-300 rounded-full border border-white/10 text-xs font-semibold hover:bg-white/10 hover:text-white transition-colors">
                            Voir le projet
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm font-medium whitespace-nowrap mt-1 sm:mt-0">
                      {proj.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Volunteering Section */}
            <section id="volunteering" className="mb-24 scroll-mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Expérience Associative et Communautaire</h3>
              <div className="space-y-16">
                {volunteering.map((vol: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">{vol.company}</h4>
                      <div className="text-[#38bdf8] font-medium text-sm mb-4">{vol.role}</div>
                      {vol.bullets.length > 0 && (
                        <ul className="space-y-3">
                          {vol.bullets.map((bullet: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-3">
                              <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mt-2 flex-shrink-0"></span>
                              <span className="text-gray-300 leading-relaxed text-[15px]">{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <div className="text-gray-400 text-sm font-medium whitespace-nowrap mt-1 sm:mt-0">
                      {vol.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>



            {/* Studies Section */}
            <section id="studies" className="mb-24 scroll-mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Études & Formations</h3>
              <div className="space-y-10">
                {studies.map((study: any, index: number) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-2 sm:gap-8 justify-between items-start">
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-white mb-1">{study.degree}</h4>
                      <div className="text-gray-400 font-medium text-sm">{study.school}</div>
                    </div>
                    <div className="text-gray-500 text-sm font-medium whitespace-nowrap mt-1 sm:mt-0">
                      {study.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Certifications Section */}
            <section id="certifications" className="mb-24 scroll-mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Certifications Professionnelles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certifications.map((cert: any, index: number) => (
                  <div key={index} className="p-6 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
                      <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-bold text-white mb-2">{cert.title}</h4>
                    <p className="text-sm text-gray-400 mb-1">{cert.issuer}</p>
                    <p className="text-xs text-gray-500">{cert.date}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Technical Skills Section */}
            <section id="skills" className="mb-24 scroll-mt-32">
              <h3 className="text-3xl font-bold text-white mb-12 tracking-tight">Compétences Techniques</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-[#38bdf8] font-medium text-sm mb-4 uppercase tracking-wider">Design & Création Graphique</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Adobe Photoshop', 'Illustrator', 'InDesign', 'Express', 'Figma (UI/UX)'].map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 border border-white/10 rounded-md text-sm text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#38bdf8] font-medium text-sm mb-4 uppercase tracking-wider">Développement Web & Mobile</h4>
                  <div className="flex flex-wrap gap-2">
                    {['HTML/CSS', 'JavaScript', 'Next.js', 'React Native', 'PHP'].map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 border border-white/10 rounded-md text-sm text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#38bdf8] font-medium text-sm mb-4 uppercase tracking-wider">Gestion de Projet & Marketing</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Scrum Master', 'Marketing Numérique (Google)', 'Community Management', 'E-commerce'].map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 border border-white/10 rounded-md text-sm text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-[#38bdf8] font-medium text-sm mb-4 uppercase tracking-wider">Intelligence Artificielle</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Prompt Engineering', 'Microsoft Copilot', 'Claude AI', 'Google AI Studio'].map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 border border-white/10 rounded-md text-sm text-gray-300">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}
