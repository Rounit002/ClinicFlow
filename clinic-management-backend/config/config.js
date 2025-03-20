import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER || "your_db_username",
    password: process.env.DB_PASSWORD || "your_db_password",
    database: process.env.DB_NAME || "your_db_name",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  test: {
    username: process.env.DB_USER || "your_db_username",
    password: process.env.DB_PASSWORD || "your_db_password",
    database: process.env.DB_NAME || "your_test_db_name",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
  production: {
    username: process.env.DB_USER || "your_db_username",
    password: process.env.DB_PASSWORD || "your_db_password",
    database: process.env.DB_NAME || "your_production_db_name",
    host: process.env.DB_HOST || "127.0.0.1",
    dialect: "postgres",
  },
};

export default config;
