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

function getOptionalEnvVariable(key: string) {
  return process.env[key];
}

export const config = {
  JWT_SECRET: getEnvVariable("JWT_SECRET"),
  NODE_ENV: getEnvVariable("NODE_ENV"),
  DATABASE_URL: getEnvVariable("DATABASE_URL"),
  COOKIE_SAMESITE: getEnvVariable("COOKIE_SAMESITE"),
  GOOGLE_CLIENT_ID: getEnvVariable("GOOGLE_CLIENT_ID"),
  GOOGLE_CLIENT_SECRET: getEnvVariable("GOOGLE_CLIENT_SECRET"),
  GOOGLE_REDIRECT_URI: getEnvVariable("GOOGLE_REDIRECT_URI"),
  CLIENT_URL: getOptionalEnvVariable("CLIENT_URL"),
};
