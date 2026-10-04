"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  Check,
  MapPin,
  ShoppingBag,
  Truck,
} from "lucide-react";

import { useCartStore } from "@/store/cart-store";

type DeliveryMethod = "pickup" | "russian-post";

type FormData = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  postCity: string;
  postIndex: string;
  postAddress: string;
  comment: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const deliveryMethods: {
  id: DeliveryMethod;
  title: string;
  description: string;
}[] = [
  {
    id: "pickup",
    title: "Самовывоз",
    description: "Забрать заказ самостоятельно",
  },
  {
    id: "russian-post",
    title: "Почта России",
    description: "Доставка в отделение или по адресу",
  },
];

const initialForm: FormData = {
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  postCity: "",
  postIndex: "",
  postAddress: "",
  comment: "",
};

export default function CheckoutPage() {
  const items = useCartStore((state) => state.items);

  const [deliveryMethod, setDeliveryMethod] =
    useState<DeliveryMethod>("pickup");

  const [form, setForm] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdOrderNumber, setCreatedOrderNumber] = useState<string | null>(
    null,
  );

  const totalItems = items.reduce(
    (sum, item) => sum + item.count,
    0,
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.count,
    0,
  );

  const updateField = (
    field: keyof FormData,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });

    setSubmitted(false);
    setCreatedOrderNumber(null);
  };

  const changeDeliveryMethod = (
    method: DeliveryMethod,
  ) => {
    setDeliveryMethod(method);
    setErrors({});
    setSubmitted(false);
    setCreatedOrderNumber(null);
  };

  const validateForm = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!form.firstName.trim()) {
      nextErrors.firstName = "Введите имя";
    }

    if (!form.lastName.trim()) {
      nextErrors.lastName = "Введите фамилию";
    }

    if (!form.phone.trim()) {
      nextErrors.phone = "Введите номер телефона";
    } else if (
      form.phone.replace(/\D/g, "").length < 10
    ) {
      nextErrors.phone = "Введите корректный номер телефона";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Введите email";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        form.email.trim(),
      )
    ) {
      nextErrors.email = "Введите корректный email";
    }

    if (deliveryMethod === "russian-post") {
      if (!form.postCity.trim()) {
        nextErrors.postCity = "Введите город";
      }

      if (!form.postIndex.trim()) {
        nextErrors.postIndex = "Введите почтовый индекс";
      } else if (!/^\d{6}$/.test(form.postIndex.trim())) {
        nextErrors.postIndex =
          "Индекс должен содержать 6 цифр";
      }

      if (!form.postAddress.trim()) {
        nextErrors.postAddress =
          "Введите адрес или номер отделения";
      }
    }

    return nextErrors;
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setSubmitted(false);

      requestAnimationFrame(() => {
        const firstInvalidField =
          document.querySelector(
            '[aria-invalid="true"]',
          ) as HTMLElement | null;

        firstInvalidField?.focus();
      });

      return;
    }

    if (items.length === 0) {
      setErrors({
        firstName:
          "Корзина пуста. Добавьте товары перед оформлением заказа.",
      });

      return;
    }

    setErrors({});
    setSubmitted(false);
    setCreatedOrderNumber(null);
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            count: item.count,
          })),
          deliveryMethod,
          form: {
            firstName: form.firstName.trim(),
            lastName: form.lastName.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
            postCity:
              deliveryMethod === "russian-post"
                ? form.postCity.trim()
                : "",
            postIndex:
              deliveryMethod === "russian-post"
                ? form.postIndex.trim()
                : "",
            postAddress:
              deliveryMethod === "russian-post"
                ? form.postAddress.trim()
                : "",
            comment: form.comment.trim(),
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Не удалось создать заказ.",
        );
      }

      console.log(
        "MEDINA PHARM — ЗАКАЗ СОЗДАН:",
        data.order,
      );

      setCreatedOrderNumber(
        data.order?.number ?? null,
      );
      setSubmitted(true);
    } catch (error) {
      console.error(
        "MEDINA PHARM — ОШИБКА СОЗДАНИЯ ЗАКАЗА:",
        error,
      );

      setErrors({
        firstName:
          error instanceof Error
            ? error.message
            : "Не удалось создать заказ. Попробуйте ещё раз.",
      });

      setSubmitted(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <main className="min-h-[70vh] bg-background">
        <section className="mx-auto flex max-w-[900px] flex-col items-center px-4 py-16 text-center sm:px-6 lg:py-24">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShoppingBag className="size-9" />
          </div>

          <h1 className="mt-6 text-2xl font-bold tracking-tight sm:text-3xl">
            Корзина пуста
          </h1>

          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Добавьте товары в корзину перед оформлением
            заказа.
          </p>

          <Link
            href="/catalog"
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
      <section className="mx-auto w-full max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-8">
          <p className="text-sm font-medium text-primary">
            Medina Pharm
          </p>

          <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
            Оформление заказа
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            Заполните данные для оформления заказа
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]"
        >
          <div className="space-y-6">
            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShoppingBag className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Данные покупателя
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Укажите ваши контактные данные
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <FormInput
                  label="Имя"
                  value={form.firstName}
                  onChange={(value) =>
                    updateField("firstName", value)
                  }
                  error={errors.firstName}
                  placeholder="Введите имя"
                />

                <FormInput
                  label="Фамилия"
                  value={form.lastName}
                  onChange={(value) =>
                    updateField("lastName", value)
                  }
                  error={errors.lastName}
                  placeholder="Введите фамилию"
                />

                <FormInput
                  label="Телефон"
                  type="tel"
                  value={form.phone}
                  onChange={(value) =>
                    updateField("phone", value)
                  }
                  error={errors.phone}
                  placeholder="+7 900 000-00-00"
                />

                <FormInput
                  label="Email"
                  type="email"
                  value={form.email}
                  onChange={(value) =>
                    updateField("email", value)
                  }
                  error={errors.email}
                  placeholder="example@mail.ru"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Truck className="size-5" />
                </div>

                <div>
                  <h2 className="text-lg font-semibold">
                    Способ доставки
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Выберите удобный способ получения
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                {deliveryMethods.map((method) => {
                  const active =
                    deliveryMethod === method.id;

                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() =>
                        changeDeliveryMethod(method.id)
                      }
                      className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition ${
                        active
                          ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                          : "border-border hover:border-primary/30 hover:bg-muted/30"
                      }`}
                    >
                      <span
                        className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? "border-primary bg-primary"
                            : "border-muted-foreground/40"
                        }`}
                      >
                        {active && (
                          <Check className="size-3.5 text-primary-foreground" />
                        )}
                      </span>

                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-semibold">
                          {method.title}
                        </span>

                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {method.description}
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-5">
                {deliveryMethod === "pickup" && (
                  <div className="rounded-xl bg-primary/5 p-4">
                    <div className="flex gap-3">
                      <MapPin className="mt-0.5 size-5 shrink-0 text-primary" />

                      <div>
                        <p className="text-sm font-semibold">
                          Самовывоз из Medina Pharm
                        </p>

                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          После оформления заказа мы
                          свяжемся с вами и сообщим
                          адрес и время, когда заказ
                          можно будет забрать.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {deliveryMethod === "russian-post" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormInput
                      label="Город"
                      value={form.postCity}
                      onChange={(value) =>
                        updateField("postCity", value)
                      }
                      error={errors.postCity}
                      placeholder="Например, Москва"
                    />

                    <FormInput
                      label="Почтовый индекс"
                      value={form.postIndex}
                      onChange={(value) =>
                        updateField(
                          "postIndex",
                          value
                            .replace(/\D/g, "")
                            .slice(0, 6),
                        )
                      }
                      error={errors.postIndex}
                      placeholder="123456"
                      inputMode="numeric"
                    />

                    <div className="sm:col-span-2">
                      <FormInput
                        label="Адрес или номер отделения"
                        value={form.postAddress}
                        onChange={(value) =>
                          updateField(
                            "postAddress",
                            value,
                          )
                        }
                        error={errors.postAddress}
                        placeholder="Улица, дом, квартира или № отделения"
                      />
                    </div>
                  </div>
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-card p-5 sm:p-6">
              <h2 className="text-lg font-semibold">
                Комментарий к заказу
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Необязательно
              </p>

              <textarea
                value={form.comment}
                onChange={(event) =>
                  updateField(
                    "comment",
                    event.target.value,
                  )
                }
                placeholder="Дополнительная информация к заказу..."
                rows={4}
                className="mt-4 w-full resize-none rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-4 focus:ring-primary/10"
              />
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold">
              Ваш заказ
            </h2>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3"
                >
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-[#f7faf7]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="64px"
                      className="object-contain p-1.5"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold leading-tight">
                      {item.name}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.count} ×{" "}
                      {item.price.toLocaleString("ru-RU")} ₽
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold">
                    {(
                      item.price * item.count
                    ).toLocaleString("ru-RU")}{" "}
                    ₽
                  </p>
                </div>
              ))}
            </div>

            <div className="my-5 h-px bg-border" />

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4">
                <span className="text-muted-foreground">
                  Товары
                </span>

                <span className="font-medium">
                  {totalItems} шт.
                </span>
              </div>

              <div className="flex items-start justify-between gap-4">
                <span className="text-muted-foreground">
                  Доставка
                </span>

                <span className="text-right text-sm font-medium">
                  {deliveryMethod === "pickup"
                    ? "Бесплатно"
                    : "Рассчитаем"}
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

            {submitted && (
              <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4 text-green-800">
                <div className="flex gap-3">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-green-600 text-white">
                    <Check className="size-4" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">
                      Заказ создан
                    </p>

                    {createdOrderNumber && (
                      <p className="mt-1 text-xs font-medium">
                        Номер заказа:{" "}
                        {createdOrderNumber}
                      </p>
                    )}

                    <p className="mt-1 text-xs leading-relaxed text-green-700">
                      Заказ успешно сохранён.
                      Оплату через ЮKassa подключим
                      следующим этапом.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || submitted}
              className="mt-5 w-full rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? "Создаём заказ..."
                : submitted
                  ? "Заказ создан"
                  : "Оформить заказ"}
            </button>

            <Link
              href="/cart"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-medium transition hover:bg-muted"
            >
              <ArrowLeft className="size-4" />
              Вернуться в корзину
            </Link>

            <div className="mt-5 rounded-xl bg-muted/40 p-3">
              <p className="text-xs leading-relaxed text-muted-foreground">
                После создания заказа данные будут
                сохранены на сервере. Данные банковской
                карты не хранятся на сайте Medina Pharm.
              </p>
            </div>
          </aside>
        </form>
      </section>
    </main>
  );
}

function FormInput({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
}) {
  const inputId = label
    .toLowerCase()
    .replace(/\s+/g, "-");

  return (
    <div>
      <label
        htmlFor={inputId}
        className="mb-2 block text-sm font-medium"
      >
        {label}
      </label>

      <input
        id={inputId}
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        placeholder={placeholder}
        inputMode={inputMode}
        aria-invalid={Boolean(error)}
        aria-describedby={
          error ? `${inputId}-error` : undefined
        }
        className={`h-11 w-full rounded-xl border bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground focus:ring-4 ${
          error
            ? "border-destructive focus:border-destructive focus:ring-destructive/10"
            : "border-border focus:border-primary/40 focus:ring-primary/10"
        }`}
      />

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1.5 text-xs text-destructive"
        >
          {error}
        </p>
      )}
    </div>
  );
}