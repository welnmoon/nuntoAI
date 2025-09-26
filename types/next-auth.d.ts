import "next-auth";
import "next-auth/jwt";
import type { TariffSlug } from "@/constants/allowed-models";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      fullName?: string | null;
      email?: string | null;
      image?: string | null;
      emailVerified?: Date | string | null;
      tariffSlug?: TariffSlug;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: number | string;
    fullName?: string | null;
    tariffSlug?: TariffSlug;
  }
}
