import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      fullName?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: Date | string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number | string;
    fullName?: string | null;
  }
}
