"use client";

const MIN_PRICE = 0;
const MAX_PRICE = 10_000;
const STEP = 50;

type PriceFilterProps = {
  minPrice: number;
  maxPrice: number;
  onChange: (minPrice: number, maxPrice: number) => void;
};

const formatPrice = (value: number) => {
  return value.toLocaleString("ru-RU");
};

const parsePrice = (value: string) => {
  const digits = value.replace(/\D/g, "");

  if (!digits) {
    return 0;
  }

  return Number(digits);
};

export default function PriceFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceFilterProps) {
  const minPercent =
    ((minPrice - MIN_PRICE) /
      (MAX_PRICE - MIN_PRICE)) *
    100;

  const maxPercent =
    ((maxPrice - MIN_PRICE) /
      (MAX_PRICE - MIN_PRICE)) *
    100;

  const handleMinChange = (value: number) => {
    const nextValue = Math.min(
      value,
      maxPrice - STEP,
    );

    const safeValue = Math.max(
      MIN_PRICE,
      nextValue,
    );

    onChange(safeValue, maxPrice);
  };

  const handleMaxChange = (value: number) => {
    const nextValue = Math.max(
      value,
      minPrice + STEP,
    );

    const safeValue = Math.min(
      MAX_PRICE,
      nextValue,
    );

    onChange(minPrice, safeValue);
  };

  const handleMinInput = (value: string) => {
    const number = parsePrice(value);

    const nextValue = Math.min(
      Math.max(number, MIN_PRICE),
      maxPrice - STEP,
    );

    onChange(nextValue, maxPrice);
  };

  const handleMaxInput = (value: string) => {
    const number = parsePrice(value);

    const nextValue = Math.max(
      Math.min(number, MAX_PRICE),
      minPrice + STEP,
    );

    onChange(minPrice, nextValue);
  };

  return (
    <div className="border-b border-border pb-5">
      <div className="mb-4">
        <h3 className="px-3 text-sm font-semibold text-foreground">
          Цена
        </h3>

        <p className="mt-1 px-3 text-xs text-muted-foreground">
          Выберите подходящий диапазон
        </p>
      </div>

      <div className="flex items-center gap-1.5 px-3">
        <label className="flex h-10 min-w-0 flex-1 items-center rounded-xl border border-border bg-background px-2.5 transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
          <span className="mr-1 shrink-0 text-[11px] text-muted-foreground">
            от
          </span>

          <input
            type="text"
            inputMode="numeric"
            value={formatPrice(minPrice)}
            onChange={(event) =>
              handleMinInput(event.target.value)
            }
            className="min-w-0 w-full bg-transparent text-sm font-medium outline-none"
            aria-label="Минимальная цена"
          />

          <span className="ml-1 shrink-0 text-[11px] text-muted-foreground">
            ₽
          </span>
        </label>

        <span className="shrink-0 text-xs text-muted-foreground">
          —
        </span>

        <label className="flex h-10 min-w-0 flex-1 items-center rounded-xl border border-border bg-background px-2.5 transition focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/10">
          <span className="mr-1 shrink-0 text-[11px] text-muted-foreground">
            до
          </span>

          <input
            type="text"
            inputMode="numeric"
            value={formatPrice(maxPrice)}
            onChange={(event) =>
              handleMaxInput(event.target.value)
            }
            className="min-w-0 w-full bg-transparent text-sm font-medium outline-none"
            aria-label="Максимальная цена"
          />

          <span className="ml-1 shrink-0 text-[11px] text-muted-foreground">
            ₽
          </span>
        </label>
      </div>

      <div className="px-4 pt-5">
        <div className="relative h-6">
          <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-muted" />

          <div
            className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-primary"
            style={{
              left: `${minPercent}%`,
              right: `${100 - maxPercent}%`,
            }}
          />

          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={minPrice}
            onChange={(event) =>
              handleMinChange(
                Number(event.target.value),
              )
            }
            className="range-slider range-min"
            aria-label="Минимальная цена"
          />

          <input
            type="range"
            min={MIN_PRICE}
            max={MAX_PRICE}
            step={STEP}
            value={maxPrice}
            onChange={(event) =>
              handleMaxChange(
                Number(event.target.value),
              )
            }
            className="range-slider range-max"
            aria-label="Максимальная цена"
          />
        </div>
      </div>

      <div className="mt-1 flex justify-between px-4 text-[11px] text-muted-foreground">
        <span>0 ₽</span>
        <span>10 000 ₽</span>
      </div>

      <style jsx>{`
        .range-slider {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 24px;
          margin: 0;
          appearance: none;
          background: transparent;
          pointer-events: none;
        }

        .range-min {
          z-index: 20;
        }

        .range-max {
          z-index: 10;
        }

        .range-slider::-webkit-slider-runnable-track {
          height: 6px;
          background: transparent;
        }

        .range-slider::-moz-range-track {
          height: 6px;
          background: transparent;
        }

        .range-slider::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          margin-top: -6px;
          border: 3px solid white;
          border-radius: 9999px;
          background: var(--primary);
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
          cursor: grab;
          pointer-events: auto;
        }

        .range-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border: 3px solid white;
          border-radius: 9999px;
          background: var(--primary);
          box-shadow: 0 1px 5px rgba(0, 0, 0, 0.2);
          cursor: grab;
          pointer-events: auto;
        }

        .range-slider:active::-webkit-slider-thumb {
          cursor: grabbing;
        }

        .range-slider:active::-moz-range-thumb {
          cursor: grabbing;
        }

        .range-slider:focus-visible::-webkit-slider-thumb {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }

        .range-slider:focus-visible::-moz-range-thumb {
          outline: 2px solid var(--primary);
          outline-offset: 2px;
        }
      `}</style>
    </div>
  );
}