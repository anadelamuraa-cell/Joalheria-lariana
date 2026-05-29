export interface UserSession {
  email: string;
  phone: string;
  loggedInAt: string;
  name?: string;
}

export type ResourceCategory = 'Anéis' | 'Colares' | 'Brincos' | 'Pulseiras';
export type MetalType = 'Ouro Amarelo 18k' | 'Ouro Branco 18k' | 'Ouro Rosé 18k' | 'Platina 950';
export type GemstoneType = 'Diamante' | 'Esmeralda' | 'Safira' | 'Rubi' | 'Sem Gema';

export interface Product {
  id: string;
  name: string;
  category: ResourceCategory;
  price: number;
  image: string;
  description: string;
  specs: {
    metal: string;
    gem: string;
    carats?: string;
    clarity?: string;
  };
  exclusive: boolean;
}

export interface CustomOrder {
  id: string;
  clientEmail: string;
  clientPhone: string;
  productNameReference?: string;
  metal: MetalType;
  gemstone: GemstoneType;
  size: string;
  engraving?: string;
  details: string;
  createdAt: string;
  estimatedPrice: number;
  status: 'Pendente' | 'Em Análise' | 'Aprovado';
}
