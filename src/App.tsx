/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Search,
  LogOut,
  ShieldCheck,
  Truck,
  Heart,
  Calendar,
  Grid,
  Filter,
  Package,
  BookOpen,
  MessageSquare,
  Lock,
  Compass,
  Database,
  Copy,
  Check,
  X,
  AlertTriangle
} from 'lucide-react';

import { Product, UserSession, CustomOrder, ResourceCategory } from './types';
import { productsData } from './data';
import LoginModal from './components/LoginModal';
import HeroSlider from './components/HeroSlider';
import ProductCard from './components/ProductCard';
import BespokeOrderForm from './components/BespokeOrderForm';
import QuickViewModal from './components/QuickViewModal';

import {
  syncClientToSupabase,
  sendOrderToSupabase,
  getClientOrdersFromSupabase,
  isSupabaseConfigured,
  SUPABASE_SQL_SCHEMA
} from './lib/supabase';

export default function App() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(productsData);
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [bespokeProductRef, setBespokeProductRef] = useState<string>('');
  const [submittedOrders, setSubmittedOrders] = useState<CustomOrder[]>([]);

  // Supabase states
  const [syncStatus, setSyncStatus] = useState<'connected' | 'simulated' | 'syncing'>('simulated');
  const [showSqlPanel, setShowSqlPanel] = useState<boolean>(false);
  const [copiedSql, setCopiedSql] = useState<boolean>(false);

  // Inicializar estado de configuração
  useEffect(() => {
    if (isSupabaseConfigured) {
      setSyncStatus('connected');
    } else {
      setSyncStatus('simulated');
    }
  }, []);

  // Carregar dados de sessão e pedidos anteriores do localStorage no início
  useEffect(() => {
    const savedSession = localStorage.getItem('etoile_atelier_session');
    if (savedSession) {
      try {
        setSession(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem('etoile_atelier_session');
      }
    }

    const savedOrders = localStorage.getItem('etoile_orders');
    if (savedOrders) {
      try {
        setSubmittedOrders(JSON.parse(savedOrders));
      } catch (e) {
        localStorage.removeItem('etoile_orders');
      }
    }
  }, []);

  // Sincronizar dados com o Supabase quando as credenciais estiverem disponíveis e o usuário logar
  useEffect(() => {
    if (!session) return;

    const syncSupabaseData = async () => {
      if (isSupabaseConfigured) {
        setSyncStatus('syncing');
        try {
          // 1. Sincroniza o cliente de forma transparente
          const clientSynced = await syncClientToSupabase(
            session.name || 'Cliente Convidado',
            session.email,
            session.phone
          );
          
          if (clientSynced) {
            // 2. Busca pedidos previamente cadastrados no Supabase
            const dbOrders = await getClientOrdersFromSupabase(session.email);
            if (dbOrders !== null) {
              setSubmittedOrders(prev => {
                const localOnly = prev.filter(lo => !dbOrders.some(db => db.id === lo.id));
                const merged = [...dbOrders, ...localOnly];
                localStorage.setItem('etoile_orders', JSON.stringify(merged));
                return merged;
              });
            }
          }
          setSyncStatus('connected');
        } catch (e) {
          console.error(e);
          setSyncStatus('connected');
        }
      }
    };

    syncSupabaseData();
  }, [session]);

  // Sincronizar produtos com filtros
  useEffect(() => {
    let result = productsData;

    // Filtro por Categoria
    if (selectedCategory !== 'Todos') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Filtro por Pesquisa
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.specs.metal.toLowerCase().includes(query) ||
        p.specs.gem.toLowerCase().includes(query)
      );
    }

    setFilteredProducts(result);
  }, [selectedCategory, searchQuery]);

  const handleLogin = (userSession: UserSession) => {
    setSession(userSession);
    localStorage.setItem('etoile_atelier_session', JSON.stringify(userSession));
  };

  const handleLogout = () => {
    localStorage.removeItem('etoile_atelier_session');
    setSession(null);
    setBespokeProductRef('');
  };

  const handleOrderSubmitted = async (newOrder: CustomOrder) => {
    // Salva localmente primeiro para resposta instantânea na UI
    const updated = [newOrder, ...submittedOrders];
    setSubmittedOrders(updated);
    localStorage.setItem('etoile_orders', JSON.stringify(updated));

    // Salva no Supabase se estiver devidamente configurado
    if (isSupabaseConfigured) {
      setSyncStatus('syncing');
      try {
        const success = await sendOrderToSupabase(newOrder);
        if (success) {
          // Mantém sincronia limpa com o estado rematado
          const dbOrders = await getClientOrdersFromSupabase(session!.email);
          if (dbOrders) {
            setSubmittedOrders(prev => {
              const localOnly = prev.filter(p => !dbOrders.some(o => o.id === p.id));
              return [...dbOrders, ...localOnly];
            });
          }
        }
        setSyncStatus('connected');
      } catch (err) {
        console.error('Falha ao enviar ao Supabase:', err);
        setSyncStatus('connected');
      }
    }
  };

  const handleSelectForBespoke = (productName: string) => {
    setBespokeProductRef(productName);
    
    // Scroll com suavidade até a seção do formulário sob medida
    setTimeout(() => {
      const orderSection = document.getElementById('custom-bespoke-builder');
      if (orderSection) {
        orderSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  // Formatador de Preço
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f4ebdc] font-sans selection:bg-[#dfb86c] selection:text-[#0d0d0d] overflow-x-hidden">
      
      {/* 1. Gateway de Login Wall */}
      <AnimatePresence>
        {!session && <LoginModal onLogin={handleLogin} />}
      </AnimatePresence>

      {session && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Header da Marca */}
          <header className="sticky top-0 z-40 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#dfb86c]/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
              
              {/* Nome da Marca / Logo */}
              <div className="flex flex-col">
                <span className="font-serif text-xl sm:text-2xl font-light tracking-widest text-[#f4ebdc]">
                  L'ÉTOILE
                </span>
                <span className="text-[9px] font-mono tracking-[0.3em] text-[#dfb86c] uppercase">
                  Atelier de Joalheria
                </span>
              </div>

              {/* Informações da Sessão e Ações */}
              <div className="flex items-center gap-4 sm:gap-6">
                {/* Status do Supabase */}
                <button
                  id="btn-supabase-status"
                  onClick={() => setShowSqlPanel(true)}
                  className="flex items-center gap-2 bg-[#121212] hover:bg-[#1a1a1a] border border-[#dfb86c]/25 rounded-full px-3 py-1.5 cursor-pointer transition-colors animate-pulse"
                  title="Clique para ver configuração do Supabase e Scripts SQL"
                >
                  <div className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]' : syncStatus === 'syncing' ? 'bg-amber-400 animate-pulse' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`} />
                  <span className="text-[10px] font-mono tracking-wider font-semibold text-zinc-300">
                    {syncStatus === 'connected' ? 'Supabase Ativo' : syncStatus === 'syncing' ? 'Sincronizando' : 'Supabase Local'}
                  </span>
                </button>

                <div className="hidden md:flex flex-col items-end text-right">
                  <span className="text-[10px] font-mono text-[#666] uppercase tracking-wider">
                    Convidado Exclusivo
                  </span>
                  <span className="text-xs text-[#dfb86c] font-mono max-w-[180px] truncate" title={session.email}>
                    {session.email}
                  </span>
                </div>

                <div className="h-6 w-[1px] bg-[#dfb86c]/20 hidden md:block" />

                <button
                  id="btn-logout"
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#dfb86c]/10 hover:border-[#dfb86c]/40 text-[#a6a6a6] hover:text-[#dfb86c] text-xs font-mono tracking-wider uppercase transition-all cursor-pointer"
                  title="Sair da vitrine segura"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Desconectar</span>
                </button>
              </div>

            </div>
          </header>

          {/* Slider Principal das Joias Exclusivas */}
          <HeroSlider onBespokeClick={() => handleSelectForBespoke('')} />

          {/* Selos de Credibilidade / Ribbon de Luxo */}
          <div className="bg-[#0f0f0f] border-b border-[#dfb86c]/10 py-6">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-xs font-mono text-zinc-400">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-5 h-5 text-[#dfb86c] mb-1" />
                <span className="text-[#f4ebdc] font-medium text-[11px] uppercase tracking-wide">GIA Certificado</span>
                <span className="text-[10px] text-zinc-500">Garantia vitalícia de autenticidade</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Compass className="w-5 h-5 text-[#dfb86c] mb-1" />
                <span className="text-[#f4ebdc] font-medium text-[11px] uppercase tracking-wide">Metais Sustentáveis</span>
                <span className="text-[10px] text-zinc-500">Ouro 100% regulamentado e refinado</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-5 h-5 text-[#dfb86c] mb-1" />
                <span className="text-[#f4ebdc] font-medium text-[11px] uppercase tracking-wide">Entrega Blindada</span>
                <span className="text-[10px] text-zinc-500">Transportadora de valores privada</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Lock className="w-5 h-5 text-[#dfb86c] mb-1" />
                <span className="text-[#f4ebdc] font-medium text-[11px] uppercase tracking-wide">Atendimento Privado</span>
                <span className="text-[10px] text-zinc-500">Canal direto com o designer chefe</span>
              </div>
            </div>
          </div>

          {/* Seção Showcase da Vitrine */}
          <section id="exclusivo-showcase" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            
            {/* Header da Vitrine */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 border-b border-[#dfb86c]/5 pb-8">
              <div>
                <span className="text-xs font-mono text-[#dfb86c] uppercase tracking-[0.25em] block mb-2 font-semibold">
                  Acesso Restrito
                </span>
                <h2 className="font-serif text-3xl sm:text-4xl text-[#f4ebdc] font-light tracking-wide">
                  Nossa Vitrine Exclusiva
                </h2>
                <p className="text-sm text-[#8c8c8c] mt-1 font-light max-w-lg">
                  Acabamentos impecáveis de grau de joalheria real de alta linhagem. Filtre por seção ou busque materiais preciosos.
                </p>
              </div>

              {/* Barra de Pesquisa */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  id="search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar diamante, platina, colar..."
                  className="w-full bg-[#121212] border border-[#dfb86c]/10 focus:border-[#dfb86c] rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#f4ebdc] transition-all focus:outline-none placeholder:text-[#555] font-mono"
                />
              </div>
            </div>

            {/* Abas e Filtros Laterais */}
            <div className="flex flex-wrap items-center gap-2 mb-10">
              <span className="text-xs font-mono uppercase text-[#666] mr-2">Filtrar Categoria:</span>
              {(['Todos', 'Anéis', 'Colares', 'Brincos', 'Pulseiras'] as const).map((cat) => (
                <button
                  key={cat}
                  id={`filter-btn-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-mono tracking-wider transition-all duration-300 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#dfb86c] text-[#0d0d0d] font-bold shadow-[0_3px_12px_rgba(223,184,108,0.25)]'
                      : 'border border-[#dfb86c]/10 bg-transparent text-[#a6a6a6] hover:border-[#dfb86c]/30 hover:text-[#f4ebdc]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grid de Produtos */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={setSelectedProduct}
                    onSelectForBespoke={handleSelectForBespoke}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 border border-dashed border-[#dfb86c]/10 rounded-2xl bg-[#0f0f0f]">
                <Package className="w-10 h-10 text-zinc-600 mx-auto mb-4" />
                <h3 className="font-serif text-[#f4ebdc] text-xl font-light mb-1">
                  Nenhuma criação correspondente encontrada
                </h3>
                <p className="text-xs text-zinc-500 font-mono">
                  Remova termos de busca ou mude a categoria de joia para reiniciar.
                </p>
              </div>
            )}

          </section>

          {/* Formulário de Encomenda Customizada Estilizado */}
          <BespokeOrderForm
            session={session}
            initialProductRef={bespokeProductRef}
            clearInitialRef={() => setBespokeProductRef('')}
            onOrderSubmitted={handleOrderSubmitted}
          />

          {/* Seção Histórica de Encomendas Realizadas pelo Cliente */}
          {submittedOrders.length > 0 && (
            <section id="portfolio-orders" className="py-16 px-4 bg-[#0d0d0d] border-t border-[#dfb86c]/10">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-center gap-2 mb-8">
                  <BookOpen className="w-5 h-5 text-[#dfb86c]" />
                  <h3 className="font-serif text-2xl text-[#f4ebdc] font-light">
                    Seu Histórico de Encomendas Exclusivas
                  </h3>
                </div>

                <div className="space-y-6">
                  {submittedOrders.map((ord) => (
                    <div
                      key={ord.id}
                      id={`order-card-${ord.id}`}
                      className="bg-[#141414] border border-[#dfb86c]/20 rounded-xl p-6 font-mono text-xs flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-lg"
                    >
                      {/* Borda lateral decorativa em ouro */}
                      <div className="absolute left-0 inset-y-0 w-[3px] bg-[#dfb86c]" />
                      
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-bold text-[#dfb86c]">{ord.id}</span>
                          <span className="h-1.5 w-1.5 rounded-full bg-[#dfb86c]/50" />
                          <span className="text-[10px] text-zinc-500 text-zinc-400">
                            {new Date(ord.createdAt).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                        
                        <div className="text-sm font-serif text-[#f4ebdc] font-light">
                          Joia Customizada de <span className="text-[#dfb86c]">{ord.gemstone}</span> em <span className="text-white">{ord.metal}</span>
                        </div>

                        {ord.productNameReference && (
                          <div className="text-[11px] text-[#8c8c8c]">
                            Inspirada no modelo: <strong className="text-zinc-300">{ord.productNameReference}</strong>
                          </div>
                        )}

                        <p className="text-[11px] text-zinc-500 max-w-xl italic mt-2 line-clamp-1">
                          " {ord.details} "
                        </p>
                      </div>

                      <div className="text-left md:text-right flex flex-col md:items-end justify-between self-stretch pt-4 md:pt-0 border-t md:border-t-0 border-zinc-800">
                        <span className="text-[10px] uppercase text-zinc-500">Orçamento sob análise</span>
                        <span className="text-[#dfb86c] text-lg font-serif mt-1 font-medium block">
                          {formatPrice(ord.estimatedPrice)}
                        </span>
                        
                        <span className="inline-block mt-2 px-2.5 py-1 text-[10px] bg-[#dfb86c]/10 text-[#dfb86c] rounded border border-[#dfb86c]/20">
                          {ord.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Footer da Boutique */}
          <footer className="bg-[#070707] py-16 px-4 border-t border-[#dfb86c]/10 font-mono text-xs text-[#666]">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              
              <div className="flex flex-col">
                <span className="text-[#f4ebdc] font-serif text-lg font-light tracking-widest leading-normal">
                  L'Étoile Atelier
                </span>
                <span className="text-[10px] text-[#dfb86c] tracking-[0.2em] uppercase mt-1">
                  Alta Joalheria S.A.
                </span>
                <span className="max-w-xs text-[10px] text-zinc-600 mt-2 leading-relaxed">
                  Tradição, lapidação impecável e autenticidade artesanal desde 1926.
                </span>
              </div>

              <div className="flex flex-col md:items-end gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 justify-center md:justify-end text-[#a6a6a6]">
                  <Lock className="w-3.5 h-3.5 text-[#dfb86c]" /> 
                  Sessão Segura Protegida contra Fraudes
                </div>
                <span>Endereço Administrativo: Av. das Nações Unidas, 1420 - São Paulo, SP</span>
                <span>Termos de Uso Particular de Clientes Reservados. Todos os direitos reservados.</span>
              </div>

            </div>
          </footer>

          {/* Modal de Detalhes Técnicos / Quick View */}
          <QuickViewModal
            product={selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onSelectForBespoke={handleSelectForBespoke}
          />

          {/* Modal de Configuração do Supabase & SQL Schema */}
          <AnimatePresence>
            {showSqlPanel && (
              <div id="supabase-config-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
                <div className="absolute inset-0 cursor-default" onClick={() => setShowSqlPanel(false)} />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative w-full max-w-3xl bg-[#121212] border border-[#dfb86c]/30 rounded-2xl p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] z-10 font-sans"
                >
                  {/* Botão fechar */}
                  <button
                    onClick={() => setShowSqlPanel(false)}
                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-[#dfb86c] transition-colors bg-zinc-900 rounded-full cursor-pointer animate-none"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <Database className="w-6 h-6 text-[#dfb86c]" />
                    <h3 className="font-serif text-2xl text-[#f4ebdc] font-light">
                      Sincronização com o Supabase
                    </h3>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                    Seus pedidos e registros de clientes são atualmente salvos no <strong>localStorage</strong> como simulação. Para que eles apareçam instantaneamente no seu painel do Supabase, siga as etapas simples de conexão abaixo para evitar erros de tabelas duplicadas.
                  </p>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                    {/* Passo 1 */}
                    <div className="bg-[#181818] rounded-xl p-4 border border-zinc-800">
                      <h4 className="text-xs font-mono uppercase text-[#dfb86c] tracking-wider mb-2 flex items-center gap-1.5">
                        <span className="bg-[#dfb86c]/15 text-[#dfb86c] px-1.5 py-0.5 rounded text-[10px]">Passo 1</span>
                        Variáveis de Ambiente no Painel do AI Studio
                      </h4>
                      <p className="text-[11px] text-zinc-400 leading-normal mb-3">
                        Adicione as seguintes chaves à configuração de segredos do seu applet no menu de segredos (Secrets panel) usando as credenciais do seu projeto Supabase:
                      </p>
                      <div className="bg-[#0b0b0b] rounded px-3 py-2 text-xs font-mono text-zinc-300 border border-zinc-900 select-all space-y-1">
                        <div>VITE_SUPABASE_URL = "SUA_URL_DO_SUPABASE"</div>
                        <div>VITE_SUPABASE_ANON_KEY = "SUA_CHAVE_ANON_DO_SUPABASE"</div>
                      </div>
                    </div>

                    {/* Passo 2 */}
                    <div className="bg-[#181818] rounded-xl p-4 border border-zinc-800">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3">
                        <h4 className="text-xs font-mono uppercase text-[#dfb86c] tracking-wider flex items-center gap-1.5">
                          <span className="bg-[#dfb86c]/15 text-[#dfb86c] px-1.5 py-0.5 rounded text-[10px]">Passo 2</span>
                          Código SQL Seguro (Corrige erro 42P07)
                        </h4>
                        
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
                            setCopiedSql(true);
                            setTimeout(() => setCopiedSql(false), 2000);
                          }}
                          className="text-[11px] font-mono text-[#dfb86c] hover:underline flex items-center gap-1 cursor-pointer bg-[#dfb86c]/10 px-2 py-1 rounded"
                        >
                          {copiedSql ? (
                            <>
                              <Check className="w-3.5 h-3.5" /> Copiado!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" /> Copiar SQL
                            </>
                          )}
                        </button>
                      </div>
                      
                      <div className="flex items-start gap-2 bg-yellow-950/20 border border-yellow-500/10 p-2.5 rounded-lg text-[10px] text-amber-200 mb-3 leading-relaxed">
                        <AlertTriangle className="w-4.5 h-4.5 shrink-0 text-amber-400 mt-0.5" />
                        <div>
                          <strong>Por que deu o erro 42P07 ("relation 'clientes' already exists")?</strong> Você tentou recriar uma tabela que já existia no seu Supabase. O script abaixo usa <strong>CREATE TABLE IF NOT EXISTS</strong> e atualiza políticas de segurança duplicadas de forma limpa. Rode este novo código no seu <strong>SQL Editor</strong> do Supabase para corrigir!
                        </div>
                      </div>

                      <pre className="bg-[#0b0b0b] rounded px-3 py-3 text-[10px] font-mono text-[#a6a6a6] border border-zinc-900 max-h-48 overflow-y-auto overflow-x-auto leading-relaxed select-all">
                        {SUPABASE_SQL_SCHEMA}
                      </pre>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-zinc-800 flex justify-between items-center text-xs font-mono text-zinc-500">
                    <span>Status Atual: <strong className={isSupabaseConfigured ? "text-emerald-400" : "text-amber-500"}>{isSupabaseConfigured ? "CONECTADO AO SUPABASE" : "SIMULADO LOCAL"}</strong></span>
                    <button
                      onClick={() => setShowSqlPanel(false)}
                      className="bg-[#dfb86c] hover:bg-[#dfb86c]/90 text-[#0d0d0d] font-bold px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Fechar e Voltar
                    </button>
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

        </motion.div>
      )}

    </div>
  );
}
