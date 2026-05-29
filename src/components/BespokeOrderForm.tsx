import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PenTool, Check, Ruler, HelpCircle, Palette, Sparkles, Send, Gift } from 'lucide-react';
import { CustomOrder, MetalType, GemstoneType, UserSession } from '../types';

interface BespokeOrderFormProps {
  session: UserSession;
  initialProductRef?: string;
  clearInitialRef: () => void;
  onOrderSubmitted: (order: CustomOrder) => void;
}

export default function BespokeOrderForm({ session, initialProductRef, clearInitialRef, onOrderSubmitted }: BespokeOrderFormProps) {
  const [metal, setMetal] = useState<MetalType>('Ouro Amarelo 18k');
  const [gemstone, setGemstone] = useState<GemstoneType>('Diamante');
  const [size, setSize] = useState('14'); // Padrão tamanho anel comum
  const [engraving, setEngraving] = useState('');
  const [details, setDetails] = useState('');
  const [productRef, setProductRef] = useState(initialProductRef || '');
  const [successOrder, setSuccessOrder] = useState<CustomOrder | null>(null);
  const [priceEstimate, setPriceEstimate] = useState(15000);

  useEffect(() => {
    if (initialProductRef) {
      setProductRef(initialProductRef);
    }
  }, [initialProductRef]);

  // Função para calcular estimativa inicial de preço com base nas escolhas de material de luxo
  useEffect(() => {
    let basePrice = 8000; // Valor inicial da mão de obra artesanal do mestre joalheiro
    
    // Incremento por Metal
    if (metal === 'Platina 950') basePrice += 7500;
    else if (metal === 'Ouro Branco 18k') basePrice += 4200;
    else if (metal === 'Ouro Rosé 18k') basePrice += 4000;
    else basePrice += 3800; // Ouro amarelo

    // Incremento por Gema
    if (gemstone === 'Diamante') basePrice += 9500;
    else if (gemstone === 'Esmeralda') basePrice += 12000; // Esmeraldas raras colombianas
    else if (gemstone === 'Safira') basePrice += 8000;
    else if (gemstone === 'Rubi') basePrice += 8500;
    
    // Acréscimo se houver referência de peça prévia (combina complexidade)
    if (productRef) {
      basePrice += 3000;
    }

    setPriceEstimate(basePrice);
  }, [metal, gemstone, productRef]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) {
      alert('Por favor, descreva os detalhes ou inspiração da sua joia sob medida.');
      return;
    }

    const orderId = `L-ETOILE-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder: CustomOrder = {
      id: orderId,
      clientEmail: session.email,
      clientPhone: session.phone,
      productNameReference: productRef ? productRef : undefined,
      metal,
      gemstone,
      size,
      engraving: engraving.trim() ? engraving : undefined,
      details,
      createdAt: new Date().toISOString(),
      estimatedPrice: priceEstimate,
      status: 'Pendente'
    };

    onOrderSubmitted(newOrder);
    setSuccessOrder(newOrder);
    
    // Scroll suave para o cartão de sucesso
    setTimeout(() => {
      const successEl = document.getElementById('bespoke-success-card');
      if (successEl) {
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const handleResetForm = () => {
    setMetal('Ouro Amarelo 18k');
    setGemstone('Diamante');
    setSize('14');
    setEngraving('');
    setDetails('');
    setProductRef('');
    setSuccessOrder(null);
    clearInitialRef();
  };

  // Formatador de Preço
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <section id="custom-bespoke-builder" className="py-16 px-6 max-w-5xl mx-auto border-t border-[#dfb86c]/10">
      
      <div className="text-center mb-12">
        <span className="text-xs font-mono text-[#dfb86c] tracking-[0.2em] uppercase font-semibold flex items-center justify-center gap-1.5 mb-2">
          <PenTool className="w-3.5 h-3.5" /> Atelier de Encomendas
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl text-[#f4ebdc] tracking-wide font-light mb-4">
          Comissionamento de Joias Customizadas
        </h2>
        <p className="text-sm text-[#a6a6a6] max-w-xl mx-auto leading-relaxed">
          Nossos mestres artesãos transformam sua visão de luxo em realidade tangível. Especifique seu desejo abaixo, simule o orçamento e envie a proposta de criação privada ao nosso atelier.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!successOrder ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-1 lg:grid-cols-5 gap-8 bg-[#121212] border border-[#dfb86c]/20 rounded-2xl p-6 sm:p-8 md:p-10 shadow-[0_10px_40px_rgba(0,0,0,0.5)]"
          >
            {/* Lado Esquerdo: Formulário (3/5 colunas) */}
            <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
              
              {/* Referência de Modelo */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-mono uppercase tracking-wider text-[#a6a6a6]">
                    Modelo de Referência do Atelier
                  </label>
                  {productRef && (
                    <button
                      type="button"
                      onClick={() => { setProductRef(''); clearInitialRef(); }}
                      className="text-[10px] uppercase font-mono text-[#dfb86c] hover:underline cursor-pointer"
                    >
                      Remover Referência
                    </button>
                  )}
                </div>
                <input
                  type="text"
                  value={productRef}
                  onChange={(e) => setProductRef(e.target.value)}
                  placeholder="Design Livre (Sem referência prévia)"
                  className="w-full bg-[#1b1b1b] border border-[#dfb86c]/10 focus:border-[#dfb86c] focus:outline-none rounded-lg px-4 py-3 text-[#f4ebdc] text-sm transition-all placeholder:text-[#555] font-sans"
                />
              </div>

              {/* Escolha do Metal Nobre */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#a6a6a6] block">
                  Escolha do Metal Nobre
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {(['Ouro Amarelo 18k', 'Ouro Branco 18k', 'Ouro Rosé 18k', 'Platina 950'] as MetalType[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMetal(m)}
                      className={`py-3 px-2 text-center rounded-lg border text-xs font-mono transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        metal === m
                          ? 'border-[#dfb86c] bg-[#dfb86c]/5 text-[#dfb86c] shadow-[0_2px_10px_rgba(223,184,108,0.15)]'
                          : 'border-[#1b1b1b] bg-[#171717] hover:border-zinc-800 text-[#a6a6a6]'
                      }`}
                    >
                      <Palette className="w-3.5 h-3.5 opacity-60" />
                      <span className="text-[10px] leading-tight">{m}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Escolha da Gema Central */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase tracking-wider text-[#a6a6a6] block">
                  Corte & Gema Principal
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {(['Diamante', 'Esmeralda', 'Safira', 'Rubi', 'Sem Gema'] as GemstoneType[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGemstone(g)}
                      className={`py-3 px-1 text-center rounded-lg border text-[11px] font-mono transition-all duration-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer ${
                        gemstone === g
                          ? 'border-[#dfb86c] bg-[#dfb86c]/5 text-[#dfb86c] shadow-[0_2px_10px_rgba(223,184,108,0.15)]'
                          : 'border-[#1b1b1b] bg-[#171717] hover:border-zinc-800 text-[#a6a6a6]'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 opacity-60" />
                      <span>{g}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dimensão e Gravura */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#a6a6a6]">
                    <Ruler className="w-3.5 h-3.5 text-[#dfb86c]" />
                    <span>Medida / Tamanho</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="Ex: Aro 14 (Anel), 45cm (Colar)"
                    className="w-full bg-[#1b1b1b] border border-[#dfb86c]/10 focus:border-[#dfb86c] focus:outline-none rounded-lg px-4 py-3 text-[#f4ebdc] text-sm transition-all placeholder:text-[#555]"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#a6a6a6]">
                    <Gift className="w-3.5 h-3.5 text-[#dfb86c]" />
                    <span>Gravação Interna (Cortesia)</span>
                  </div>
                  <input
                    type="text"
                    value={engraving}
                    onChange={(e) => setEngraving(e.target.value)}
                    placeholder="Ex: F & G 12.06.2026"
                    maxLength={32}
                    className="w-full bg-[#1b1b1b] border border-[#dfb86c]/10 focus:border-[#dfb86c] focus:outline-none rounded-lg px-4 py-3 text-[#f4ebdc] text-sm transition-all placeholder:text-[#555]"
                  />
                </div>
              </div>

              {/* Detalhes da Encomenda */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase tracking-wider text-[#a6a6a6] block">
                  Descrição dos Detalhes / Inspiração da Joia
                </label>
                <textarea
                  required
                  rows={4}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="Por favor, detalhe sua ideia. Descreva se deseja um acabamento polido ou escovado, detalhes extras sobre o design da garra, o estilo de lapidação específico da gema ou qualquer herança conceitual que queira incorporar à joia..."
                  className="w-full bg-[#1b1b1b] border border-[#dfb86c]/10 focus:border-[#dfb86c] focus:outline-none rounded-lg px-4 py-3 text-[#f4ebdc] text-sm transition-all placeholder:text-[#555] font-sans resize-none leading-relaxed"
                />
              </div>

              {/* Enviar */}
              <button
                id="btn-submit-order"
                type="submit"
                className="w-full bg-gradient-to-r from-[#dfb86c] to-[#c5a059] text-[#0d0d0d] font-bold text-xs font-mono uppercase tracking-wider py-4 rounded-lg hover:shadow-[0_4px_20px_rgba(223,184,108,0.25)] transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                Registrar Solicitação de Encomenda
              </button>
            </form>

            {/* Lado Direito: Simulador de Precificação de Luxo (2/5 colunas) */}
            <div className="lg:col-span-2 bg-[#171717] border border-[#dfb86c]/10 rounded-xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-[#f4ebdc] text-lg mb-4 font-light flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#dfb86c]" /> Orçamento Estimado
                </h3>
                
                <p className="text-xs text-[#8c8c8c] leading-relaxed mb-6">
                  Este simulador avalia em tempo real as cotações internacionais de metais nobres e pedras preciosas para gerar uma estimativa realista aplicável ao atelier.
                </p>

                <div className="space-y-4 text-xs font-mono">
                  <div className="flex justify-between pb-2.5 border-b border-[#dfb86c]/5 text-[#a6a6a6]">
                    <span>Consultor:</span>
                    <span className="text-white">Mestre Artesão</span>
                  </div>
                  <div className="flex justify-between pb-2.5 border-b border-[#dfb86c]/5 text-[#a6a6a6]">
                    <span>Metal Base:</span>
                    <span className="text-white">{metal}</span>
                  </div>
                  <div className="flex justify-between pb-2.5 border-b border-[#dfb86c]/5 text-[#a6a6a6]">
                    <span>Gema Esculpida:</span>
                    <span className="text-white">{gemstone}</span>
                  </div>
                  <div className="flex justify-between pb-2.5 border-b border-[#dfb86c]/5 text-[#a6a6a6]">
                    <span>Medida Especificada:</span>
                    <span className="text-white">{size || '-'}</span>
                  </div>
                  {productRef && (
                    <div className="flex justify-between pb-2.5 border-b border-[#dfb86c]/5 text-[#a6a6a6]">
                      <span>Inspirado em:</span>
                      <span className="text-[#dfb86c] truncate max-w-[120px]">{productRef}</span>
                    </div>
                  )}
                  {engraving && (
                    <div className="flex justify-between pb-2.5 border-b border-[#dfb86c]/5 text-[#a6a6a6]">
                      <span>Gravação:</span>
                      <span className="text-white italic">"{engraving}"</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[#dfb86c]/15">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#a6a6a6] block mb-1">
                  Cotação Estimada Atelier
                </span>
                <span className="font-serif text-3xl text-[#dfb86c] font-light block leading-none mb-2">
                  {formatPrice(priceEstimate)}
                </span>
                <p className="text-[10px] text-[#666] leading-snug">
                  *O valor exato de faturamento com relatórios de pureza gemológica GIA será enviado formalmente ao seu e-mail após análise estrutural das gemas.
                </p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Cartão de Sucesso Expositivo de Luxo */
          <motion.div
            id="bespoke-success-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#141414] border border-[#dfb86c] rounded-2xl p-8 sm:p-10 max-w-2xl mx-auto text-center shadow-[0_15px_45px_rgba(223,184,108,0.15)] relative overflow-hidden"
          >
            {/* Linha ornamental dourada no topo */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-[#dfb86c] to-transparent" />
            
            <div className="w-16 h-16 rounded-full border border-[#dfb86c] flex items-center justify-center mx-auto mb-6 bg-[#dfb86c]/10 text-[#dfb86c]">
              <Check className="w-8 h-8" />
            </div>

            <span className="text-xs font-mono uppercase tracking-widest text-[#dfb86c] block mb-2">
              Pedido Registrado com Sucesso
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#f4ebdc] font-light mb-4">
              A Criação de Alta Joalheria Começou
            </h3>
            
            <p className="text-sm text-[#a6a6a6] leading-relaxed max-w-lg mx-auto mb-8 font-sans">
              Obrigado, <strong className="text-white">{session.email}</strong>. Recebemos suas especificações exclusivas sob o protocolo de alta segurança <strong className="text-[#dfb86c] font-mono">{successOrder.id}</strong>. Nosso mestre joalheiro chefe já iniciou a análise estrutural da sua peça. Uma estimativa final detalhada com rascunhos em 3D será enviada em breve ao número <strong className="text-white">{successOrder.clientPhone}</strong>.
            </p>

            {/* Recibo Técnico de Orçamento para o Usuário Impresso de Maneira Chic */}
            <div className="bg-[#1c1c1c] border border-zinc-800 rounded-xl p-6 text-left max-w-md mx-auto mb-8 font-mono text-xs space-y-3">
              <h4 className="text-center text-xs uppercase tracking-wider text-[#dfb86c] border-b border-zinc-800 pb-2 mb-3">
                DETALHES DA RESERVA BESPOKE
              </h4>
              <div className="flex justify-between text-zinc-400">
                <span>CÓDIGO:</span>
                <span className="text-white font-bold">{successOrder.id}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>METAL BASE:</span>
                <span className="text-white">{successOrder.metal}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>GEMA PRINCIPAL:</span>
                <span className="text-white">{successOrder.gemstone}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>TAMANHO:</span>
                <span className="text-white">{successOrder.size}</span>
              </div>
              {successOrder.engraving && (
                <div className="flex justify-between text-zinc-400">
                  <span>GRAVURA:</span>
                  <span className="text-white">"{successOrder.engraving}"</span>
                </div>
              )}
              <div className="border-t border-zinc-800 pt-3 flex justify-between text-sm">
                <span className="text-[#dfb86c]">ORÇAMENTO ESTIMADO:</span>
                <span className="text-[#dfb86c] font-semibold">{formatPrice(successOrder.estimatedPrice)}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                id="btn-new-custom-order"
                onClick={handleResetForm}
                className="bg-[#1b1b1b] border border-[#dfb86c]/30 text-[#dfb86c] hover:bg-[#dfb86c]/10 px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-wider font-semibold cursor-pointer transition-colors"
              >
                Solicitar Nova Criação
              </button>
              <button
                id="btn-back-vitrine"
                onClick={() => {
                  const vitrineSection = document.getElementById('exclusivo-showcase');
                  if (vitrineSection) {
                    vitrineSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-gradient-to-r from-[#dfb86c] to-[#c5a059] text-[#0d0d0d] px-6 py-3 rounded-lg text-xs font-mono uppercase tracking-wider font-bold cursor-pointer transition-transform hover:scale-[1.02]"
              >
                Retornar para a Vitrine
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
