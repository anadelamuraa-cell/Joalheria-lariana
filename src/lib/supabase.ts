import { createClient } from '@supabase/supabase-js';
import { CustomOrder, UserSession } from '../types';

const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Instruções SQL prontas para o usuário usar no painel do Supabase SQL Editor
export const SUPABASE_SQL_SCHEMA = `-- ========================================================
-- SOLUÇÃO SUPREMA PARA TODOS OS ERROS DE RLS OU TABELAS DUPLICADAS
-- Copie e cole todo o código abaixo no SQL Editor do seu Supabase e clique em RUN
-- ========================================================

-- 1. LIMPEZA COMPLETA (Garante que começaremos do zero sem conflitos)
DROP TABLE IF EXISTS pedidos_joias CASCADE;
DROP TABLE IF EXISTS clientes CASCADE;

-- 2. CRIAÇÃO DA TABELA DE CLIENTES
CREATE TABLE clientes (
  email VARCHAR(255) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  celular VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRIAÇÃO DA TABELA DE PEDIDOS DE JOIAS
CREATE TABLE pedidos_joias (
  id VARCHAR(50) PRIMARY KEY,
  cliente_email VARCHAR(255) REFERENCES clientes(email) ON DELETE CASCADE,
  nome_referencia VARCHAR(255),
  metal VARCHAR(100) NOT NULL,
  gema VARCHAR(100) NOT NULL,
  tamanho VARCHAR(50) NOT NULL,
  gravacao VARCHAR(255),
  detalhes TEXT NOT NULL,
  preco_estimado NUMERIC(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'Pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- OPÇÃO 1 (ALTAMENTE RECOMENDADA): DESATIVAR RLS COMPLETAMENTE
-- Isso remove qualquer bloqueio de segurança para os dados se moverem livremente.
-- Perfeito para desenvolvimento rápido, testes e protótipos sem burocracia.
-- ========================================================
ALTER TABLE clientes DISABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_joias DISABLE ROW LEVEL SECURITY;

-- ========================================================
-- OPÇÃO 2: CASO VOCÊ QUEIRA MANTER O RLS ATIVO COM PERMISSÃO PÚBLICA TOTAL
-- (Descomente este bloco se você SEGUNDAMENTE precisar do RLS ativo, mas a Opção 1 acima já resolve 100% dos erros)
-- ========================================================
/*
-- Ativar RLS nas tabelas
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE pedidos_joias ENABLE ROW LEVEL SECURITY;

-- Apagar políticas anteriores para limpar duplicidades
DROP POLICY IF EXISTS "Permitir tudo pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir tudo pública de pedidos" ON pedidos_joias;
DROP POLICY IF EXISTS "Permitir leitura pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir inserção pública de clientes" ON clientes;
DROP POLICY IF EXISTS "Permitir leitura pública de pedidos" ON pedidos_joias;
DROP POLICY IF EXISTS "Permitir inserção pública de pedidos" ON pedidos_joias;

-- Criar diretivas "FOR ALL" (Garante SELECT, INSERT, UPDATE e DELETE sem barreiras)
CREATE POLICY "Permitir tudo pública de clientes" ON clientes FOR ALL TO public USING (true) WITH CHECK (true);
CREATE POLICY "Permitir tudo pública de pedidos" ON pedidos_joias FOR ALL TO public USING (true) WITH CHECK (true);
*/
`;

/**
 * Cadastra ou atualiza o cliente no Supabase após login
 */
export async function syncClientToSupabase(name: string, email: string, phone: string): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('clientes')
      .upsert(
        { email, nome: name, celular: phone },
        { onConflict: 'email' }
      );
    if (error) {
      console.error('Erro ao sincronizar cliente no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha de conexão com o Supabase clientes:', err);
    return false;
  }
}

/**
 * Envia um novo pedido personalizado ao Supabase
 */
export async function sendOrderToSupabase(order: CustomOrder): Promise<boolean> {
  if (!supabase) return false;
  try {
    const { error } = await supabase
      .from('pedidos_joias')
      .insert({
        id: order.id,
        cliente_email: order.clientEmail,
        nome_referencia: order.productNameReference || null,
        metal: order.metal,
        gema: order.gemstone,
        tamanho: order.size,
        gravacao: order.engraving || null,
        detalhes: order.details,
        preco_estimado: order.estimatedPrice,
        status: order.status,
        created_at: order.createdAt
      });
    if (error) {
      console.error('Erro ao registrar pedido no Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Falha de conexão com o Supabase pedidos_joias:', err);
    return false;
  }
}

/**
 * Busca todos os pedidos do cliente logado no Supabase
 */
export async function getClientOrdersFromSupabase(email: string): Promise<CustomOrder[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('pedidos_joias')
      .select('*')
      .eq('cliente_email', email)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar pedidos do Supabase:', error.message);
      return null;
    }

    if (data) {
      return data.map((item: any) => ({
        id: item.id,
        clientEmail: item.cliente_email,
        clientPhone: '', // Deixamos em branco ou recuperamos do login local
        productNameReference: item.nome_referencia || undefined,
        metal: item.metal,
        gemstone: item.gema,
        size: item.tamanho,
        engraving: item.gravacao || undefined,
        details: item.detalhes,
        createdAt: item.created_at,
        estimatedPrice: Number(item.preco_estimado),
        status: item.status
      }));
    }
    return [];
  } catch (err) {
    console.error('Falha de rede ao se conectar ao Supabase:', err);
    return null;
  }
}
