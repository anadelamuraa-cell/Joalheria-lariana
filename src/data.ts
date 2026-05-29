import { Product } from './types';

export const productsData: Product[] = [
  {
    id: 'ring-01',
    name: 'Anel de Noivado Aura Celeste',
    category: 'Anéis',
    price: 18500,
    image: '/src/assets/images/luxury_gold_ring_1779997963491.png',
    description: 'Um solitário extraordinário em Ouro Amarelo 18k, coroado por lapidação brilhante de precisão absoluta. O equilíbrio perfeito entre herança clássica e design minimalista contemporâneo.',
    specs: {
      metal: 'Ouro Amarelo 18k',
      gem: 'Diamante Natural 1.5 Quilates',
      carats: '1.5ct',
      clarity: 'VVS1 - Cor D (Incolor)'
    },
    exclusive: true
  },
  {
    id: 'necklace-01',
    name: 'Colar Imperatriz Esmeralda',
    category: 'Colares',
    price: 34200,
    image: '/src/assets/images/emerald_necklace_1779997979996.png',
    description: 'Uma magnífica gema de esmeralda lapidada em formato gota, abraçada por uma fina moldura de diamantes pavé reluzentes em ouro branco. Uma verdadeira obra imperial de presença inesquecível.',
    specs: {
      metal: 'Ouro Branco 18k',
      gem: 'Esmeralda Colombiana de 2.0ct',
      carats: '2.0ct (Esmeralda) + 0.5ct (Diamantes)',
      clarity: 'Excelente, Verde Vivo Profundo'
    },
    exclusive: true
  },
  {
    id: 'earrings-01',
    name: 'Brincos Royale Nuit Maritima',
    category: 'Brincos',
    price: 22800,
    image: '/src/assets/images/sapphire_earrings_1779998000010.png',
    description: 'Par de brincos de gota com safiras azuis ovais profundas e halos de lapidação brilhante em platina fina. Capturam a luz natural com sutileza incomparável em qualquer evento noturno.',
    specs: {
      metal: 'Platina 950',
      gem: 'Safiras Azuis Naturais 3.2ct t.w.',
      carats: '3.2ct t.w. (Safiras) + 0.8ct t.w. (Brilhantes)',
      clarity: 'Saturação Profunda Real'
    },
    exclusive: true
  },
  {
    id: 'bracelet-01',
    name: 'Pulseira Riviera Infinito',
    category: 'Pulseiras',
    price: 15300,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=600',
    description: 'Uma linha incessante de brilhantes milimetricamente selecionados em cravação integrada de baixo perfil. Desenhada para fluir livremente sobre o pulso com flexibilidade orgânica.',
    specs: {
      metal: 'Ouro Branco 18k',
      gem: 'Diamantes de Lapidação Brilhante 2.5ct t.w.',
      carats: '2.5ct total',
      clarity: 'VS2 - Cor G'
    },
    exclusive: false
  },
  {
    id: 'ring-02',
    name: 'Aliança Éternelle Rubis',
    category: 'Anéis',
    price: 9800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    description: 'Meia aliança cravejada com rubis de lapidação princesa alternados com diamantes baguete. Um toque apaixonado de vigor e sofisticação intemporal.',
    specs: {
      metal: 'Ouro Rosé 18k',
      gem: 'Rubis de Mianmar e Diamantes Baguete',
      carats: '1.2ct t.w.',
      clarity: 'VVS2 - Tons Vermelhos Intensos'
    },
    exclusive: false
  },
  {
    id: 'earrings-02',
    name: 'Brincos Solitários L\'Éclat',
    category: 'Brincos',
    price: 12400,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&q=80&w=600',
    description: 'Brincos clássicos de garra de quatro pontas prendendo brilhantes solitários excepcionais. O acessório definitivo de elegância sutil e brilho maximizado.',
    specs: {
      metal: 'Ouro Branco 18k',
      gem: 'Dois Diamantes Brilhantes de 0.50ct cada',
      carats: '1.0ct total par',
      clarity: 'VVS2 - Cor F'
    },
    exclusive: false
  }
];
