import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, PenTool, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  title: string;
  subtitle: string;
  tagline: string;
  image: string;
}

const slides: Slide[] = [
  {
    id: 1,
    title: 'O Brilho da Eternidade',
    subtitle: 'Brilhantes sublimes selecionados um a um sob as mais rígidas diretrizes internacionais.',
    tagline: 'COLEÇÃO DIAMANTES PUROS',
    image: '/src/assets/images/luxury_gold_ring_1779997963491.png'
  },
  {
    id: 2,
    title: 'A Realeza em Esmeraldas',
    subtitle: 'A espetacular gema colombiana abraçada por halos eternos de ouro branco 18 quilates.',
    tagline: 'COLEÇÃO IMPERATRIZ',
    image: '/src/assets/images/emerald_necklace_1779997979996.png'
  },
  {
    id: 3,
    title: 'Profundeza Cobalto',
    subtitle: 'Safiras azuis que capturam os segredos da noite estrelada esculpidas à mão por mestres artesãos.',
    tagline: 'COLEÇÃO ROYAL SUITE',
    image: '/src/assets/images/sapphire_earrings_1779998000010.png'
  }
];

interface HeroSliderProps {
  onBespokeClick: () => void;
}

export default function HeroSlider({ onBespokeClick }: HeroSliderProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + slides.length) % slides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
  };

  return (
    <div id="hero-slider" className="relative h-[480px] md:h-[600px] w-full overflow-hidden bg-[#0d0d0d] border-b border-[#dfb86c]/15">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 w-full h-full flex flex-col md:flex-row items-center justify-between"
        >
          {/* Imagem de Fundo/Gradiente para Mobile */}
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black via-black/80 to-transparent z-10" />
          
          {/* Lado Direito: Imagem da Joia */}
          <div className="absolute right-0 top-0 w-full md:w-1/2 h-full">
            <motion.img
              initial={{ scale: 1.1, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ duration: 6, ease: 'easeOut' }}
              src={slides[currentIndex].image}
              alt={slides[currentIndex].title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center"
            />
          </div>

          {/* Lado Esquerdo: Conteúdo */}
          <div className="relative z-20 w-full md:w-1/2 h-full flex flex-col justify-center px-6 sm:px-12 md:px-16 lg:px-20 pt-20 md:pt-0">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-[#dfb86c] text-xs font-mono tracking-[0.3em] uppercase mb-3 flex items-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              {slides[currentIndex].tagline}
            </motion.span>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#f4ebdc] font-light leading-tight tracking-wide mb-4"
            >
              {slides[currentIndex].title}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-[#a6a6a6] text-sm sm:text-base max-w-md font-sans font-light leading-relaxed mb-8"
            >
              {slides[currentIndex].subtitle}
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                id={`btn-order-bespoke-hero-${currentIndex}`}
                onClick={onBespokeClick}
                className="bg-gradient-to-r from-[#dfb86c] to-[#c5a059] text-[#0d0d0d] px-6 py-3 rounded-lg font-medium text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:shadow-[0_4px_15px_rgba(223,184,108,0.3)] cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                Encomenda Sob Medida
              </button>
            </motion.div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Controladores */}
      <div className="absolute bottom-6 left-6 md:left-20 z-30 flex items-center gap-3">
        <button
          id="hero-prev-btn"
          onClick={handlePrev}
          className="p-2.5 rounded-full border border-[#f4ebdc]/10 bg-black/40 text-[#f4ebdc] transition-all hover:border-[#dfb86c] hover:bg-black/80 cursor-pointer"
          aria-label="Slide anterior"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          id="hero-next-btn"
          onClick={handleNext}
          className="p-2.5 rounded-full border border-[#f4ebdc]/10 bg-black/40 text-[#f4ebdc] transition-all hover:border-[#dfb86c] hover:bg-black/80 cursor-pointer"
          aria-label="Próximo slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <span className="text-[#666] font-mono text-xs ml-4">
          0{currentIndex + 1} / 0{slides.length}
        </span>
      </div>

      {/* Indicadores Lineares */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#1a1a1a] z-30 flex">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`h-full transition-all duration-[6000ms] ease-linear ${
              i === currentIndex ? 'bg-[#dfb86c] w-full' : 'bg-transparent w-0'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
