import { prisma } from "../config/database";
import type { ConnectionService } from "@ship/shared";

export const connectionService = {
  async list(userId: string) {
    return prisma.apiConnection.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  },
  async upsert(userId: string, service: ConnectionService, encryptedApiKey: string) {
    return prisma.apiConnection.upsert({
      where: {
        userId_service: { userId, service },
      },
      create: {
        userId,
        service,
        encryptedApiKey,
        status: "connected",
      },
      update: {
        encryptedApiKey,
        status: "connected",
        updatedAt: new Date(),
      },
    });
  },
  async remove(userId: string, service: ConnectionService) {
    return prisma.apiConnection.deleteMany({
      where: { userId, service },
    });
  },
  async updateStatus(userId: string, service: ConnectionService, status: string) {
    return prisma.apiConnection.updateMany({
      where: { userId, service },
      data: {
        status,
        lastTestedAt: new Date(),
      },
    });
  },
  async get(userId: string, service: ConnectionService) {
    return prisma.apiConnection.findUnique({
      where: {
        userId_service: { userId, service },
      },
    });
  },
};
