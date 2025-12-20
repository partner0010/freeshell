// Temporary shim to satisfy type checks when @prisma/client is not yet generated/installed.
// Remove this once `npm install` and `prisma generate` have been executed.
declare module '@prisma/client' {
  class PrismaClient {
    constructor(...args: any[]);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    [key: string]: any;
  }
  export { PrismaClient };
}

