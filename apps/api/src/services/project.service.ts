import { prisma } from "../config/database";

export const projectService = {
  async list(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });
  },
  async create(userId: string, name: string, description?: string) {
    return prisma.project.create({
      data: {
        userId,
        name,
        description,
      },
    });
  },
  async remove(userId: string, projectId: string) {
    return prisma.project.deleteMany({
      where: {
        id: projectId,
        userId,
      },
    });
  },
};
