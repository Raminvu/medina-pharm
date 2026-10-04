"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Heart,
  Home,
  Menu,
  ShoppingCart,
  UserRound,
} from "lucide-react";

import { useCartStore } from "@/store/cart-store";

const navigation = [
  {
    label: "Главная",
    href: "/",
    icon: Home,
  },
  {
    label: "Каталог",
    href: "/catalog",
    icon: Menu,
  },
  {
    label: "Избранное",
    href: "/favorites",
    icon: Heart,
  },
  {
    label: "Профиль",
    href: "/account",
    icon: UserRound,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce(
    (total, item) => total + item.count,
    0,
  );

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname === href || pathname.startsWith(`${href}/`);
  };

  const cartActive = isActive("/cart");

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border/70 bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:hidden"
      aria-label="Мобильная навигация"
    >
      <div className="relative mx-auto flex h-16 max-w-lg items-center justify-around px-1 sm:px-2">
        {/* Главная + Каталог */}
        {navigation.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors sm:min-w-16 sm:flex-none sm:px-2 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon
                className="size-5"
                strokeWidth={active ? 2.3 : 1.8}
              />

              <span
                className={`text-[11px] ${
                  active ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>

              {active && (
                <span className="absolute bottom-0.5 h-0.5 w-5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}

        {/* Центральная корзина */}
        <Link
          href="/cart"
          aria-label={`Корзина, ${totalItems} товаров`}
          aria-current={cartActive ? "page" : undefined}
          className={`relative -mt-7 flex size-14 shrink-0 items-center justify-center rounded-full border-4 border-background text-primary-foreground shadow-lg transition-transform hover:scale-105 ${
            cartActive
              ? "bg-primary ring-2 ring-primary/25"
              : "bg-primary/90"
          }`}
        >
          <ShoppingCart
            className="size-6"
            strokeWidth={cartActive ? 2.3 : 1.8}
          />

          {totalItems > 0 && (
            <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-background text-[10px] font-bold text-primary ring-1 ring-border">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>

        {/* Избранное + Профиль */}
        {navigation.slice(2).map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`relative flex min-w-14 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 transition-colors sm:min-w-16 sm:flex-none sm:px-2 ${
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              <Icon
                className="size-5"
                strokeWidth={active ? 2.3 : 1.8}
              />

              <span
                className={`text-[11px] ${
                  active ? "font-semibold" : "font-medium"
                }`}
              >
                {item.label}
              </span>

              {active && (
                <span className="absolute bottom-0.5 h-0.5 w-5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}