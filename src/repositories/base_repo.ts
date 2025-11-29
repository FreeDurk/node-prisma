import { PrismaClient } from "../../generated/prisma/client";

export abstract class BaseRepository<T> { 
    constructor(protected prisma: PrismaClient) { }

    abstract findById(id: string | number): Promise<T | null>;
    abstract create(data: any): Promise<T>;
    abstract update(id: string | number, data: any): Promise<T>;
    abstract delete(id: string | number): Promise<T>;
}