"use client";

import Link from "next/link";
import { useEffect } from "react";
import {
  ChevronRight,
  Heart,
  ShoppingCart,
  UserRound,
  X,
} from "lucide-react";

const navigation = [
  { label: "Каталог", href: "/catalog" },
  { label: "Категории", href: "/categories" },
  { label: "Акции", href: "/promotions" },
  { label: "Доставка", href: "/delivery" },
];

type MobileMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMenu({
  open,
  onClose,
}: MobileMenuProps) {
  useEffect(() => {
    if (!open) {
      document.body.style.overflow = "";
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] lg:hidden">
      {/* Затемнение */}
      <button
        type="button"
        aria-label="Закрыть меню"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
      />

      {/* Панель */}
      <aside className="absolute right-0 top-0 flex h-full w-[min(88%,380px)] flex-col bg-background shadow-2xl">
        {/* Заголовок */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-5">
          <span className="text-lg font-semibold">
            Меню
          </span>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть меню"
            className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Содержимое */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <nav className="space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition-colors hover:bg-muted"
              >
                <span>{item.label}</span>

                <ChevronRight className="size-5 text-muted-foreground" />
              </Link>
            ))}
          </nav>

          <div className="my-5 h-px bg-border" />

          <div className="space-y-1">
            <Link
              href="/favorites"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Heart className="size-5 text-muted-foreground" />
              <span>Избранное</span>
            </Link>

            <Link
              href="/cart"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <ShoppingCart className="size-5 text-muted-foreground" />

              <span>Корзина</span>

              <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                0
              </span>
            </Link>

            <Link
              href="/profile"
              onClick={onClose}
              className="flex items-center gap-3 rounded-xl px-4 py-3.5 text-sm font-medium transition-colors hover:bg-muted"
            >
              <UserRound className="size-5 text-muted-foreground" />
              <span>Профиль</span>
            </Link>
          </div>
        </div>

        {/* Телефон */}
        <div className="shrink-0 border-t border-border p-5">
          <p className="mb-1 text-xs text-muted-foreground">
            Нужна помощь?
          </p>

          <a
            href="tel:+79280000733"
            className="text-base font-semibold text-primary"
          >
            8 928 000-07-33
          </a>
        </div>
      </aside>
    </div>
  );
}