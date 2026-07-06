// Types TypeScript pour les attributs produits dynamiques

export interface ProductAttributes {
  // Set A: Informatique
  processor?: string;
  ram?: string;
  storage?: string;
  screenSize?: string;
  os?: string;
  
  // Set B: Photo/Vidéo
  sensor?: string;
  resolution?: string;
  lensMount?: string;
  
  // Set C: Mobilité
  autonomy?: number;
  maxSpeed?: number;
  maxWeight?: number;
  motorPower?: number;
  
  // Set D: Jardin
  mowingArea?: number;
  maxSlope?: number;
  connectivity?: string[];
  noiseLevel?: number;
  
  // Set E: Outils
  material?: string;
  telescopic?: boolean;
}

export interface ProductDimensions {
  length: number; // cm
  width: number;  // cm
  height: number; // cm
}

export interface LocalizedString {
  fr: string;
  en: string;
  es: string;
  de: string;
  it: string;
}

