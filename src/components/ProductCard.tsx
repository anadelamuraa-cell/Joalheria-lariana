import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Eye, PenTool } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  key?: React.Key | null;
  product: Product;
  onQuickView: (product: Product) => void;
  onSelectForBespoke: (productName: string) => void;
}

export default function ProductCard({ product, onQuickView, onSelectForBespoke }: ProductCardProps): React.JSX.Element {
  // Formatar preço para Real Brasileiro
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      id={`product-card-${product.id}`}
      className="group relative bg-[#121212] border border-[#dfb86c]/10 rounded-xl overflow-hidden flex flex-col justify-between transition-all hover:border-[#dfb86c]/30 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
    >
      {/* Selo de Peça Exclusiva */}
      {product.exclusive && (
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 bg-[#dfb86c]/95 text-[#0d0d0d] px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider uppercase font-semibold">
          <Sparkles className="w-3 h-3" />
          Exclusiva
        </div>
      )}

      {/* Imagem do Produto */}
      <div className="relative aspect-square overflow-hidden bg-[#181818] flex items-center justify-center">
        <motion.img
          src={product.image}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Camada escura de hover para ações rápidas */}
        <div className="absolute inset-0 bg-[#0d0d0d]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
          <button
            id={`btn-qv-${product.id}`}
            onClick={() => onQuickView(product)}
            className="p-3 bg-[#1d1d1d] hover:bg-[#dfb86c] hover:text-[#0d0d0d] text-[#f4ebdc] rounded-full transition-all duration-200 transform scale-90 group-hover:scale-100 cursor-pointer shadow-lg"
            title="Visualização Rápida"
          >
            <Eye className="w-5 h-5" />
          </button>
          <button
            id={`btn-bespoke-${product.id}`}
            onClick={() => onSelectForBespoke(product.name)}
            className="p-3 bg-[#1d1d1d] hover:bg-[#dfb86c] hover:text-[#0d0d0d] text-[#f4ebdc] rounded-full transition-all duration-200 transform scale-90 group-hover:scale-100 cursor-pointer shadow-lg"
            title="Encomendar Inspirado Nesta Peça"
          >
            <PenTool className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Detalhes do Produto */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#a6a6a6] block mb-1">
            {product.category}
          </span>
          <h3 className="font-serif text-lg text-[#f4ebdc] group-hover:text-[#dfb86c] transition-colors font-light leading-tight mb-2">
            {product.name}
          </h3>
          <p className="text-xs text-[#8c8c8c] line-clamp-2 leading-relaxed mb-4">
            {product.description}
          </p>
        </div>

        <div>
          <div className="flex items-baseline justify-between pt-2 border-t border-[#dfb86c]/5">
            <span className="text-xs font-mono text-[#666]">Valor estimado:</span>
            <span className="font-serif text-[#dfb86c] font-medium text-lg">
              {formatPrice(product.price)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              id={`btn-details-${product.id}`}
              onClick={() => onQuickView(product)}
              className="w-full border border-[#f4ebdc]/10 hover:border-[#dfb86c]/40 text-[#f4ebdc] py-2 px-3 rounded-lg text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer text-center"
            >
              Ficha Técnica
            </button>
            <button
              id={`btn-action-${product.id}`}
              onClick={() => onSelectForBespoke(product.name)}
              className="w-full bg-gradient-to-r from-[#dfb86c]/10 to-[#c5a059]/10 hover:from-[#dfb86c] hover:to-[#c5a059] border border-[#dfb86c]/30 hover:border-[#dfb86c] text-[#dfb86c] hover:text-[#0d0d0d] py-2 px-3 rounded-lg text-xs font-mono tracking-wider uppercase transition-all font-semibold cursor-pointer text-center flex items-center justify-center gap-1.5"
            >
              <PenTool className="w-3 h-3" />
              Encomendar
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
