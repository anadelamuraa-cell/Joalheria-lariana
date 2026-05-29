import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Shield, Tag, Gem, Award, PenTool } from 'lucide-react';
import { Product } from '../types';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onSelectForBespoke: (productName: string) => void;
}

export default function QuickViewModal({ product, onClose, onSelectForBespoke }: QuickViewModalProps) {
  if (!product) return null;

  // Formatador de Preço
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <AnimatePresence>
      <div id="quickview-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
        {/* Camada clicável externa de fechamento */}
        <div className="absolute inset-0 cursor-default" onClick={onClose} />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-[#121212] border border-[#dfb86c]/30 rounded-2xl overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.8)] z-10 grid grid-cols-1 md:grid-cols-12"
        >
          {/* Botão de Fechar */}
          <button
            id="qv-close-btn"
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2 text-[#a6a6a6] hover:text-[#dfb86c] bg-[#1a1a1a]/80 rounded-full transition-colors cursor-pointer"
            aria-label="Fechar modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Lado Esquerdo: Imagem do Produto (md: 5 colunas) */}
          <div className="relative md:col-span-5 aspect-square md:aspect-auto md:h-full min-h-[300px] bg-[#181818] overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
            {product.exclusive && (
              <span className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#dfb86c] text-[#0d0d0d] px-2.5 py-1 rounded-md text-[10px] font-mono tracking-widest uppercase font-bold">
                <Sparkles className="w-3 h-3" /> Exclusividade
              </span>
            )}
          </div>

          {/* Lado Direito: Ficha Técnica (md: 7 colunas) */}
          <div className="p-6 sm:p-8 md:p-10 md:col-span-7 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#dfb86c]">
                  {product.category}
                </span>
                <span className="h-1 w-1 rounded-full bg-[#dfb86c]/40" />
                <span className="text-[10px] font-mono text-[#666]">#ID: {product.id}</span>
              </div>
              
              <h3 className="font-serif text-2xl sm:text-3xl text-[#f4ebdc] font-light leading-tight mb-4">
                {product.name}
              </h3>
              
              <div className="h-[1px] w-20 bg-gradient-to-r from-[#dfb86c]/40 to-transparent mb-6" />

              <p className="text-[#a6a6a6] text-sm leading-relaxed mb-6 font-sans font-light">
                {product.description}
              </p>

              {/* Especificações Técnicas */}
              <div className="space-y-4 mb-8 bg-[#171717] border border-zinc-800 rounded-xl p-5">
                <h4 className="text-xs font-mono text-[#dfb86c] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Ficha de Autenticidade
                </h4>

                <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                  <div>
                    <span className="text-[#666] block mb-0.5">METAL NOBRE</span>
                    <span className="text-[#f4ebdc] flex items-center gap-1">{product.specs.metal}</span>
                  </div>
                  <div>
                    <span className="text-[#666] block mb-0.5">LAPIDAÇÃO & GEMA</span>
                    <span className="text-[#f4ebdc] flex items-center gap-1">{product.specs.gem}</span>
                  </div>
                  {product.specs.carats && (
                    <div>
                      <span className="text-[#666] block mb-0.5">QUILATES (PESO)</span>
                      <span className="text-[#f4ebdc]">{product.specs.carats}</span>
                    </div>
                  )}
                  {product.specs.clarity && (
                    <div>
                      <span className="text-[#666] block mb-0.5">GRAU DE PUREZA</span>
                      <span className="text-[#f4ebdc]">{product.specs.clarity}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="pt-4 border-t border-zinc-800">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-5">
                <div>
                  <span className="text-[10px] font-mono text-[#666] block uppercase tracking-wider">Valor Estimado do Atelier</span>
                  <span className="font-serif text-[#dfb86c] text-2xl font-light">{formatPrice(product.price)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                  <Shield className="w-4 h-4 text-[#dfb86c]/60" /> Certificação GIA Vitalícia
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  id="qv-close-footer"
                  onClick={onClose}
                  className="w-full border border-zinc-800 hover:border-zinc-700 bg-[#161616] text-[#f4ebdc] py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Continuar Navegando
                </button>
                <button
                  id="qv-commission-btn"
                  onClick={() => {
                    onSelectForBespoke(product.name);
                    onClose();
                  }}
                  className="w-full bg-gradient-to-r from-[#dfb86c] to-[#c5a059] text-[#0d0d0d] hover:opacity-95 font-bold py-3 rounded-xl text-xs font-mono uppercase tracking-wider transition-transform hover:scale-[1.01] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <PenTool className="w-3.5 h-3.5" /> Encomendar sob medida
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
