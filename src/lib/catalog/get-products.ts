import { prisma } from "@/lib/prisma";

const allowedBadges = [
  "Хит",
  "Новинка",
  "Популярное",
] as const;

type ProductBadge =
  | (typeof allowedBadges)[number]
  | "";

function normalizeBadge(
  badge: string | null,
): ProductBadge {
  if (
    badge &&
    allowedBadges.includes(
      badge as (typeof allowedBadges)[number],
    )
  ) {
    return badge as ProductBadge;
  }

  return "";
}

export async function getCatalogProducts() {
  const products = await prisma.product.findMany({
    where: {
      isActive: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    include: {
      category: true,
      images: {
        where: {
          isPrimary: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
        take: 1,
      },
      stock: true,
    },
  });

  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    brand: product.brand,
    name: product.name,
    description: product.description,
    price: product.price / 100,
    oldPrice:
      product.oldPrice !== null
        ? product.oldPrice / 100
        : undefined,
    image:
      product.images[0]?.url ??
      "/products/placeholder.webp",
    badge: normalizeBadge(product.badge),
    rating: product.rating,
    reviews: product.reviews,
    quantity: product.quantity,
    category: product.category.name,
    stock: product.stock?.quantity ?? 0,
  }));
}