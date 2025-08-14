import dotenv from "dotenv";

dotenv.config();

function getEnvVariable(key: string): string {
  const value = process.env[key];

  if (!value) {
    console.log(`FATAL ERROR: Environment variable ${key} is not set.`);
    process.exit(1);
  }

  return value;
}

export const config = {
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  NODE_ENV: getEnvVariable("NODE_ENV"),
  DATABASE_URL: getEnvVariable("DATABASE_URL"),
  COOKIE_SAMESITE: getEnvVariable("COOKIE_SAMESITE"),
};
