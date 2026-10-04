import HomeCatalog from "@/components/home/home-catalog";
import { getCatalogProducts } from "@/lib/catalog/get-products";

export default async function HomePage() {
  const products = await getCatalogProducts();

  return <HomeCatalog products={products} />;
}
