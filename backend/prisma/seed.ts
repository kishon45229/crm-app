import bcrypt from "bcryptjs";
import { PrismaClient, LeadStatus, SalesPerson, LeadSource } from "@prisma/client";

const prisma = new PrismaClient();

export async function seedDatabase() {
  const adminEmail = (
    process.env.SEED_ADMIN_EMAIL ?? "admin@example.com"
  ).toLowerCase();
  const adminUserName = process.env.SEED_ADMIN_USERNAME ?? "admin";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "password123";

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  const user = await prisma.user.upsert({
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

  const lead = await prisma.lead.upsert({
    where: { email: "dummyLead@gmail.com" },
    update: {
      name: "Dummy Lead",
      companyName: "Dummy Company",
      phoneNumber: "+94-777-123-456",
      source: LeadSource.Other,
      assignedTo: SalesPerson.Unassigned,
      status: LeadStatus.New,
      dealValue: 5000,
    },
    create: {
      name: "Dummy Lead",
      companyName: "Dummy Company",
      email: "dummyLead@gmail.com",
      phoneNumber: "+94-777-123-456",
       source: LeadSource.Other,
      assignedTo: SalesPerson.Unassigned,
      status: LeadStatus.New,
      dealValue: 5000,
    },
  });

  const noteCount = await prisma.leadNote.count({
    where: { leadId: lead.id },
  });

  if (noteCount === 0) {
    await prisma.leadNote.create({
      data: {
        leadId: lead.id,
        content:
          "Initial contact made via LinkedIn. Lead shows interest in our CRM solution.",
        createdById: user.id,
      },
    });
  }
}
