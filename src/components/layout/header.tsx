"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ChevronDown,
  Heart,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import MobileMenu from "@/components/layout/mobile-menu";
import { useCartStore } from "@/store/cart-store";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce(
    (total, item) => total + item.count,
    0,
  );

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="mx-auto flex min-h-[72px] w-full max-w-[1440px] items-center gap-3 px-4 sm:px-6 lg:gap-4 lg:px-8">
          <Link
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Medina Pharm — главная"
          >
            <Image
              src="/logo.svg"
              alt="Medina Pharm"
              width={125}
              height={40}
              priority
              className="h-auto w-[118px] object-contain sm:w-[125px]"
            />
          </Link>

          <Link
            href="/catalog"
            className="hidden h-11 shrink-0 items-center gap-2 rounded-2xl border border-primary/10 bg-[#eef7f1] px-4 text-sm font-semibold text-[#176b3b] transition-all hover:border-primary/20 hover:bg-[#e5f2e9] lg:flex"
          >
            <Menu className="size-[18px]" />
            <span>Каталог</span>
            <ChevronDown className="ml-0.5 size-4" />
          </Link>

          <div className="relative hidden min-w-0 flex-1 md:block">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />

            <input
              type="search"
              placeholder="Поиск витаминов, БАДов и товаров для здоровья..."
              className="h-11 w-full rounded-2xl border border-border bg-muted/20 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-muted-foreground focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/10"
              aria-label="Поиск витаминов, БАДов и товаров для здоровья"
            />
          </div>

          <a
            href="tel:+79280000733"
            className="hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-2 py-2 text-sm font-medium text-foreground transition-colors hover:bg-primary/5 hover:text-primary xl:flex"
            aria-label="Позвонить по номеру 8 928 000-07-33"
          >
            <Phone className="size-[18px]" />
            <span>8 928 000-07-33</span>
          </a>

          <nav className="ml-auto flex shrink-0 items-center gap-1 sm:gap-2">
            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-muted md:hidden"
              aria-label="Поиск"
            >
              <Search className="size-[19px]" />
            </button>

            <Link
              href="/favorites"
              className="flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-muted"
              aria-label="Избранное"
            >
              <Heart className="size-[20px]" />
            </Link>

            <Link
              href="/cart"
              className="relative flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-muted"
              aria-label={`Корзина, ${totalItems} товаров`}
            >
              <ShoppingCart className="size-[20px]" />

              {totalItems > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-[17px] items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            <Link
              href="/account"
              className="hidden size-10 items-center justify-center rounded-xl transition-colors hover:bg-muted sm:flex"
              aria-label="Профиль"
            >
              <UserRound className="size-[20px]" />
            </Link>

            <button
              type="button"
              className="flex size-10 items-center justify-center rounded-xl transition-colors hover:bg-muted lg:hidden"
              aria-label="Открыть меню"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen(true)}
            >
              <Menu className="size-[20px]" />
            </button>
          </nav>
        </div>

        <div className="border-t border-border/50 px-4 py-3 md:hidden">
          <div className="mx-auto w-full max-w-[1440px]">
            <div className="relative">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                aria-hidden="true"
              />

              <input
                type="search"
                placeholder="Поиск витаминов и БАДов..."
                className="h-11 w-full rounded-2xl border border-border bg-muted/20 pl-11 pr-4 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/30 focus:bg-background focus:ring-4 focus:ring-primary/10"
                aria-label="Поиск витаминов и БАДов"
              />
            </div>
          </div>
        </div>
      </header>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
      />
    </>
  );
}