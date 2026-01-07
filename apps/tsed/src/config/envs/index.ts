import dotenv from "dotenv-flow";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

export const config: unknown = dotenv.config();
export const isProduction: boolean = process.env.NODE_ENV === "production";
export const envs: Record<string, string | undefined> = process.env;
