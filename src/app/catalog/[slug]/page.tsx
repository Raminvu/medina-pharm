import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Heart,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = await prisma.product.findFirst({
    where: {
      slug,
      isActive: true,
    },
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

  if (!product) {
    notFound();
  }

  const image =
    product.images[0]?.url ?? "/products/placeholder.webp";

  const price = product.price / 100;
  const oldPrice =
    product.oldPrice !== null
      ? product.oldPrice / 100
      : null;

  const stock = product.stock?.quantity ?? 0;

  const isInStock = stock > 0;

  return (
    <main className="bg-background">
      <section className="mx-auto max-w-[1440px] px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
        {/* Breadcrumbs */}

        <nav
          aria-label="Хлебные крошки"
          className="mb-5 flex items-center gap-1.5 overflow-hidden text-sm text-muted-foreground"
        >
          <Link
            href="/"
            className="shrink-0 transition-colors hover:text-primary"
          >
            Главная
          </Link>

          <ChevronRight className="size-4 shrink-0" />

          <Link
            href="/catalog"
            className="shrink-0 transition-colors hover:text-primary"
          >
            Каталог
          </Link>

          <ChevronRight className="size-4 shrink-0" />

          <span className="truncate text-foreground">
            {product.name}
          </span>
        </nav>

        {/* Product */}

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-10">
          {/* Product image */}

          <div>
            <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-border bg-muted/20 p-8 sm:min-h-[500px] lg:min-h-[560px]">
              {product.badge && (
                <span className="absolute left-5 top-5 z-10 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground">
                  {product.badge}
                </span>
              )}

              <button
                type="button"
                aria-label="Добавить в избранное"
                className="absolute right-5 top-5 z-10 flex size-10 items-center justify-center rounded-full border border-border bg-background text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              >
                <Heart className="size-5" />
              </button>

              <Image
                src={image}
                alt={product.name}
                width={600}
                height={600}
                priority
                className="max-h-[430px] w-full max-w-[500px] object-contain"
              />
            </div>
          </div>

          {/* Product info */}

          <div className="lg:pt-2">
            <p className="text-sm font-medium text-primary">
              {product.brand}
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight sm:text-4xl">
              {product.name}
            </h1>

            {/* Rating */}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-current text-amber-400" />

                <span className="text-sm font-semibold">
                  {product.rating.toFixed(1)}
                </span>
              </div>

              <span className="text-sm text-muted-foreground">
                {product.reviews} отзывов
              </span>

              <span className="size-1 rounded-full bg-border" />

              <span className="text-sm text-muted-foreground">
                {product.quantity}
              </span>
            </div>

            {/* Description */}

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>

            <div className="my-5 h-px bg-border" />

            {/* Price */}

            <div className="flex items-end gap-3">
              <span className="text-3xl font-bold tracking-tight">
                {price.toLocaleString("ru-RU")} ₽
              </span>

              {oldPrice !== null && (
                <span className="pb-1 text-base text-muted-foreground line-through">
                  {oldPrice.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>

            {oldPrice !== null && oldPrice > price && (
              <p className="mt-1 text-xs font-medium text-primary">
                Экономия{" "}
                {(oldPrice - price).toLocaleString("ru-RU")} ₽
              </p>
            )}

            {/* Stock */}

            <div className="mt-3">
              {isInStock ? (
                <p className="text-sm font-medium text-green-600">
                  В наличии: {stock} шт.
                </p>
              ) : (
                <p className="text-sm font-medium text-destructive">
                  Нет в наличии
                </p>
              )}
            </div>

            {/* Quantity + cart */}

            <div className="mt-5 flex gap-2">
              <div className="flex h-12 shrink-0 items-center rounded-xl border border-border">
                <button
                  type="button"
                  aria-label="Уменьшить количество"
                  disabled
                  className="flex size-11 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Minus className="size-4" />
                </button>

                <span className="w-7 text-center text-sm font-semibold">
                  1
                </span>

                <button
                  type="button"
                  aria-label="Увеличить количество"
                  disabled
                  className="flex size-11 items-center justify-center text-muted-foreground transition hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <button
                type="button"
                disabled={!isInStock}
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ShoppingCart className="size-5" />

                {isInStock
                  ? "В корзину"
                  : "Нет в наличии"}
              </button>

              <button
                type="button"
                aria-label="Добавить в избранное"
                className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:border-primary/30 hover:text-primary"
              >
                <Heart className="size-5" />
              </button>
            </div>

            {/* Characteristics */}

            <div className="mt-6">
              <h2 className="text-base font-semibold">
                Характеристики
              </h2>

              <div className="mt-3 overflow-hidden rounded-2xl border border-border">
                <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
                  <span className="text-muted-foreground">
                    Бренд
                  </span>

                  <span className="font-medium">
                    {product.brand}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
                  <span className="text-muted-foreground">
                    Категория
                  </span>

                  <Link
                    href={`/catalog?category=${product.category.slug}`}
                    className="font-medium transition-colors hover:text-primary"
                  >
                    {product.category.name}
                  </Link>
                </div>

                <div className="flex items-center justify-between border-b border-border px-4 py-3 text-sm">
                  <span className="text-muted-foreground">
                    Количество
                  </span>

                  <span className="font-medium">
                    {product.quantity}
                  </span>
                </div>

                {product.sku && (
                  <div className="flex items-center justify-between px-4 py-3 text-sm">
                    <span className="text-muted-foreground">
                      Артикул
                    </span>

                    <span className="font-medium">
                      {product.sku}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}

        <div className="mt-8 border-t border-border pt-7 lg:mt-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
            <div>
              <h2 className="text-xl font-semibold">
                О товаре
              </h2>

              <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
                {product.description}
              </p>
            </div>

            <div className="rounded-2xl bg-muted/30 p-5">
              <p className="text-sm font-semibold">
                Важная информация
              </p>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Перед применением ознакомьтесь с информацией
                на упаковке и рекомендациями производителя.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}