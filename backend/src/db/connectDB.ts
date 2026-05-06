import { prisma } from "./prisma";

let connected = false;

export const connectDB = async (): Promise<void> => {
  if (connected) return;
  await prisma.$connect();
  connected = true;
};

export const disconnectDB = async (): Promise<void> => {
  if (!connected) return;
  await prisma.$disconnect();
  connected = false;
};
