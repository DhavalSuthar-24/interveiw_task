import dotenv from 'dotenv';
import express, { Application } from 'express';
import { ApolloServer } from 'apollo-server-express';
import { makeExecutableSchema } from '@graphql-tools/schema';
import cors from 'cors';
import http from 'http';
import { pool } from './utils/connection'; 
import { authTypeDefs } from './modules/auth/auth.schema';
import { authResolvers } from './modules/auth/auth.resolver';
import { authMiddleware } from './middleware/auth.middleware';
import { User } from './types/user.type';

dotenv.config();

declare module 'express' {
  interface Request {
    user?: User | null;
  }
}

async function startServer() {
  const app: Application = express();

  app.use(cors());
  app.use(express.json());
  app.use(authMiddleware);

  const schema = makeExecutableSchema({
    typeDefs: [authTypeDefs],
    resolvers: [authResolvers],
  });

  const server = new ApolloServer({
    schema,
    context: ({ req }) => ({
      user: req.user || null,
    }),
  });

  try {
    const connection = await pool.getConnection();
    console.log('Database connection successful');
    

 const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        role ENUM('ADMIN', 'CUSTOMER') NOT NULL,
        email_verified BOOLEAN DEFAULT FALSE,
        password VARCHAR(255),
        verification_token VARCHAR(255),
        otp VARCHAR(10),
        otp_expiration TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );
`;


    await connection.query(createTableQuery);
    console.log('Users table ensured');
    
    connection.release();
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }

  await server.start();
  server.applyMiddleware({ app } as any);

  const httpServer = http.createServer(app);

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(console.error);
