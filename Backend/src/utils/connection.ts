import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

export const createDatabasePool = () => {
  const host = process.env.DB_HOST || "localhost";
  const port = parseInt(process.env.DB_PORT || "3306");
  const user = process.env.DB_USER || "root";
  const password = process.env.DB_PASSWORD || "";
  const database = process.env.DB_NAME || "defaultdb";

  try {
    const pool = mysql.createPool({
      host: host,
      port: port,
      user: user,
      password: password,
      database: database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    return pool;
  } catch (err) {
    console.error("Error setting up the database connection pool:", err);
    throw err;
  }
};

export const pool = createDatabasePool();
