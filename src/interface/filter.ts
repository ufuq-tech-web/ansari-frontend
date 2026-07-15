export interface FilterState {
  brands: string[];
  priceRange: [number, number];
  sizes: string[];
  colors: string[];
  rating: number | null;
  discount: number | null;
  availability: string[];
  materials: string[];
  occasions: string[];
  soleMaterials: string[];
  closureTypes: string[];
  heelHeights: string[];
  toeShapes: string[];
}
