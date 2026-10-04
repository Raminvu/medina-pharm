import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type OrderItemInput = {
  id: number;
  count: number;
};

type CreateOrderRequest = {
  items: OrderItemInput[];
  deliveryMethod: "pickup" | "russian-post";
  form: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    postCity?: string;
    postIndex?: string;
    postAddress?: string;
    comment?: string;
  };
};

const DELIVERY_METHODS = {
  pickup: "PICKUP",
  "russian-post": "POST",
} as const;

function createOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random()
    .toString(36)
    .slice(2, 7)
    .toUpperCase();

  return `MP-${timestamp}-${random}`;
}

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderRequest;

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректные данные заказа.",
        },
        { status: 400 },
      );
    }

    if (
      !Array.isArray(body.items) ||
      body.items.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Корзина пуста.",
        },
        { status: 400 },
      );
    }

    if (
      body.items.length > 100 ||
      body.items.some(
        (item) =>
          !Number.isInteger(item?.id) ||
          !Number.isInteger(item?.count) ||
          item.count < 1 ||
          item.count > 100,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректные данные товаров.",
        },
        { status: 400 },
      );
    }

    if (
      !body.deliveryMethod ||
      !(body.deliveryMethod in DELIVERY_METHODS)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректный способ доставки.",
        },
        { status: 400 },
      );
    }

    const firstName = normalizeText(
      body.form?.firstName,
    );

    const lastName = normalizeText(
      body.form?.lastName,
    );

    const phone = normalizeText(body.form?.phone);
    const email = normalizeEmail(
      normalizeText(body.form?.email),
    );

    const postCity = normalizeText(
      body.form?.postCity,
    );

    const postIndex = normalizeText(
      body.form?.postIndex,
    );

    const postAddress = normalizeText(
      body.form?.postAddress,
    );

    const comment = normalizeText(
      body.form?.comment,
    );

    if (!firstName || firstName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректное имя.",
        },
        { status: 400 },
      );
    }

    if (!lastName || lastName.length > 100) {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректная фамилия.",
        },
        { status: 400 },
      );
    }

    const normalizedPhone = normalizePhone(phone);

    if (
      normalizedPhone.length < 10 ||
      normalizedPhone.length > 15
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректный номер телефона.",
        },
        { status: 400 },
      );
    }

    if (
      !email ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Некорректный email.",
        },
        { status: 400 },
      );
    }

    if (body.deliveryMethod === "russian-post") {
      if (!postCity || postCity.length > 150) {
        return NextResponse.json(
          {
            success: false,
            message: "Укажите город доставки.",
          },
          { status: 400 },
        );
      }

      if (!/^\d{6}$/.test(postIndex)) {
        return NextResponse.json(
          {
            success: false,
            message: "Некорректный почтовый индекс.",
          },
          { status: 400 },
        );
      }

      if (!postAddress || postAddress.length > 300) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Укажите адрес или номер отделения.",
          },
          { status: 400 },
        );
      }
    }

    if (comment.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message: "Комментарий слишком длинный.",
        },
        { status: 400 },
      );
    }

    const itemIds = body.items.map((item) => item.id);

    const uniqueItemIds = new Set(itemIds);

    if (uniqueItemIds.size !== itemIds.length) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Один и тот же товар указан несколько раз.",
        },
        { status: 400 },
      );
    }

    const order = await prisma.$transaction(
      async (tx) => {
        const products = await tx.product.findMany({
          where: {
            id: {
              in: itemIds,
            },
            isActive: true,
          },
          select: {
            id: true,
            name: true,
            brand: true,
            price: true,
            sku: true,
            stock: {
              select: {
                quantity: true,
                reserved: true,
              },
            },
          },
        });

        if (products.length !== itemIds.length) {
          throw new Error(
            "Один или несколько товаров недоступны.",
          );
        }

        const productsById = new Map(
          products.map((product) => [
            product.id,
            product,
          ]),
        );

        const orderItems = body.items.map((item) => {
          const product = productsById.get(item.id);

          if (!product) {
            throw new Error(
              "Товар не найден или недоступен.",
            );
          }

          if (!product.stock) {
            throw new Error(
              `Товар "${product.name}" отсутствует на складе.`,
            );
          }

          const availableStock =
            product.stock.quantity -
            product.stock.reserved;

          if (availableStock < item.count) {
            throw new Error(
              `Недостаточно товара "${product.name}". Доступно: ${availableStock} шт.`,
            );
          }

          const total = product.price * item.count;

          return {
            product,
            quantity: item.count,
            total,
          };
        });

        const subtotal = orderItems.reduce(
          (sum, item) => sum + item.total,
          0,
        );

        const totalItems = orderItems.reduce(
          (sum, item) => sum + item.quantity,
          0,
        );

        const deliveryPrice = 0;
        const discount = 0;
        const totalPrice =
          subtotal + deliveryPrice - discount;

        const customer = await tx.customer.findFirst({
          where: {
            phone: normalizedPhone,
          },
        });

        const savedCustomer = customer
          ? await tx.customer.update({
              where: {
                id: customer.id,
              },
              data: {
                firstName,
                lastName,
                email,
              },
            })
          : await tx.customer.create({
              data: {
                firstName,
                lastName,
                phone: normalizedPhone,
                email,
              },
            });

        const deliveryAddress =
          body.deliveryMethod === "russian-post"
            ? `${postCity}, индекс ${postIndex}, ${postAddress}`
            : null;

        const orderNumber = createOrderNumber();

        const createdOrder = await tx.order.create({
          data: {
            number: orderNumber,
            status: "AWAITING_PAYMENT",
            deliveryMethod:
              DELIVERY_METHODS[body.deliveryMethod],
            paymentMethod: "CARD",
            totalItems,
            subtotal,
            discount,
            deliveryPrice,
            totalPrice,
            customerId: savedCustomer.id,
            recipientName:
              `${firstName} ${lastName}`.trim(),
            recipientPhone: normalizedPhone,
            deliveryAddress,
            comment: comment || null,
            items: {
              create: orderItems.map((item) => ({
                productId: item.product.id,
                name: item.product.name,
                brand: item.product.brand,
                sku: item.product.sku,
                price: item.product.price,
                quantity: item.quantity,
                total: item.total,
              })),
            },
            payments: {
              create: {
                provider: "YOOKASSA",
                status: "PENDING",
                amount: totalPrice,
              },
            },
          },
          include: {
            items: true,
          },
        });

        for (const item of orderItems) {
          const updatedStock =
            await tx.productStock.updateMany({
              where: {
                productId: item.product.id,
                quantity: {
                  gte: item.quantity,
                },
              },
              data: {
                reserved: {
                  increment: item.quantity,
                },
              },
            });

          if (updatedStock.count !== 1) {
            throw new Error(
              `Не удалось зарезервировать товар "${item.product.name}". Попробуйте ещё раз.`,
            );
          }
        }

        return createdOrder;
      },
    );

    return NextResponse.json(
      {
        success: true,
        message: "Заказ успешно создан.",
        order: {
          id: order.id,
          number: order.number,
          status: order.status,
          deliveryMethod: order.deliveryMethod,
          totalItems: order.totalItems,
          subtotal: order.subtotal,
          deliveryPrice: order.deliveryPrice,
          totalPrice: order.totalPrice,
          items: order.items.map((item) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
          })),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "MEDINA PHARM — ОШИБКА СОЗДАНИЯ ЗАКАЗА:",
      error,
    );

    const message =
      error instanceof Error
        ? error.message
        : "Не удалось создать заказ.";

    const knownErrors = [
      "Один или несколько товаров недоступны.",
      "Товар не найден или недоступен.",
      "отсутствует на складе.",
      "Недостаточно товара",
      "Не удалось зарезервировать товар",
    ];

    const isClientError = knownErrors.some((text) =>
      message.includes(text),
    );

    return NextResponse.json(
      {
        success: false,
        message: isClientError
          ? message
          : "Не удалось создать заказ. Попробуйте ещё раз.",
      },
      {
        status: isClientError ? 400 : 500,
      },
    );
  }
}