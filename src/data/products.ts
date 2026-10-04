export type ProductBadge = "Хит" | "Новинка" | "Популярное" | "";

export type Product = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge: ProductBadge;
  rating: number;
  reviews: number;
  quantity: string;
  category: string;
  tags: string[];
};

export const products: Product[] = [
  {
    id: 1,
    slug: "vitamin-d3",
    brand: "Medina",
    name: "Vitamin D3",
    description: "Витамин D3 для ежедневного рациона",
    price: 890,
    oldPrice: 1090,
    image: "/products/vitamin-d3.webp",
    badge: "Хит",
    rating: 4.8,
    reviews: 124,
    quantity: "60 капсул",
    category: "Витамины",
    tags: ["Витамин D", "Иммунитет"],
  },
  {
    id: 2,
    slug: "omega-3",
    brand: "Medina",
    name: "Omega-3",
    description: "Комплекс омега-3 жирных кислот",
    price: 1290,
    oldPrice: 1490,
    image: "/products/omega-3.webp",
    badge: "Популярное",
    rating: 4.8,
    reviews: 98,
    quantity: "60 капсул",
    category: "БАДы",
    tags: ["Омега-3", "Сердце"],
  },
  {
    id: 3,
    slug: "magnesium-b6",
    brand: "Medina",
    name: "Magnesium + B6",
    description: "Магний для ежедневной поддержки",
    price: 790,
    oldPrice: 950,
    image: "/products/magnesium-b6.webp",
    badge: "Новинка",
    rating: 4.8,
    reviews: 76,
    quantity: "60 капсул",
    category: "Минералы",
    tags: ["Магний", "Витамины группы B"],
  },
  {
    id: 4,
    slug: "multivitamin",
    brand: "Medina",
    name: "Multivitamin",
    description: "Комплекс витаминов и минералов",
    price: 1490,
    image: "/products/multivitamin.webp",
    badge: "",
    rating: 4.8,
    reviews: 142,
    quantity: "60 капсул",
    category: "Витамины",
    tags: ["Мультивитамины"],
  },
  {
    id: 5,
    slug: "zinc-vitamin-c",
    brand: "Medina",
    name: "Zinc + Vitamin C",
    description: "Цинк и витамин C для поддержки иммунитета",
    price: 690,
    oldPrice: 790,
    image: "/products/zinc-vitamin-c.webp",
    badge: "Хит",
    rating: 4.8,
    reviews: 89,
    quantity: "60 капсул",
    category: "Иммунитет",
    tags: ["Цинк", "Витамин C"],
  },
  {
    id: 6,
    slug: "vitamin-b-complex",
    brand: "Medina",
    name: "Vitamin B Complex",
    description: "Комплекс витаминов группы B",
    price: 850,
    image: "/products/vitamin-b-complex.webp",
    badge: "Новинка",
    rating: 4.8,
    reviews: 64,
    quantity: "60 капсул",
    category: "Витамины",
    tags: ["Витамины группы B"],
  },
  {
    id: 7,
    slug: "iron-balance",
    brand: "Medina",
    name: "Iron Balance",
    description: "Комплекс с железом",
    price: 720,
    oldPrice: 820,
    image: "/products/iron-balance.webp",
    badge: "",
    rating: 4.8,
    reviews: 53,
    quantity: "60 капсул",
    category: "Минералы",
    tags: ["Железо"],
  },
  {
    id: 8,
    slug: "calcium-d3",
    brand: "Medina",
    name: "Calcium + D3",
    description: "Кальций с витамином D3",
    price: 990,
    image: "/products/calcium-d3.webp",
    badge: "Популярное",
    rating: 4.8,
    reviews: 71,
    quantity: "60 капсул",
    category: "Минералы",
    tags: ["Кальций", "Витамин D"],
  },
];