import type { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    discordId?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    discordId?: string;
  }
}
