import { PrismaClient, Prisma } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg'
import 'dotenv/config'
import prisma from '@/lib/prisma';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
})
const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log('Start seeding...');

  // Get existing categories
  const accessories = await prisma.category.findFirst({
    where: { name: 'Accessories' }
  });

  const treats = await prisma.category.findFirst({
    where: { name: 'Treats and Nutrition' }
  });

  const grooming = await prisma.category.findFirst({
    where: { name: 'Grooming' }
  });

  if (!accessories || !treats || !grooming) {
    throw new Error('Required categories not found. Please create them first.');
  }

  // Seed Accessories products
  await prisma.product.createMany({
    data: [
      {
        name: 'Premium Leather Collar',
        description: 'Handcrafted genuine leather with adjustable sizing. Personalization available.',
        price: 39.99,
        inventory: 50,
        categoryId: accessories.id,
        images: []
      },
      {
        name: 'Reflective LED Leash',
        description: '6-foot leash with built-in LED lights for night visibility.',
        price: 29.99,
        inventory: 75,
        categoryId: accessories.id,
        images: []
      },
      {
        name: 'Harness with Handle',
        description: 'No-pull design distributes pressure evenly. Perfect for large dogs.',
        price: 44.99,
        inventory: 60,
        categoryId: accessories.id,
        images: []
      },
      {
        name: 'Travel Food Bowl Set',
        description: 'Collapsible bowls with carrying case. Ideal for on-the-go feeding.',
        price: 16.99,
        inventory: 100,
        categoryId: accessories.id,
        images: []
      },
      {
        name: 'Portable Dog Bed',
        description: 'Compact, lightweight travel bed with washable cover.',
        price: 34.99,
        inventory: 40,
        categoryId: accessories.id,
        images: []
      }
    ],
    skipDuplicates: true
  });

  // Seed Treats & Nutrition products
  await prisma.product.createMany({
    data: [
      {
        name: 'Organic Chicken Treats',
        description: 'Human-grade, grain-free biscuits. No artificial preservatives.',
        price: 12.99,
        inventory: 150,
        categoryId: treats.id,
        images: []
      },
      {
        name: 'Premium Dog Food (Bag)',
        description: 'High-protein formula with real meat. 25 lbs.',
        price: 54.99,
        inventory: 80,
        categoryId: treats.id,
        images: []
      },
      {
        name: 'Peanut Butter Chew Sticks',
        description: 'Natural, long-lasting chews. All-natural ingredients.',
        price: 8.99,
        inventory: 200,
        categoryId: treats.id,
        images: []
      },
      {
        name: 'Dental Cleaning Treats',
        description: 'Fresh breath formula with enzymatic action. 30-piece bag.',
        price: 15.99,
        inventory: 120,
        categoryId: treats.id,
        images: []
      },
      {
        name: 'Fish Oil Supplements',
        description: 'Omega-3 rich for coat and joint health. 90 capsules.',
        price: 22.99,
        inventory: 90,
        categoryId: treats.id,
        images: []
      }
    ],
    skipDuplicates: true
  });

  // Seed Grooming & Care products
  await prisma.product.createMany({
    data: [
      {
        name: 'Slicker Brush',
        description: 'Professional-grade tool reduces shedding. Suitable for all coat types.',
        price: 18.99,
        inventory: 70,
        categoryId: grooming.id,
        images: []
      },
      {
        name: 'Natural Oat Shampoo',
        description: 'Gentle formula for sensitive skin. Hypoallergenic and pH-balanced.',
        price: 16.99,
        inventory: 110,
        categoryId: grooming.id,
        images: []
      },
      {
        name: 'Dog Nail Clipper',
        description: 'Safety guard prevents over-cutting. Ergonomic grip handle.',
        price: 14.99,
        inventory: 85,
        categoryId: grooming.id,
        images: []
      },
      {
        name: 'Teeth Cleaning Kit',
        description: 'Toothbrush, toothpaste, and finger brush set. Veterinarian recommended.',
        price: 19.99,
        inventory: 65,
        categoryId: grooming.id,
        images: []
      },
      {
        name: 'Grooming Wipes',
        description: 'Fresh-scented, biodegradable wipes for quick cleanups. 100-count pack.',
        price: 11.99,
        inventory: 180,
        categoryId: grooming.id,
        images: []
      }
    ],
    skipDuplicates: true
  });

  console.log('Database seeded successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });