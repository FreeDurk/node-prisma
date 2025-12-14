import { PrismaClient, User } from "../../generated/prisma/client";

export class UserRepository  { 
    constructor(private prisma: PrismaClient) { }

    async findAll(): Promise<User[]> { 
        return this.prisma.user.findMany();
    }

    async findById(id: string ): Promise<User | null> {
        return this.prisma.user.findUnique({ where: {id} })
    }

    async create(data: any): Promise<User> {
        return this.prisma.user.create(data);
    }

    async update(id: string, data: any): Promise<User> { 
        return this.prisma.user.update({ where: {id}, data })
    }

    async delete(id: string): Promise<User> { 
        return this.prisma.user.delete({ where: {id} })
    }

}