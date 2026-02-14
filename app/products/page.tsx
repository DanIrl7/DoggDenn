import ProductsClient from '../components/ProductsClient';
import prisma from '@/lib/prisma';

export const revalidate = 60; // Revalidate every 60 seconds

export default async function ProductsPage() {
  // Fetch data server-side
  const [categories, products] = await Promise.all([
    prisma.category.findMany(),
    prisma.product.findMany(),
  ]);

  // Serialize Decimal to number for client components
  const serializedProducts = products.map((product) => ({
    ...product,
    price: Number(product.price),
  }));

  return <ProductsClient initialCategories={categories} initialProducts={serializedProducts} />;
}