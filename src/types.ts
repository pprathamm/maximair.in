export interface Product {
  id: string;
  name: string;
  dimensions: string;
  height: number;
  width: number;
  depth: number;
  price: number;
  image: string;
  flute: string;
  efficiency: string;
  isCustom?: boolean;
}

export interface CatalogProduct {
  id: string;
  sku: string;
  title: string;
  subtitle: string;
  category: '7090' | '5090' | 'black-edge' | 'custom';
  height: number;
  width: number;
  depth: number;
  price: number;
  priceNote: string;
  image: string;
  badgePrimary: string;
  badgePrimaryClass: string;
  badgeSecondary: string;
  badgeSecondaryClass: string;
  fluteTag: string;
  specs: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
  };
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  edgeCoating: string;
  unitPrice: number;
}

export interface ApplicationItem {
  id: string;
  tag: string;
  title: string;
  metric: string;
  description: string;
  image: string;
  stats: {
    tempDrop: string;
    flowRate: string;
    airSpeed: string;
  };
}

export interface SpecificationItem {
  series: string;
  pitch: string;
  fluteAngle: string;
  faceVelocity: string;
  efficiency: string;
  pressureDrop: string;
  applications: string;
}

export interface FeatureDetail {
  id: string;
  title: string;
  icon: string;
  shortDesc: string;
  fullDesc: string;
  specs: { label: string; value: string }[];
}
