import bcrypt from "bcryptjs";
import { PrismaClient, LeadStatus, SalesPerson } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Idempotent seed: safe to run multiple times.
  // Keep this dev-friendly; do NOT rely on these credentials in production.

  const shouldSeedAdmin =
    process.env.SEED_ADMIN === "false"
      ? false
      : process.env.NODE_ENV !== "production";

  if (shouldSeedAdmin) {
    const adminEmail = (
      process.env.SEED_ADMIN_EMAIL ?? "admin@crm.local"
    ).toLowerCase();
    const adminUserName = process.env.SEED_ADMIN_USERNAME ?? "admin";
    const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "admin12345";

    const passwordHash = await bcrypt.hash(adminPassword, 12);

    await prisma.user.upsert({
      where: { email: adminEmail },
      update: {
        userName: adminUserName,
        passwordHash,
      },
      create: {
        email: adminEmail,
        userName: adminUserName,
        passwordHash,
      },
    });
  }

  await prisma.lead.upsert({
    where: { email: "initial.lead@crm.local" },
    update: {
      name: "Initial Lead",
      companyName: "Initial Company",
      phoneNumber: "+1-555-0101",
      source: "seed-initial",
      assignedTo: SalesPerson.Unassigned,
      status: LeadStatus.New,
      dealValue: 5000,
    },
    create: {
      name: "Initial Lead",
      companyName: "Initial Company",
      email: "initial.lead@crm.local",
      phoneNumber: "+1-555-0101",
      source: "seed-initial",
      assignedTo: SalesPerson.Unassigned,
      status: LeadStatus.New,
      dealValue: 5000,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (err) => {
    await prisma.$disconnect();
    // eslint-disable-next-line no-console
    console.error(err);
    process.exit(1);
  });
