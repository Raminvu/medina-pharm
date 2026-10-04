import { PrismaClient } from "../src/generated/prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Витамины",
    slug: "vitaminy",
    description: "Витамины для ежедневного рациона",
    sortOrder: 1,
  },
  {
    name: "БАДы",
    slug: "bady",
    description: "Биологически активные добавки",
    sortOrder: 2,
  },
  {
    name: "Минералы",
    slug: "mineraly",
    description: "Минералы и микроэлементы",
    sortOrder: 3,
  },
  {
    name: "Иммунитет",
    slug: "immunitet",
    description: "Поддержка иммунной системы",
    sortOrder: 4,
  },
  {
    name: "Красота",
    slug: "krasota",
    description: "Продукты для кожи, волос и ногтей",
    sortOrder: 5,
  },
  {
    name: "Спорт",
    slug: "sport",
    description: "Спортивное питание и восстановление",
    sortOrder: 6,
  },
  {
    name: "Для детей",
    slug: "dlya-detey",
    description: "Витамины и добавки для детей",
    sortOrder: 7,
  },
];

const products = [
  {
    slug: "vitamin-d3-2000",
    brand: "Medina",
    name: "Vitamin D3 2000 МЕ",
    description:
      "Витамин D3 для ежедневного рациона и поддержания нормального обмена кальция.",
    price: 89000,
    oldPrice: 109000,
    quantity: "60 капсул",
    badge: "Хит",
    rating: 4.8,
    reviews: 124,
    image: "/products/vitamin-d3.webp",
    categorySlug: "vitaminy",
    stock: 35,
  },
  {
    slug: "magnesium-b6",
    brand: "Medina",
    name: "Магний + B6",
    description:
      "Комплекс магния и витамина B6 для ежедневного рациона.",
    price: 75000,
    quantity: "60 таблеток",
    badge: "Популярное",
    rating: 4.9,
    reviews: 98,
    image: "/products/magnesium-b6.webp",
    categorySlug: "mineraly",
    stock: 42,
  },
  {
    slug: "omega-3",
    brand: "Medina",
    name: "Омега-3",
    description:
      "Источник полиненасыщенных жирных кислот Омега-3.",
    price: 129000,
    oldPrice: 149000,
    quantity: "60 капсул",
    badge: "Хит",
    rating: 4.8,
    reviews: 156,
    image: "/products/omega-3.webp",
    categorySlug: "bady",
    stock: 28,
  },
  {
    slug: "zinc-vitamin-c",
    brand: "Medina",
    name: "Цинк + Витамин C",
    description:
      "Комплекс цинка и витамина C для ежедневного рациона.",
    price: 69000,
    quantity: "60 таблеток",
    badge: "Новинка",
    rating: 4.7,
    reviews: 76,
    image: "/products/zinc-vitamin-c.webp",
    categorySlug: "immunitet",
    stock: 50,
  },
];

async function main() {
  console.log("🌱 Начинаем заполнение базы...");

  for (const category of categories) {
    await prisma.category.upsert({
      where: {
        slug: category.slug,
      },
      update: {
        name: category.name,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
      create: {
        name: category.name,
        slug: category.slug,
        description: category.description,
        sortOrder: category.sortOrder,
        isActive: true,
      },
    });
  }

  console.log(`✓ Категорий обработано: ${categories.length}`);

  for (const product of products) {
    const category = await prisma.category.findUnique({
      where: {
        slug: product.categorySlug,
      },
    });

    if (!category) {
      throw new Error(
        `Категория "${product.categorySlug}" не найдена.`,
      );
    }

    const savedProduct = await prisma.product.upsert({
      where: {
        slug: product.slug,
      },
      update: {
        brand: product.brand,
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: product.quantity,
        badge: product.badge,
        rating: product.rating,
        reviews: product.reviews,
        categoryId: category.id,
        isActive: true,
      },
      create: {
        slug: product.slug,
        brand: product.brand,
        name: product.name,
        description: product.description,
        price: product.price,
        oldPrice: product.oldPrice,
        quantity: product.quantity,
        badge: product.badge,
        rating: product.rating,
        reviews: product.reviews,
        categoryId: category.id,
        isActive: true,
      },
    });

    await prisma.productImage.deleteMany({
      where: {
        productId: savedProduct.id,
      },
    });

    await prisma.productImage.create({
      data: {
        productId: savedProduct.id,
        url: product.image,
        alt: product.name,
        sortOrder: 0,
        isPrimary: true,
      },
    });

    await prisma.productStock.upsert({
      where: {
        productId: savedProduct.id,
      },
      update: {
        quantity: product.stock,
      },
      create: {
        productId: savedProduct.id,
        quantity: product.stock,
      },
    });
  }

  console.log(`✓ Товаров обработано: ${products.length}`);
  console.log("✅ Seed успешно завершён.");
}

main()
  .catch((error) => {
    console.error("❌ Ошибка seed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });