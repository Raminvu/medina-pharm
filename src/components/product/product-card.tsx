"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Check,
  Crown,
  Flame,
  Heart,
  ShoppingCart,
  Sparkles,
} from "lucide-react";

import { products } from "@/data/products";
import { useCartStore } from "@/store/cart-store";
import { useFavoritesStore } from "@/store/favorites-store";

type ProductBadge = "Хит" | "Новинка" | "Популярное" | "";

type ProductCardProps = {
  id?: number;
  slug: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge?: ProductBadge;
  rating?: number;
  reviews?: number;
  quantity?: string;
};

const badgeConfig = {
  Хит: {
    icon: Flame,
  },
  Новинка: {
    icon: Sparkles,
  },
  Популярное: {
    icon: Crown,
  },
} as const;

export default function ProductCard({
  id,
  slug,
  brand,
  name,
  description,
  price,
  oldPrice,
  image,
  badge = "",
  rating = 4.8,
  reviews = 124,
  quantity = "60 капсул",
}: ProductCardProps) {
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((state) => state.addItem);

  const toggleFavorite = useFavoritesStore(
    (state) => state.toggleFavorite,
  );

  const favoriteIds = useFavoritesStore(
    (state) => state.favoriteIds,
  );

  const product = products.find(
    (item) => item.slug === slug,
  );

  const favoriteId = id ?? product?.id;

  const isFavorite =
    favoriteId !== undefined &&
    favoriteIds.includes(favoriteId);

  const BadgeIcon = badge ? badgeConfig[badge].icon : null;

  const handleAddToCart = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (!product && id === undefined) {
      console.error(
        "Medina Pharm: товар не найден:",
        slug,
      );
      return;
    }

    const productId = id ?? product?.id;

    if (productId === undefined) {
      console.error(
        "Medina Pharm: у товара отсутствует id:",
        slug,
      );
      return;
    }

    addItem({
      id: productId,
      slug,
      brand,
      name,
      price,
      oldPrice,
      image,
      quantity,
    });

    setAdded(true);

    window.setTimeout(() => {
      setAdded(false);
    }, 1200);
  };

  const handleToggleFavorite = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    if (favoriteId === undefined) {
      console.error(
        "Medina Pharm: у товара отсутствует id:",
        slug,
      );
      return;
    }

    toggleFavorite(favoriteId);
  };

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
      {badge && BadgeIcon && (
        <div className="pointer-events-none absolute left-3 top-3 z-10 flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold text-primary-foreground sm:text-xs">
          <BadgeIcon className="size-3 sm:size-3.5" />
          <span>{badge}</span>
        </div>
      )}

      <button
        type="button"
        className={`absolute right-3 top-3 z-20 flex size-9 items-center justify-center rounded-full border bg-background/95 transition-all ${
          isFavorite
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border/70 hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
        }`}
        aria-label={
          isFavorite
            ? `Удалить ${name} из избранного`
            : `Добавить ${name} в избранное`
        }
        aria-pressed={isFavorite}
        onClick={handleToggleFavorite}
      >
        <Heart
          className="size-[17px]"
          fill={isFavorite ? "currentColor" : "none"}
        />
      </button>

      <Link
        href={`/catalog/${slug}`}
        className="flex min-w-0 flex-1 flex-col"
        aria-label={`Открыть товар ${name}`}
      >
        <div className="relative flex aspect-[1.05] items-center justify-center bg-[#f7faf7] p-4 sm:p-5">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 639px) 50vw, (max-width: 1279px) 33vw, 25vw"
            className="object-contain p-3 transition-transform duration-300 group-hover:scale-[1.03] sm:p-4"
          />
        </div>

        <div className="flex flex-1 flex-col px-3.5 pb-3.5 pt-3 sm:px-4 sm:pb-4">
          <p className="text-[11px] font-medium text-muted-foreground sm:text-xs">
            {brand}
          </p>

          <h2 className="mt-1 text-sm font-semibold leading-tight sm:text-[15px]">
            {name}
          </h2>

          <p className="mt-1 line-clamp-2 min-h-[32px] text-[11px] leading-relaxed text-muted-foreground sm:text-xs">
            {description}
          </p>

          <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground sm:text-xs">
            <span className="flex items-center gap-1">
              <span className="text-[#f5b400]">★</span>

              <span className="font-medium text-foreground">
                {rating}
              </span>

              <span>({reviews})</span>
            </span>

            <span className="text-border">•</span>

            <span>{quantity}</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-3 pr-11">
            <div className="flex min-w-0 flex-wrap items-baseline gap-2">
              <span className="text-lg font-bold leading-none sm:text-xl">
                {price.toLocaleString("ru-RU")} ₽
              </span>

              {oldPrice && (
                <span className="text-xs text-muted-foreground line-through">
                  {oldPrice.toLocaleString("ru-RU")} ₽
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className={`absolute bottom-3 right-3 z-30 flex size-10 items-center justify-center rounded-xl shadow-sm transition-all hover:shadow-md sm:bottom-4 sm:right-4 ${
          added
            ? "bg-green-600 text-white hover:bg-green-600"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
        aria-label={
          added
            ? `${name} добавлен в корзину`
            : `Добавить ${name} в корзину`
        }
        onClick={handleAddToCart}
      >
        {added ? (
          <Check className="size-[19px]" />
        ) : (
          <ShoppingCart className="size-[18px]" />
        )}
      </button>
    </article>
  );
}