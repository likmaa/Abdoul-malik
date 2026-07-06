'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Button } from '@/frontend/components/ui/Button';
import { Card, CardContent } from '@/frontend/components/ui/Card';
import { Badge } from '@/frontend/components/ui/Badge';
import dynamic from 'next/dynamic';
import DotFieldRaw from '@/frontend/components/DotField';
import ColorBendsRaw from '@/frontend/components/ColorBends';
import BorderGlowRaw from '@/frontend/components/BorderGlow';
import { useTranslations } from 'next-intl';

const DotField = DotFieldRaw as any;
const ColorBends = ColorBendsRaw as any;
const BorderGlow = BorderGlowRaw as any;

const Marquee = dynamic(() => import('react-fast-marquee'), {
  ssr: false,
  loading: () => <div className="h-20" />,
});

// Partner Item with clean glassmorphism styling instead of broken images
function PartnerItem({ name }: { name: string }) {
  return (
    <div className="mx-10 flex items-center justify-center h-20 flex-shrink-0">
      <span className="text-lg font-bold tracking-widest text-white/30 hover:text-white/70 transition-colors font-mono uppercase">
        {name}
      </span>
    </div>
  );
}

export default function Home() {
  const t = useTranslations('Home');

  const titles = useMemo(() => ["Product Manager", "Technology Strategist"], []);
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  // Tags dynamiques pour la carte hero
  const badge1Tags = useMemo(() => ["Product Strategy", "UI/UX Design", "Growth Hacking", "Agile Management", "Business Plan"], []);
  const badge2Tags = useMemo(() => ["Tech Leadership", "Architecture", "Team Building", "Code Review", "DevOps"], []);
  const badge3Tags = useMemo(() => ["Innovation", "Problem Solving", "AI Integration", "Performance", "Data Analytics"], []);
  const [badgeIndexes, setBadgeIndexes] = useState([0, 0, 0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBadgeIndexes(prev => [
        (prev[0] + 1) % badge1Tags.length,
        (prev[1] + 1) % badge2Tags.length,
        (prev[2] + 1) % badge3Tags.length,
      ]);
    }, 3500);
    return () => clearInterval(interval);
  }, [badge1Tags.length, badge2Tags.length, badge3Tags.length]);

  // Motion values pour l'effet 3D parallax
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth spring animations pour les valeurs de la souris
  const smoothX = useSpring(mouseX, { stiffness: 150, damping: 15 });
  const smoothY = useSpring(mouseY, { stiffness: 150, damping: 15 });

  // Transform pour la rotation 3D
  const rotateX = useTransform(smoothY, [-0.5, 0.5], [10, -10]);
  const rotateY = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);

  // Transform pour la position de l'effet de lumière (glow) en pourcentage
  const glowXPercent = useTransform(smoothX, [-0.5, 0.5], [20, 80]);
  const glowYPercent = useTransform(smoothY, [-0.5, 0.5], [20, 80]);

  // Gestion du mouvement de la souris pour l'effet 3D
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const x = (e.clientX - centerX) / rect.width;
    const y = (e.clientY - centerY) / rect.height;

    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  // Typing effect
  useEffect(() => {
    if (titles.length === 0) return;

    const currentTitle = titles[currentTitleIndex];
    if (!currentTitle) return;

    const typingSpeed = isDeleting ? 100 : 200;
    const pauseTime = isDeleting ? 50 : 3000;

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentTitle.length) {
        setDisplayedText(currentTitle.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentTitle.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && charIndex > 0) {
        setDisplayedText(currentTitle.substring(0, charIndex - 1));
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        setIsDeleting(false);
        setCurrentTitleIndex((prev) => (prev + 1) % titles.length);
      }
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentTitleIndex, titles]);

  return (
    <div className="flex flex-col min-h-screen bg-[#060608]">
      {/* Hero Section - Unifié Mobile & Desktop */}
      <section className="flex relative bg-[#060608] min-h-[100vh] w-full items-center overflow-hidden pt-16 pb-16 md:pt-16 md:pb-0">
        
        {/* React Bits Style ColorBends Background */}
        <div className="absolute inset-0 z-0">
          <ColorBends
            colors={["#1E1B4B", "#2E1065", "#0F172A"]}
            rotation={90}
            speed={0.2}
            scale={1}
            frequency={1}
            warpStrength={1}
            mouseInfluence={1}
            noise={0.15}
            parallax={0.5}
            iterations={1}
            intensity={1.5}
            bandWidth={6}
            transparent={true}
            autoRotate={0}
            color="#A855F7"
          />
        </div>

        {/* React Bits Style DotField Background */}
        <div className="absolute inset-0 z-0">
          <DotField
            dotRadius={1.0}
            dotSpacing={24}
            bulgeStrength={67}
            glowRadius={160}
            sparkle={false}
            waveAmplitude={0}
            cursorRadius={500}
            cursorForce={0.1}
            bulgeOnly={true}
            gradientFrom="#A855F7"
            gradientTo="#B497CF"
            glowColor="#120F17"
          />
        </div>

        <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center z-0">
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
        </div>

        <div className="max-w-[1200px] w-full mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mt-8 lg:mt-12">
            
            {/* Colonne Gauche : Texte et Boutons */}
            <div className="text-left pt-8">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-[#1a1a1a]/80 border border-white/10 mb-8 backdrop-blur-md shadow-sm">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <div key={star} className="bg-[#00b67a] p-0.5 rounded-sm">
                      <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="text-white font-medium">4.9/5</span>
                  <span className="text-gray-400">sur</span>
                  <span className="text-white font-bold flex items-center gap-1">
                    <svg className="w-5 h-5 text-[#00b67a]" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0l3.09 9.51h10.01l-8.1 5.88 3.09 9.51L12 19.02l-8.09 5.88 3.09-9.51L-.1 9.51h10.01z" />
                    </svg>
                    Trustpilot
                  </span>
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-[56px] font-semibold text-white mb-6 min-h-[2.5em] leading-[1.1] tracking-tight">
                J'accompagne vos <br className="hidden lg:block" />équipes en tant que <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-300 via-fuchsia-300 to-purple-300 font-bold">{displayedText || '\u00A0'}</span>
                <span className="animate-pulse text-violet-300 font-light ml-1">|</span>
              </h1>
              
              <div className="mb-8">
                <p className="text-base md:text-xl text-gray-300 max-w-xl leading-relaxed font-light">
                  Le véritable <span className="text-violet-400 font-bold">progrès technologique</span> est celui qui libère les individus et leur permet de réaliser pleinement leur potentiel.
                </p>
              </div>
              
              <div className="flex gap-4 flex-wrap mt-8">
                <Link
                  href="/contact"
                  className="flex items-center justify-center px-8 py-3 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl transition-colors font-bold text-sm tracking-wider uppercase shadow-[inset_0px_1px_0px_rgba(255,255,255,0.2),0px_4px_20px_rgba(168,85,247,0.4)]"
                >
                  Demandez un devis
                </Link>
                
                <a
                  href="https://github.com/likmaa"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-3 bg-[#111113] border border-white/10 text-white rounded-xl hover:bg-[#1a1a1e] transition-colors font-mono text-sm shadow-sm"
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  GitHub
                </a>
              </div>
            </div>

            {/* Colonne Droite : Creative Hero Section (Hologramme & Parallaxe) */}
            <div className="flex justify-center lg:justify-end items-center py-8 relative w-full">
              <motion.div
                className="relative w-full max-w-[400px] aspect-[3/4] mx-auto"
                style={{ perspective: 1200 }}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <motion.div
                  style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                  }}
                  className="w-full h-full relative group cursor-pointer"
                >
                  {/* Dynamic Lighting Background */}
                  <motion.div 
                    className="absolute inset-0 z-0 opacity-100 rounded-[2rem] pointer-events-none"
                    style={{
                      background: useTransform(
                        [glowXPercent, glowYPercent],
                        ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(138, 43, 226, 0.15) 0%, transparent 60%)`
                      ),
                      transform: "translateZ(-30px) scale(1.1)"
                    }}
                  />
                  
                  {/* Decorative glowing orb */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-violet-electric/10 rounded-full blur-3xl -z-10" />

                  {/* Dual Image Container */}
                  <div 
                    className="absolute inset-0 rounded-[1.5rem] overflow-hidden shadow-2xl z-10 bg-[#0a0a0a] border border-white/5"
                    style={{ transform: "translateZ(20px)" }}
                  >
                    {/* Header de fenêtre style Mac minimaliste */}
                    <div className="absolute top-0 left-0 right-0 h-12 bg-[#0a0a0a]/80 border-b border-white/5 flex items-center px-5 gap-2 z-20 backdrop-blur-xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></div>
                      <div className="ml-auto flex items-center">
                        <span className="text-[11px] font-medium text-gray-500 tracking-wider">PORTFOLIO.tsx</span>
                      </div>
                    </div>

                    <div className="absolute inset-0 pt-12">
                      {/* Image 1 : (Par défaut) */}
                      <img
                        src="/images/11.jpg"
                        alt="Abdoul Malik - Portrait"
                        className="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-105 group-hover:opacity-0"
                      />
                      {/* Image 2 : (Au survol) */}
                      <img
                        src="/images/12.jpg"
                        alt="Abdoul Malik - Portrait survol"
                        className="absolute inset-0 w-full h-full object-cover opacity-0 scale-95 transition-all duration-700 ease-in-out group-hover:scale-100 group-hover:opacity-100 pt-12"
                      />
                    </div>
                    
                    {/* Overlay subtil */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060608] via-transparent to-transparent pointer-events-none z-10" />
                  </div>

                  {/* Floating Glass Badges React Bits Style */}
                  <div style={{ transform: "translateZ(60px)" }} className="absolute inset-0 pointer-events-none z-30">
                    {/* Badge 1 */}
                    <motion.div
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-16 -right-6 md:-right-8 bg-[#111113] border border-white/10 shadow-xl px-4 py-2.5 rounded-lg flex items-center gap-2 overflow-hidden min-w-[140px]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-[#a855f7] flex-shrink-0"></div>
                      <motion.span 
                        key={badge1Tags[badgeIndexes[0]]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-300 font-medium text-xs tracking-wide whitespace-nowrap"
                      >
                        {badge1Tags[badgeIndexes[0]]}
                      </motion.span>
                    </motion.div>

                    {/* Badge 2 */}
                    <motion.div
                      animate={{ y: [0, 8, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute top-1/2 -left-6 md:-left-10 bg-[#111113] border border-white/10 shadow-xl px-4 py-2.5 rounded-lg flex items-center gap-2 overflow-hidden min-w-[140px]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></div>
                      <motion.span 
                        key={badge2Tags[badgeIndexes[1]]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-300 font-medium text-xs tracking-wide whitespace-nowrap"
                      >
                        {badge2Tags[badgeIndexes[1]]}
                      </motion.span>
                    </motion.div>

                    {/* Badge 3 */}
                    <motion.div
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                      className="absolute bottom-12 -right-4 md:-right-6 bg-[#111113] border border-white/10 shadow-xl px-4 py-2.5 rounded-lg flex items-center gap-2 overflow-hidden min-w-[140px]"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-400 flex-shrink-0"></div>
                      <motion.span 
                        key={badge3Tags[badgeIndexes[2]]}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-gray-300 font-medium text-xs tracking-wide whitespace-nowrap"
                      >
                        {badge3Tags[badgeIndexes[2]]}
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gradient Transition to Next Section */}
        <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[#0a0a0a] to-transparent z-10 pointer-events-none" />
      </section>
      
      {/* Section À Propos */}
      <section className="relative w-full min-h-[600px] bg-[#0a0a0a] flex items-center overflow-hidden">
        {/* Background Image on Left */}
        <div className="absolute inset-0 w-full md:w-1/2 h-full z-0">
          <img 
            src="/images/11.jpg" 
            alt="Abdoul Malik AKOGO" 
            className="absolute w-full h-[120%] -top-[10%] object-cover object-top"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-[#0a0a0a]/80 to-[#0a0a0a] md:bg-gradient-to-r md:from-black/30 md:via-[#0a0a0a]/90 md:to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a] opacity-80" />
        </div>

        <div className="max-w-[1400px] w-full mx-auto px-6 md:px-12 xl:px-20 relative z-10 py-20 flex justify-end">
          {/* Content aligned to the right on desktop */}
          <div className="w-full md:w-3/5 lg:w-1/2 flex flex-col justify-center">
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
                Product & Technology <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Leader</span>
              </h2>
              
              <p className="text-gray-300 font-light text-lg leading-relaxed mb-4">
                Entrepreneur du numérique passionné par la technologie, je transforme des problématiques métiers en solutions digitales concrètes en combinant stratégie produit, expérience utilisateur, technologies émergentes et intelligence artificielle.
              </p>
              
              <Link href="/about" className="inline-flex items-center text-violet-400 hover:text-fuchsia-400 text-sm font-medium transition-colors mb-12 group">
                Lire plus
                <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </motion.div>

            {/* Stats Animated */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
            >
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">5+</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Projets individuels</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">20+</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Projets collab/entreprise</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">100%</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Impact</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-bold text-white mb-1">5+ ans</span>
                <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Expérience tech</span>
              </div>
            </motion.div>

            {/* Button wrapped in BorderGlow */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="inline-block"
            >
              <div className="inline-block relative">
                <BorderGlow
                  edgeSensitivity={20}
                  glowColor="270 100 65"
                  backgroundColor="transparent"
                  borderRadius={12}
                  glowRadius={8}
                  glowIntensity={1}
                  coneSpread={30}
                  animated={true}
                  colors={['#c084fc', '#a855f7', '#60a5fa']}
                >
                  <Link
                    href="/about"
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#a855f7] hover:bg-[#9333ea] text-white rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 relative z-10 w-full h-full shadow-[inset_0px_1px_0px_rgba(255,255,255,0.2),0px_4px_20px_rgba(168,85,247,0.4)]"
                  >
                    Voir mon parcours complet
                  </Link>
                </BorderGlow>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* PROJETS PERSONNELS */}
      <section id="projects" className="py-24 bg-[#09090b] border-t border-white/5 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="text-sm font-bold text-violet-400 uppercase tracking-widest mb-2">Projets</h2>
            <h3 className="text-4xl font-bold text-white">Solutions conçues & développées</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-[#18181b] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all group flex flex-col justify-between">
              <div>
                <Badge className="mb-6 bg-violet-500/10 text-violet-300 border-none">Mobilité urbaine</Badge>
                <h4 className="text-2xl font-bold mb-4 text-white">TIC Miton</h4>
                <p className="text-gray-400 mb-6 leading-relaxed">Application VTC à Porto-Novo. Développée avec React Native. Premier service de transport numérique structuré de la ville.</p>
              </div>
              <a href="https://ticmiton.com" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-4">
                ticmiton.com <span aria-hidden="true">→</span>
              </a>
            </Card>

            <Card className="bg-[#18181b] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all group flex flex-col justify-between">
              <div>
                <Badge className="mb-6 bg-green-500/10 text-green-300 border-none">GreenTech</Badge>
                <h4 className="text-2xl font-bold mb-4 text-white">Klirô × Allô Lavage</h4>
                <p className="text-gray-400 mb-6 leading-relaxed">Plateforme de lavage automobile éco-responsable (waterless). Économie jusqu'à 200L d'eau par véhicule.</p>
              </div>
            </Card>

            <Card className="bg-[#18181b] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all group flex flex-col justify-between">
              <div>
                <Badge className="mb-6 bg-blue-500/10 text-blue-300 border-none">Cartographie</Badge>
                <h4 className="text-2xl font-bold mb-4 text-white">Karta Afrique</h4>
                <p className="text-gray-400 mb-6 leading-relaxed">Solution cartographique pour l'Afrique : adresses informelles, POI communautaires, zones non couvertes.</p>
              </div>
            </Card>

            <Card className="bg-[#18181b] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all group flex flex-col justify-between">
              <div>
                <Badge className="mb-6 bg-fuchsia-500/10 text-fuchsia-300 border-none">Intelligence Artificielle</Badge>
                <h4 className="text-2xl font-bold mb-4 text-white">AI Forge</h4>
                <p className="text-gray-400 mb-6 leading-relaxed">Outils d'IA pour entrepreneurs africains. Accompagnement dans l'intégration de modèles génératifs.</p>
              </div>
            </Card>

            <Card className="bg-[#18181b] p-8 rounded-3xl border border-white/5 hover:border-violet-500/30 transition-all group lg:col-span-2 flex flex-col justify-between">
              <div>
                <Badge className="mb-6 bg-rose-500/10 text-rose-300 border-none">Social & ONG</Badge>
                <h4 className="text-2xl font-bold mb-4 text-white">Fondation FAAZ</h4>
                <p className="text-gray-400 mb-6 leading-relaxed">Conception technique et développement complet de la plateforme pour la Fondation les Amis de A à Z. Plus de 500 bénéficiaires et 4 axes d'action sociale.</p>
              </div>
              <a href="https://lafaaz.org" target="_blank" rel="noopener noreferrer" className="text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-2 group-hover:gap-3 transition-all mt-4">
                lafaaz.org <span aria-hidden="true">→</span>
              </a>
            </Card>
          </div>
        </div>
      </section>

      {/* Témoignages - Défilement Horizontal */}
      <section className="py-20 bg-[#09090b] overflow-hidden border-t border-white/5 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16 text-white">
            Témoignages & Avis
          </h2>

          <div className="relative">
            <Marquee
              speed={40}
              gradient={true}
              gradientColor="#09090b"
              pauseOnHover={true}
              className="py-4"
            >
              {[
                { id: '1', name: 'Directeur TIC', initial: 'DT', rating: 5, text: 'Abdoul Malik a structuré notre équipe et lancé notre application VTC avec un grand succès.', product: 'TIC Miton', date: 'Récent' },
                { id: '2', name: 'CEO Yupi Global', initial: 'YG', rating: 5, text: 'La plateforme e-commerce livrée est performante et parfaitement adaptée au marché africain.', product: 'Yupimall', date: 'Récent' },
                { id: '3', name: 'Fondateur EIG', initial: 'FE', rating: 5, text: 'Un accompagnement rigoureux et une excellente maîtrise des aspects techniques et produit.', product: 'EIG Graphisme', date: 'Récent' }
              ].map((testimonial, index) => (
                <div key={`${testimonial.id}-${index}`} className="mx-4 w-[350px] flex-shrink-0">
                  <Card className="h-full bg-[#18181b] border border-white/5 shadow-lg">
                    <CardContent className="p-8 flex flex-col h-full">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-14 h-14 bg-violet-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-violet-400 font-bold text-lg">
                            {testimonial.initial}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 text-left">
                          <p className="font-bold text-lg text-white mb-1">
                            {testimonial.name}
                          </p>
                          <p className="text-sm text-gray-400 truncate">
                            {testimonial.product}
                          </p>
                        </div>
                      </div>

                      <div className="flex gap-1 mb-4">
                        {[...Array(testimonial.rating)].map((_, j) => (
                          <svg
                            key={j}
                            className="w-5 h-5 text-yellow-400 fill-current flex-shrink-0"
                            viewBox="0 0 20 20"
                          >
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>

                      <p className="text-gray-300 mb-6 italic text-base leading-relaxed text-left">
                        &quot;{testimonial.text}&quot;
                      </p>

                      <div className="pt-4 border-t border-white/5 text-left">
                        <p className="text-sm text-gray-500">
                          {testimonial.date}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Marquee>
          </div>
        </div>
      </section>

      {/* Partenaires */}
      <section className="py-12 bg-[#09090b] overflow-hidden border-t border-white/5">
        <Marquee
          speed={30}
          direction="right"
          gradient={true}
          gradientColor="#09090b"
          pauseOnHover={true}
          className="py-6"
        >
          {["TIC Miton", "Yupi Global", "Nadish", "Kêkênon", "Allô Lavage", "Nextmux", "Fondation FAAZ"].map((name, index) => (
            <PartnerItem key={`${name}-${index}`} name={name} />
          ))}
        </Marquee>
      </section>

      {/* FAQ & Contact Section */}
      <div className="relative border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-purple-950/20 to-[#060608]">
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'overlay',
            }}
          />
        </div>

        {/* FAQ */}
        <section className="py-20 relative z-10 text-white">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">
              Questions Fréquentes
            </h2>

            <div className="space-y-4">
              {[
                {
                  question: "Quels types de projets accompagnez-vous ?",
                  answer: "J'accompagne principalement des projets technologiques à fort impact, des applications mobiles (comme les solutions VTC ou de livraison) aux plateformes Web complexes et aux intégrations d'intelligence artificielle."
                },
                {
                  question: "Quelles sont vos compétences clés ?",
                  answer: "Mon double profil me permet d'intervenir sur la stratégie produit (Product Strategy, Agile/Scrum, Business Planning) et le développement technique (Next.js, React Native, intégrations API, Prompt Engineering)."
                },
                {
                  question: "Comment se déroule une collaboration ?",
                  answer: "Nous commençons par un diagnostic complet de votre besoin ou idée produit, puis nous définissons une roadmap de développement agile. Je travaille ensuite en étroite collaboration avec vos équipes techniques et métier."
                }
              ].map((item, index) => (
                <Disclosure key={index} as="div" className="bg-[#18181b]/60 backdrop-blur-md rounded-2xl shadow-xl border border-white/5">
                  {({ open }) => (
                    <>
                      <Disclosure.Button className="flex w-full justify-between items-center px-6 py-5 text-left text-lg font-semibold text-white hover:bg-white/5 transition-colors duration-200 rounded-2xl">
                        <span>{item.question}</span>
                        <motion.svg
                          className="w-5 h-5 text-white transition-transform duration-200"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </Disclosure.Button>
                      <Disclosure.Panel className="overflow-hidden">
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={open ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-5 pt-2">
                            <p className="text-gray-300 leading-relaxed">{item.answer}</p>
                          </div>
                        </motion.div>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>
              ))}
            </div>

            {/* Contact additionnel */}
            <div className="mt-16 text-center">
              <p className="text-gray-400 mb-6">
                Vous avez un projet en tête ou une question spécifique ?
              </p>
              <Link
                href="/contact"
                className="inline-block px-8 py-4 bg-white text-violet-950 rounded-xl font-bold text-sm tracking-wider uppercase transition-all duration-300 hover:bg-gray-100 hover:scale-105 shadow-lg"
              >
                Discutons de votre projet
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
