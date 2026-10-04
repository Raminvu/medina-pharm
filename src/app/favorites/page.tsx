import { getCatalogProducts } from "@/lib/catalog/get-products";
import FavoritesContent from "@/components/favorites/favorites-content";

export default async function FavoritesPage() {
  const products = await getCatalogProducts();

  return <FavoritesContent products={products} />;
}