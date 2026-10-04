"use client";

import Link from "next/link";
import { ArrowRight, Heart } from "lucide-react";

import ProductCard from "@/components/product/product-card";
import { useFavoritesStore } from "@/store/favorites-store";

type FavoriteProduct = Awaited<
  ReturnType<
    typeof import("@/lib/catalog/get-products").getCatalogProducts
  >
>[number];

type FavoritesContentProps = {
  products: FavoriteProduct[];
};

export default function FavoritesContent({
  products,
}: FavoritesContentProps) {
  const favoriteIds = useFavoritesStore(
    (state) => state.favoriteIds,
  );

  const favoriteProducts = products.filter((product) =>
    favoriteIds.includes(product.id),
  );

  return (
    <main className="min-h-[70vh] bg-background">
      <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            Medina Pharm
          </p>

          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Избранное
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {favoriteProducts.length === 0
                  ? "Здесь будут товары, которые вам понравились"
                  : `${favoriteProducts.length} ${getProductWord(
                      favoriteProducts.length,
                    )}`}
              </p>
            </div>
          </div>
        </div>

        {favoriteProducts.length === 0 ? (
          <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-muted/10 px-6 py-12 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Heart className="size-9" />
            </div>

            <h2 className="mt-6 text-xl font-semibold sm:text-2xl">
              В избранном пока ничего нет
            </h2>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
              Добавляйте понравившиеся товары в избранное,
              чтобы быстро вернуться к ним позже.
            </p>

            <Link
              href="/catalog"
              className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Перейти в каталог
              <ArrowRight className="size-4" />
            </Link>
          </section>
        ) : (
          <section>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  slug={product.slug}
                  brand={product.brand}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  oldPrice={product.oldPrice}
                  image={product.image}
                  badge={product.badge}
                  rating={product.rating}
                  reviews={product.reviews}
                  quantity={product.quantity}
                />
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}

function getProductWord(count: number) {
  const lastTwo = count % 100;
  const last = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return "товаров";
  }

  if (last === 1) {
    return "товар";
  }

  if (last >= 2 && last <= 4) {
    return "товара";
  }

  return "товаров";
}