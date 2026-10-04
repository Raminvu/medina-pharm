import { NextResponse } from "next/server";

import { products } from "@/data/products";

type OrderItemInput = {
  id: number;
  count: number;
};

type CreateOrderRequest = {
  items: OrderItemInput[];
  deliveryMethod: string;
  form: Record<string, string>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as CreateOrderRequest;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Корзина пуста.",
        },
        { status: 400 },
      );
    }

    if (!body.deliveryMethod) {
      return NextResponse.json(
        {
          success: false,
          message: "Не выбран способ доставки.",
        },
        { status: 400 },
      );
    }

    const orderItems = [];

    for (const item of body.items) {
      const product = products.find((product) => product.id === item.id);

      if (!product) {
        return NextResponse.json(
          {
            success: false,
            message: `Товар с ID ${item.id} не найден.`,
          },
          { status: 400 },
        );
      }

      if (!Number.isInteger(item.count) || item.count < 1) {
        return NextResponse.json(
          {
            success: false,
            message: `Некорректное количество товара "${product.name}".`,
          },
          { status: 400 },
        );
      }

      orderItems.push({
        id: product.id,
        slug: product.slug,
        name: product.name,
        brand: product.brand,
        price: product.price,
        quantity: item.count,
        total: product.price * item.count,
      });
    }

    const totalItems = orderItems.reduce(
      (sum, item) => sum + item.quantity,
      0,
    );

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.total,
      0,
    );

    const order = {
      id: `MP-${Date.now()}`,
      status: "pending",
      items: orderItems,
      totalItems,
      totalPrice,
      deliveryMethod: body.deliveryMethod,
      customer: body.form ?? {},
      createdAt: new Date().toISOString(),
    };

    console.log("MEDINA PHARM — НОВЫЙ ЗАКАЗ");
    console.log(order);

    return NextResponse.json(
      {
        success: true,
        message: "Заказ успешно создан.",
        order,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Ошибка создания заказа:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Не удалось создать заказ.",
      },
      { status: 500 },
    );
  }
}