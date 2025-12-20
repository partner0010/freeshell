// Lightweight PrismaClient stub for environments where @prisma/client is not yet generated.
export class PrismaClient {
  constructor(..._args: any[]) {}
  $connect(): Promise<void> {
    return Promise.resolve();
  }
  $disconnect(): Promise<void> {
    return Promise.resolve();
  }
}

