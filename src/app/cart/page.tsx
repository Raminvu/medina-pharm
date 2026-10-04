"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";

import { useCartStore } from "@/store/cart-store";

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const increaseItem = useCartStore((state) => state.increaseItem);
  const decreaseItem = useCartStore((state) => state.decreaseItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const totalItems = items.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-background">
        <section className="mx-auto flex max-w-[900px] flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-24">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingCart className="size-9" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Корзина пуста
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Добавьте товары из каталога, и они появятся здесь.
          </p>

          <Link
            href="/"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          >
            <ArrowLeft className="size-4" />
            Перейти в каталог
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-[70vh] bg-background">
      <section className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            Medina Pharm
          </p>

          <div className="mt-1 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Корзина
              </h1>

              <p className="mt-1 text-sm text-muted-foreground">
                {totalItems}{" "}
                {totalItems === 1
                  ? "товар"
                  : totalItems < 5
                    ? "товара"
                    : "товаров"}
              </p>
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="text-sm font-medium text-muted-foreground transition hover:text-destructive"
            >
              Очистить корзину
            </button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-3">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex gap-3 rounded-2xl border border-border bg-card p-3 sm:gap-4 sm:p-4"
              >
                <Link
                  href={`/catalog/${item.slug}`}
                  className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-[#f7faf7] sm:size-28"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="112px"
                    className="object-contain p-2"
                  />
                </Link>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-muted-foreground">
                    {item.brand}
                  </p>

                  <Link
                    href={`/catalog/${item.slug}`}
                    className="mt-0.5 block text-sm font-semibold transition hover:text-primary sm:text-base"
                  >
                    {item.name}
                  </Link>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.quantity}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center rounded-xl border border-border">
                      <button
                        type="button"
                        onClick={() => decreaseItem(item.id)}
                        className="flex size-9 items-center justify-center text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label={`Уменьшить количество ${item.name}`}
                      >
                        <Minus className="size-4" />
                      </button>

                      <span className="min-w-8 text-center text-sm font-semibold">
                        {item.count}
                      </span>

                      <button
                        type="button"
                        onClick={() => increaseItem(item.id)}
                        className="flex size-9 items-center justify-center text-muted-foreground transition hover:bg-muted hover:text-foreground"
                        aria-label={`Увеличить количество ${item.name}`}
                      >
                        <Plus className="size-4" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                      aria-label={`Удалить ${item.name}`}
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>

                <div className="hidden shrink-0 text-right sm:block">
                  <p className="text-base font-bold">
                    {(item.price * item.count).toLocaleString(
                      "ru-RU",
                    )}{" "}
                    ₽
                  </p>

                  {item.count > 1 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.price.toLocaleString("ru-RU")} ₽ ×{" "}
                      {item.count}
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">
              Ваш заказ
            </h2>

            <div className="mt-5 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  Товары
                </span>

                <span className="font-medium">
                  {totalItems} шт.
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  Доставка
                </span>

                <span className="font-medium">
                  Рассчитаем при оформлении
                </span>
              </div>
            </div>

            <div className="my-5 h-px bg-border" />

            <div className="flex items-end justify-between gap-4">
              <span className="font-medium">
                Итого
              </span>

              <span className="text-2xl font-bold">
                {totalPrice.toLocaleString("ru-RU")} ₽
              </span>
            </div>

            <button
              type="button"
              className="mt-5 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
            >
              Оформить заказ
            </button>

            <Link
              href="/"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              Продолжить покупки
            </Link>
          </aside>
        </div>
      </section>
    </main>
  );
}