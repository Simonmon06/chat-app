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
  jwtSecret: getEnvVariable("JWT_SECRET"),
  nodeEnv: getEnvVariable("NODE_ENV"),
  databaseUrl: getEnvVariable("DATABASE_URL"),
};
