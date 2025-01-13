export enum UserRole {
    ADMIN = 'ADMIN',
    CUSTOMER = 'CUSTOMER'
  }
  
  export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    password?: string;
    verificationToken?: string;
    otp?: string;  
    otpExpiration?: Date; 
  }
  
  
  export interface AuthPayload {
    token: string;
    user: User;
  }
  
  export interface RegisterInput {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }
  
  export interface LoginInput {
    email: string;
    password: string;
  }
  
  export interface Context {
    user?: User | null;
  }
  