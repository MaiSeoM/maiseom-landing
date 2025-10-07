import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.SEED_USER_EMAIL || 'demo@maiseom.com';
  const password = process.env.SEED_USER_PASSWORD || 'Demo1234!';
  const hashed = await hash(password, 10);

  await prisma.user.upsert({
    where: { email },
    update: {
      password: hashed,
      name: 'Compte de démonstration',
    },
    create: {
      email,
      password: hashed,
      name: 'Compte de démonstration',
    },
  });

  console.log(`Utilisateur seedé : ${email} / ${password}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
