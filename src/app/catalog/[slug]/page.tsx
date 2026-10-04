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

import { products } from "@/data/products";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: ProductPageProps) {
  const { slug } = await params;

  const product = products.find(
    (item) => item.slug === slug,
  );

  if (!product) {
    notFound();
  }

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
                src={product.image}
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
                  {product.rating}
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
                {product.price.toLocaleString("ru-RU")} ₽
              </span>

              {product.oldPrice && (
                <span className="pb-1 text-base text-muted-foreground line-through">
                  {product.oldPrice.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>

            {product.oldPrice && (
              <p className="mt-1 text-xs font-medium text-primary">
                Экономия{" "}
                {(
                  product.oldPrice - product.price
                ).toLocaleString("ru-RU")}{" "}
                ₽
              </p>
            )}

            {/* Quantity + cart */}

            <div className="mt-5 flex gap-2">
              <div className="flex h-12 shrink-0 items-center rounded-xl border border-border">
                <button
                  type="button"
                  aria-label="Уменьшить количество"
                  className="flex size-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
                >
                  <Minus className="size-4" />
                </button>

                <span className="w-7 text-center text-sm font-semibold">
                  1
                </span>

                <button
                  type="button"
                  aria-label="Увеличить количество"
                  className="flex size-11 items-center justify-center text-muted-foreground transition hover:text-foreground"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <button
                type="button"
                className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                <ShoppingCart className="size-5" />
                В корзину
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

                  <span className="font-medium">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span className="text-muted-foreground">
                    Количество
                  </span>

                  <span className="font-medium">
                    {product.quantity}
                  </span>
                </div>
              </div>
            </div>

            {/* Tags */}

            {product.tags.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
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
                {product.description}. Информация о
                составе, способе применения и других
                характеристиках товара будет размещена
                здесь после подключения полноценной базы
                товаров.
              </p>
            </div>

            <div className="rounded-2xl bg-muted/30 p-5">
              <p className="text-sm font-semibold">
                Важная информация
              </p>

              <p className="mt-2 text-xs leading-5 text-muted-foreground">
                Перед применением ознакомьтесь с
                информацией на упаковке и рекомендациями
                производителя.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}