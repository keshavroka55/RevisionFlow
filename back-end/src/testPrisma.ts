// src/testPrisma.js
import { prisma } from './prisma';

async function test() {
  try {
    const users = await prisma.user.findMany();
    console.log(users);
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

test();       
