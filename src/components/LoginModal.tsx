import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, ArrowRight, Lock, Sparkles } from 'lucide-react';
import { UserSession } from '../types';

interface LoginModalProps {
  onLogin: (session: UserSession) => void;
}

export default function LoginModal({ onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Formatar número de telefone celular brasileiro (XX) XXXXX-XXXX
  const formatPhoneNumber = (value: string) => {
    if (!value) return value;
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    if (phoneNumberLength < 3) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }
    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2, 7)}-${phoneNumber.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    // Limita o tamanho ao padrão brasileiro formatado
    if (formattedValue.length <= 15) {
      setPhone(formattedValue);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Por favor, informe seu nome para começarmos.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    // Valida celular brasileiro: (XX) XXXXX-XXXX -> pelo menos 11 dígitos numéricos
    const digitsOnly = phone.replace(/[^\d]/g, '');
    if (digitsOnly.length < 10) {
      setError('Por favor, insira um número de celular válido com DDD.');
      return;
    }

    setIsSubmitting(true);

    // Pequena animação de conexão refinada
    setTimeout(() => {
      onLogin({
        email,
        phone,
        name,
        loggedInAt: new Date().toISOString(),
      });
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div id="login-gateway" className="fixed inset-0 z-50 flex items-center justify-center bg-[#0d0d0d] px-4 overflow-y-auto py-10">
      {/* Background decorativo abstrato e elegante */}
      <div className="absolute inset-0 bg-radial-[circle_at_center,_var(--tw-gradient-stops)] from-[#1a140d] via-[#0d0d0d] to-[#0a0a0a] opacity-80" />
      
      {/* Efeitos de fumaça dourada no fundo */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#dfb86c]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#c5a059]/5 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative w-full max-w-lg bg-[#141414] border border-[#dfb86c]/20 rounded-2xl p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md"
      >
        {/* Detalhe de borda em ouro */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#dfb86c] to-transparent" />
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-12 h-12 rounded-full border border-[#dfb86c]/30 flex items-center justify-center mb-4 bg-gradient-to-b from-[#1c1813] to-[#0d0d0d]">
            <Sparkles className="w-5 h-5 text-[#dfb86c] animate-pulse" />
          </div>
          
          <h1 className="font-serif text-3xl md:text-4xl text-[#f4ebdc] tracking-wide font-light mb-2">
            L'Étoile Atelier
          </h1>
          <p className="text-xs font-mono uppercase tracking-[0.25em] text-[#dfb86c] mb-4">
            Alta Joalheria Exclusiva
          </p>
          
          <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-[#dfb86c]/40 to-transparent mb-4" />
          
          <p className="text-[#a6a6a6] text-sm max-w-sm">
            Seja bem-vindo. Insira suas credenciais de cliente convidado para acessar e encomendar nossa vitrine particular e exclusiva de safiras, esmeraldas e diamantes.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-red-300 text-xs text-center font-sans"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-1">
            <label htmlFor="client-name" className="block text-xs font-mono uppercase tracking-wider text-[#a6a6a6]">
              Nome Completo
            </label>
            <input
              id="client-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite seu nome"
              className="w-full bg-[#1b1b1b] border border-[#dfb86c]/10 focus:border-[#dfb86c] focus:outline-none rounded-lg px-4 py-3 text-[#f4ebdc] text-sm transition-all placeholder:text-[#555]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="client-email" className="block text-xs font-mono uppercase tracking-wider text-[#a6a6a6]">
              E-mail Particular
            </label>
            <input
              id="client-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@exclusivo.com"
              className="w-full bg-[#1b1b1b] border border-[#dfb86c]/10 focus:border-[#dfb86c] focus:outline-none rounded-lg px-4 py-3 text-[#f4ebdc] text-sm transition-all placeholder:text-[#555]"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="client-phone" className="block text-xs font-mono uppercase tracking-wider text-[#a6a6a6]">
              Número de Celular
            </label>
            <input
              id="client-phone"
              type="tel"
              required
              value={phone}
              onChange={handlePhoneChange}
              placeholder="(11) 99999-9999"
              className="w-full bg-[#1b1b1b] border border-[#dfb86c]/10 focus:border-[#dfb86c] focus:outline-none rounded-lg px-4 py-3 text-[#f4ebdc] text-sm transition-all placeholder:text-[#555]"
            />
          </div>

          <button
            id="btn-login-submit"
            type="submit"
            disabled={isSubmitting}
            className="w-full group relative overflow-hidden bg-gradient-to-r from-[#dfb86c] to-[#c5a059] text-[#0d0d0d] font-semibold text-sm rounded-lg py-3.5 mt-2 transition-all hover:opacity-95 flex items-center justify-center gap-2 cursor-pointer shadow-[0_5px_15px_rgba(223,184,108,0.2)] disabled:opacity-50"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-[#0d0d0d]" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Autenticando Visita...
              </span>
            ) : (
              <>
                Entrar na Vitrine Exclusiva
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        <div className="flex items-center justify-center gap-2 mt-8 text-xs text-[#666] font-mono">
          <Lock className="w-3.5 h-3.5 text-[#dfb86c]/60" />
          <span>Sessão Encriptada | Acesso Reservado</span>
        </div>
      </motion.div>
    </div>
  );
}
