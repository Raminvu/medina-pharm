"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Flame,
  Heart,
  ShieldCheck,
  Sparkles,
  Truck,
  X,
} from "lucide-react";

import { useRouter } from "next/navigation";

import PriceFilter from "@/components/catalog/price-filter";
import ProductCard from "@/components/product/product-card";
import PromoSlider from "@/components/promo/promo-slider";

type CatalogProduct = {
  id: number;
  slug: string;
  brand: string;
  name: string;
  description: string;
  price: number;
  oldPrice?: number;
  image: string;
  badge: "Хит" | "Новинка" | "Популярное" | "";
  rating: number;
  reviews: number;
  quantity: string;
  category: string;
  stock: number;
};

const categories = [
  "Магний",
  "Цинк",
  "Железо",
  "Кальций",
  "Витамин D",
  "Витамин C",
  "Омега-3",
  "Витамины группы B",
  "Фолиевая кислота",
  "Мультивитамины",
];

const navigation = [
  {
    title: "Новинки",
    filter: "new",
    icon: Sparkles,
  },
  {
    title: "Популярные",
    filter: "popular",
    icon: Flame,
  },
  {
    title: "Акции",
    filter: "sale",
    icon: Sparkles,
  },
] as const;

const mainCategories = [
  "Витамины",
  "БАДы",
  "Минералы",
  "Иммунитет",
  "Красота",
  "Спорт",
  "Для детей",
];

const MIN_PRICE = 0;
const MAX_PRICE = 10_000;

type NavigationFilter =
  | "all"
  | "new"
  | "popular"
  | "sale";

type SortOption =
  | "popular"
  | "price-asc"
  | "price-desc"
  | "new";

type CatalogClientProps = {
  products: CatalogProduct[];
};

export default function CatalogClient({
  products,
}: CatalogClientProps) {
  const router = useRouter();

  const [navigationFilter, setNavigationFilter] =
    useState<NavigationFilter>("all");

  const [search, setSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const [selectedMainCategories, setSelectedMainCategories] =
    useState<string[]>([]);

  const [selectedTags, setSelectedTags] =
    useState<string[]>([]);

  const [minPrice, setMinPrice] =
    useState(MIN_PRICE);

  const [maxPrice, setMaxPrice] =
    useState(MAX_PRICE);

  const [sort, setSort] =
    useState<SortOption>("popular");

  const [mobileFiltersOpen, setMobileFiltersOpen] =
    useState(false);

  const [mobileCategoriesOpen, setMobileCategoriesOpen] =
    useState(false);

  const [showAllCategories, setShowAllCategories] =
    useState(false);

  /*
   * ============================================================
   * ЧТЕНИЕ FILTER ИЗ URL
   * ============================================================
   */

  useEffect(() => {
    const readFilterFromUrl = () => {
      const params = new URLSearchParams(
        window.location.search,
      );

      const filter = params.get("filter");

      if (
        filter === "new" ||
        filter === "popular" ||
        filter === "sale"
      ) {
        setNavigationFilter(filter);
      } else {
        setNavigationFilter("all");
      }
    };

    readFilterFromUrl();

    window.addEventListener(
      "popstate",
      readFilterFromUrl,
    );

    return () => {
      window.removeEventListener(
        "popstate",
        readFilterFromUrl,
      );
    };
  }, []);

  /*
   * ============================================================
   * LOCK BODY SCROLL
   * ============================================================
   */

  useEffect(() => {
    const drawerOpen =
      mobileFiltersOpen || mobileCategoriesOpen;

    document.body.style.overflow = drawerOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [
    mobileFiltersOpen,
    mobileCategoriesOpen,
  ]);

  /*
   * ============================================================
   * ОСНОВНЫЕ КАТЕГОРИИ
   * ============================================================
   */

  const toggleMainCategory = (
    category: string,
  ) => {
    setSelectedMainCategories((current) =>
      current.includes(category)
        ? current.filter(
            (item) => item !== category,
          )
        : [...current, category],
    );
  };

  /*
   * ============================================================
   * ДОПОЛНИТЕЛЬНЫЕ КАТЕГОРИИ
   * ============================================================
   */

  const toggleTag = (tag: string) => {
    setSelectedTags((current) =>
      current.includes(tag)
        ? current.filter(
            (item) => item !== tag,
          )
        : [...current, tag],
    );
  };

  /*
   * ============================================================
   * ПОИСК КАТЕГОРИЙ
   * ============================================================
   */

  const filteredCategoryList =
    categories.filter((category) =>
      category
        .toLowerCase()
        .includes(
          categorySearch.toLowerCase(),
        ),
    );

  const visibleCategories = showAllCategories
    ? filteredCategoryList
    : filteredCategoryList.slice(0, 7);

  /*
   * ============================================================
   * ФИЛЬТРАЦИЯ ТОВАРОВ
   * ============================================================
   */

  const filteredProducts = useMemo(() => {
    let result = [...products];

    /*
     * ========================================================
     * НОВИНКИ / ПОПУЛЯРНЫЕ / АКЦИИ
     * ========================================================
     */

    switch (navigationFilter) {
      case "new":
        result = result.filter(
          (product) =>
            product.badge === "Новинка",
        );
        break;

      case "popular":
        result = result.filter(
          (product) =>
            product.badge === "Популярное" ||
            product.badge === "Хит" ||
            product.rating >= 4.5 ||
            product.reviews >= 50,
        );
        break;

      case "sale":
        result = result.filter(
          (product) =>
            product.oldPrice !== undefined &&
            product.oldPrice > product.price,
        );
        break;

      case "all":
      default:
        break;
    }

    /*
     * ========================================================
     * ПОИСК
     * ========================================================
     */

    const normalizedSearch =
      search.trim().toLowerCase();

    if (normalizedSearch) {
      result = result.filter((product) => {
        const searchableText = [
          product.brand,
          product.name,
          product.description,
          product.category,
          product.quantity,
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(
          normalizedSearch,
        );
      });
    }

    /*
     * ========================================================
     * ОСНОВНЫЕ КАТЕГОРИИ
     * ========================================================
     */

    if (
      selectedMainCategories.length > 0
    ) {
      result = result.filter((product) =>
        selectedMainCategories.includes(
          product.category,
        ),
      );
    }

    /*
     * ========================================================
     * ВИТАМИНЫ / МИНЕРАЛЫ
     *
     * У товаров из БД пока нет отдельного массива tags,
     * поэтому проверяем название, описание, бренд,
     * категорию и количество.
     * ========================================================
     */

    if (selectedTags.length > 0) {
      result = result.filter((product) => {
        const searchableText = [
          product.brand,
          product.name,
          product.description,
          product.category,
          product.quantity,
        ]
          .join(" ")
          .toLowerCase();

        return selectedTags.some((tag) =>
          searchableText.includes(
            tag.toLowerCase(),
          ),
        );
      });
    }

    /*
     * ========================================================
     * ЦЕНА
     * ========================================================
     */

    result = result.filter(
      (product) =>
        product.price >= minPrice &&
        product.price <= maxPrice,
    );

    /*
     * ========================================================
     * СОРТИРОВКА
     * ========================================================
     */

    switch (sort) {
      case "price-asc":
        result.sort(
          (a, b) => a.price - b.price,
        );
        break;

      case "price-desc":
        result.sort(
          (a, b) => b.price - a.price,
        );
        break;

      case "new":
        result.sort(
          (a, b) => b.id - a.id,
        );
        break;

      case "popular":
      default:
        result.sort((a, b) => {
          const ratingDifference =
            b.rating - a.rating;

          if (ratingDifference !== 0) {
            return ratingDifference;
          }

          return b.reviews - a.reviews;
        });

        break;
    }

    return result;
  }, [
    products,
    navigationFilter,
    search,
    selectedMainCategories,
    selectedTags,
    minPrice,
    maxPrice,
    sort,
  ]);

  /*
   * ============================================================
   * АКТИВЕН ФИЛЬТР ЦЕНЫ
   * ============================================================
   */

  const isPriceFilterActive =
    minPrice > MIN_PRICE ||
    maxPrice < MAX_PRICE;

  /*
   * ============================================================
   * КОЛИЧЕСТВО ФИЛЬТРОВ
   * ============================================================
   */

  const activeFilterCount =
    selectedMainCategories.length +
    selectedTags.length +
    (isPriceFilterActive ? 1 : 0);

  /*
   * ============================================================
   * НАЗВАНИЕ ТЕКУЩЕГО РАЗДЕЛА
   * ============================================================
   */

  const currentNavigationTitle =
    navigationFilter === "new"
      ? "Новинки"
      : navigationFilter === "popular"
        ? "Популярные товары"
        : navigationFilter === "sale"
          ? "Акции"
          : "Все товары";

  /*
   * ============================================================
   * PRICE
   * ============================================================
   */

  const handlePriceChange = (
    nextMinPrice: number,
    nextMaxPrice: number,
  ) => {
    setMinPrice(nextMinPrice);
    setMaxPrice(nextMaxPrice);
  };

  /*
   * ============================================================
   * СБРОС
   * ============================================================
   */

  const clearFilters = () => {
    setNavigationFilter("all");
    setSelectedMainCategories([]);
    setSelectedTags([]);
    setSearch("");
    setCategorySearch("");
    setMinPrice(MIN_PRICE);
    setMaxPrice(MAX_PRICE);
    setSort("popular");

    router.replace("/catalog");
  };

  /*
   * ============================================================
   * РЕНДЕР
   * ============================================================
   */

  return (
    <main className="bg-background">
      {/* =========================================================
          HERO SLIDER
      ========================================================== */}

      <PromoSlider />

      {/* =========================================================
          CATALOG
      ========================================================== */}

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <div className="grid gap-8 lg:grid-cols-[250px_minmax(0,1fr)]">
          {/* =====================================================
              DESKTOP SIDEBAR
          ====================================================== */}

          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <div className="mb-5">
                <p className="text-sm font-medium text-primary">
                  Каталог
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-tight">
                  Категории
                </h2>
              </div>

              {/* ОСНОВНАЯ НАВИГАЦИЯ */}

              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;

                  const active =
                    navigationFilter ===
                    item.filter;

                  return (
                    <Link
                      key={item.title}
                      href={`/catalog?filter=${item.filter}`}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                      }`}
                    >
                      <Icon className="size-4" />

                      {item.title}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-5 h-px bg-border" />

              {/* ОСНОВНЫЕ КАТЕГОРИИ */}

              <div>
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Разделы
                </p>

                <div className="space-y-1">
                  {mainCategories.map(
                    (category) => {
                      const checked =
                        selectedMainCategories.includes(
                          category,
                        );

                      return (
                        <label
                          key={category}
                          className="group flex cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition hover:bg-primary/5"
                        >
                          <input
                            type="checkbox"
                            value={category}
                            name="main-category"
                            checked={checked}
                            onChange={() =>
                              toggleMainCategory(
                                category,
                              )
                            }
                            className="peer sr-only"
                          />

                          <span
                            className={`flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-all ${
                              checked
                                ? "border-primary bg-primary"
                                : "border-border bg-background"
                            }`}
                          >
                            <Check
                              className={`size-3 text-white transition-transform ${
                                checked
                                  ? "scale-100"
                                  : "scale-0"
                              }`}
                            />
                          </span>

                          <span className="text-foreground transition-colors group-hover:text-primary">
                            {category}
                          </span>
                        </label>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="my-5 h-px bg-border" />

              {/* ЦЕНА */}

              <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                onChange={handlePriceChange}
              />

              <div className="my-5 h-px bg-border" />

              {/* ВИТАМИНЫ И МИНЕРАЛЫ */}

              <div>
                <p className="mb-3 px-3 text-sm font-semibold">
                  Витамины и минералы
                </p>

                <div className="relative mb-3">
                  <input
                    type="search"
                    value={categorySearch}
                    onChange={(event) =>
                      setCategorySearch(
                        event.target.value,
                      )
                    }
                    placeholder="Найти витамин..."
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
                  />
                </div>

                <div className="space-y-1">
                  {visibleCategories.map(
                    (category) => {
                      const checked =
                        selectedTags.includes(
                          category,
                        );

                      return (
                        <button
                          key={category}
                          type="button"
                          onClick={() =>
                            toggleTag(category)
                          }
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition ${
                            checked
                              ? "bg-primary/10 font-medium text-primary"
                              : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
                          }`}
                        >
                          <span>
                            {category}
                          </span>

                          {checked && (
                            <Check className="size-4" />
                          )}
                        </button>
                      );
                    },
                  )}
                </div>

                {filteredCategoryList.length >
                  7 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllCategories(
                        (current) =>
                          !current,
                      )
                    }
                    className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition hover:bg-primary/5"
                  >
                    {showAllCategories
                      ? "Скрыть"
                      : "Показать ещё"}

                    <ChevronDown
                      className={`size-4 transition-transform ${
                        showAllCategories
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>
                )}
              </div>

              {(activeFilterCount > 0 ||
                navigationFilter !== "all") && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 w-full rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition hover:border-primary/20 hover:bg-primary/5 hover:text-primary"
                >
                  Сбросить фильтры
                </button>
              )}
            </div>
          </aside>

          {/* =====================================================
              PRODUCTS AREA
          ====================================================== */}

          <div className="min-w-0">
            {/* ЗАГОЛОВОК + СОРТИРОВКА */}

            <div className="flex flex-col gap-4 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-medium text-primary">
                  Витамины и БАДы
                </p>

                <h2 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
                  {currentNavigationTitle}
                </h2>
              </div>

              {/* СОРТИРОВКА */}

              <div className="flex items-center justify-end gap-3">
                <span className="hidden shrink-0 text-sm text-muted-foreground sm:inline">
                  Сортировка:
                </span>

                <div className="relative">
                  <select
                    value={sort}
                    onChange={(event) =>
                      setSort(
                        event.target
                          .value as SortOption,
                      )
                    }
                    className="h-12 w-[210px] appearance-none rounded-full border border-border bg-background px-5 pr-11 text-sm font-medium text-foreground outline-none transition-all hover:border-primary/20 focus:border-primary/30 focus:ring-4 focus:ring-primary/10"
                    aria-label="Сортировка товаров"
                  >
                    <option value="popular">
                      По популярности
                    </option>

                    <option value="price-asc">
                      Сначала дешевле
                    </option>

                    <option value="price-desc">
                      Сначала дороже
                    </option>

                    <option value="new">
                      Сначала новые
                    </option>
                  </select>

                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-foreground"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>

            {/* =================================================
                MOBILE FILTER BUTTONS
            ================================================== */}

            <div className="flex gap-2 py-4 lg:hidden">
              <button
                type="button"
                onClick={() =>
                  setMobileCategoriesOpen(true)
                }
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium transition hover:border-primary/30 hover:bg-primary/5"
              >
                Категории

                {selectedMainCategories.length >
                  0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {
                      selectedMainCategories.length
                    }
                  </span>
                )}

                <ChevronDown className="size-4" />
              </button>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(true)
                }
                className="flex h-10 flex-1 items-center justify-center gap-2 rounded-xl border border-border text-sm font-medium transition hover:border-primary/30 hover:bg-primary/5"
              >
                Фильтры

                {activeFilterCount > 0 && (
                  <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {activeFilterCount}
                  </span>
                )}

                <ChevronDown className="size-4" />
              </button>
            </div>

            {/* =================================================
                ACTIVE FILTERS
            ================================================== */}

            {(activeFilterCount > 0 ||
              navigationFilter !== "all") && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                {navigationFilter !==
                  "all" && (
                  <button
                    type="button"
                    onClick={() => {
                      setNavigationFilter(
                        "all",
                      );

                      router.replace(
                        "/catalog",
                      );
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                  >
                    {currentNavigationTitle}

                    <X className="size-3.5" />
                  </button>
                )}

                {selectedMainCategories.map(
                  (category) => (
                    <button
                      key={`main-${category}`}
                      type="button"
                      onClick={() =>
                        toggleMainCategory(
                          category,
                        )
                      }
                      className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                    >
                      {category}

                      <X className="size-3.5" />
                    </button>
                  ),
                )}

                {selectedTags.map((tag) => (
                  <button
                    key={`tag-${tag}`}
                    type="button"
                    onClick={() =>
                      toggleTag(tag)
                    }
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                  >
                    {tag}

                    <X className="size-3.5" />
                  </button>
                ))}

                {isPriceFilterActive && (
                  <button
                    type="button"
                    onClick={() => {
                      setMinPrice(
                        MIN_PRICE,
                      );
                      setMaxPrice(
                        MAX_PRICE,
                      );
                    }}
                    className="flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary transition hover:bg-primary/15"
                  >
                    {minPrice.toLocaleString(
                      "ru-RU",
                    )}{" "}
                    ₽ —{" "}
                    {maxPrice.toLocaleString(
                      "ru-RU",
                    )}{" "}
                    ₽

                    <X className="size-3.5" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-2 py-1.5 text-xs font-medium text-muted-foreground hover:text-primary"
                >
                  Сбросить
                </button>
              </div>
            )}

            {/* =================================================
                PRODUCT GRID
            ================================================== */}

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
                {filteredProducts.map(
                  (product) => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      slug={product.slug}
                      brand={product.brand}
                      name={product.name}
                      description={
                        product.description
                      }
                      price={product.price}
                      oldPrice={
                        product.oldPrice
                      }
                      image={product.image}
                      badge={product.badge}
                      rating={product.rating}
                      reviews={product.reviews}
                      quantity={
                        product.quantity
                      }
                    />
                  ),
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-border px-6 py-16 text-center">
                <h3 className="text-lg font-semibold">
                  Товары не найдены
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
                  Попробуйте изменить
                  выбранные категории,
                  диапазон цены или убрать
                  фильтры.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  Сбросить фильтры
                </button>
              </div>
            )}

            {/* =================================================
                ПРЕИМУЩЕСТВА
            ================================================== */}

            <div className="mt-10 grid gap-3 border-t border-border pt-8 sm:grid-cols-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Надёжный выбор
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Проверенные товары
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Truck className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Быстрая доставка
                  </p>

                  <p className="text-xs text-muted-foreground">
                    До двери
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Heart className="size-5" />
                </div>

                <div>
                  <p className="text-sm font-semibold">
                    Для всей семьи
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Забота каждый день
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          MOBILE CATEGORIES DRAWER
      ========================================================== */}

      {mobileCategoriesOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Закрыть категории"
            onClick={() =>
              setMobileCategoriesOpen(false)
            }
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Категории
                </h3>

                <p className="text-xs text-muted-foreground">
                  Выберите нужные категории
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileCategoriesOpen(
                    false,
                  )
                }
                aria-label="Закрыть"
                className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[calc(85vh-75px)] overflow-y-auto px-5 py-5">
              <div className="space-y-1">
                {mainCategories.map(
                  (category) => {
                    const checked =
                      selectedMainCategories.includes(
                        category,
                      );

                    return (
                      <label
                        key={category}
                        className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-primary/5"
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleMainCategory(
                              category,
                            )
                          }
                          className="peer sr-only"
                        />

                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-md border transition ${
                            checked
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          <Check
                            className={`size-3.5 text-white ${
                              checked
                                ? "scale-100"
                                : "scale-0"
                            }`}
                          />
                        </span>

                        <span className="text-sm font-medium">
                          {category}
                        </span>
                      </label>
                    );
                  },
                )}
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileCategoriesOpen(
                    false,
                  )
                }
                className="mt-5 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Показать товары
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          MOBILE FILTER DRAWER
      ========================================================== */}

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <button
            type="button"
            aria-label="Закрыть фильтры"
            onClick={() =>
              setMobileFiltersOpen(false)
            }
            className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"
          />

          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Фильтры
                </h3>

                <p className="text-xs text-muted-foreground">
                  Настройте параметры товаров
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setMobileFiltersOpen(false)
                }
                aria-label="Закрыть"
                className="flex size-10 items-center justify-center rounded-xl text-muted-foreground transition hover:bg-muted hover:text-foreground"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="max-h-[calc(85vh-75px)] overflow-y-auto px-5 py-5">
              <div>
                <p className="mb-3 text-sm font-semibold">
                  Категории
                </p>

                <div className="space-y-1">
                  {mainCategories.map(
                    (category) => {
                      const checked =
                        selectedMainCategories.includes(
                          category,
                        );

                      return (
                        <label
                          key={category}
                          className="flex cursor-pointer items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-primary/5"
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() =>
                              toggleMainCategory(
                                category,
                              )
                            }
                            className="peer sr-only"
                          />

                          <span
                            className={`flex size-5 shrink-0 items-center justify-center rounded-md border ${
                              checked
                                ? "border-primary bg-primary"
                                : "border-border"
                            }`}
                          >
                            <Check
                              className={`size-3.5 text-white ${
                                checked
                                  ? "scale-100"
                                  : "scale-0"
                              }`}
                            />
                          </span>

                          <span className="text-sm font-medium">
                            {category}
                          </span>
                        </label>
                      );
                    },
                  )}
                </div>
              </div>

              <div className="my-5 h-px bg-border" />

              {/* ЦЕНА */}

              <PriceFilter
                minPrice={minPrice}
                maxPrice={maxPrice}
                onChange={handlePriceChange}
              />

              <div className="my-5 h-px bg-border" />

              {/* СОРТИРОВКА */}

              <p className="mb-3 text-sm font-semibold">
                Сортировка
              </p>

              <div className="space-y-2">
                {[
                  {
                    value: "popular",
                    label: "По популярности",
                  },
                  {
                    value: "price-asc",
                    label: "Сначала дешевле",
                  },
                  {
                    value: "price-desc",
                    label: "Сначала дороже",
                  },
                  {
                    value: "new",
                    label: "Сначала новые",
                  },
                ].map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() =>
                      setSort(
                        option.value as SortOption,
                      )
                    }
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-sm transition ${
                      sort === option.value
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border"
                    }`}
                  >
                    <span>
                      {option.label}
                    </span>

                    {sort === option.value && (
                      <Check className="size-4" />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="flex-1 rounded-xl border border-border px-4 py-3 text-sm font-medium transition hover:bg-muted"
                >
                  Сбросить
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setMobileFiltersOpen(
                      false,
                    )
                  }
                  className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Показать товары
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}