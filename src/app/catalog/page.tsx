import { getCatalogProducts } from "@/lib/catalog/get-products";

import CatalogClient from "./catalog-client";

export default async function CatalogPage() {
  const products = await getCatalogProducts();

  return <CatalogClient products={products} />;
}