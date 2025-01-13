import { AuthService } from './auth.service';
import { UserRole, RegisterInput, LoginInput, Context } from '../../types/user.type';

export const authResolvers = {
  Query: {
    me: async (_: unknown, __: unknown, context: Context) => {
      if (!context.user) return null;
      return context.user;
    }
  },
  Mutation: {
    registerAdmin: async (
      _: unknown, 
      { input }: { input: RegisterInput }
    ) => {
      try {
        const user = await AuthService.registerUser(input, UserRole.ADMIN);
        return user;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error registering admin:', error.message); 
          throw new Error('Error registering admin: ' + error.message);
        } else {
          console.error('Unknown error occurred during admin registration');
          throw new Error('Unknown error occurred during admin registration');
        }
      }
    },

    registerCustomer: async (
      _: unknown, 
      { input }: { input: RegisterInput }
    ) => {
      try {
 
        const user = await AuthService.registerUser(input, UserRole.CUSTOMER);
        return user;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error registering customer:', error.message); 
          throw new Error('Error registering customer: ' + error.message);
        } else {
          console.error('Unknown error occurred during customer registration');
          throw new Error('Unknown error occurred during customer registration');
        }
      }
    },

    loginAdmin: async (
      _: unknown, 
      { email, password }: LoginInput
    ) => {
      try {
  
        const loginData = await AuthService.loginUser({ email, password }, UserRole.ADMIN);
        return loginData;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error logging in as admin:', error.message);
          throw new Error('Error logging in as admin: ' + error.message);
        } else {
          console.error('Unknown error occurred during admin login');
          throw new Error('Unknown error occurred during admin login');
        }
      }
    },

    loginCustomer: async (
      _: unknown, 
      { email, password }: LoginInput
    ) => {
      try {

        const loginData = await AuthService.loginUser({ email, password }, UserRole.CUSTOMER);
        return loginData;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error logging in as customer:', error.message);
          throw new Error('Error logging in as customer: ' + error.message);
        } else {
          console.error('Unknown error occurred during customer login');
          throw new Error('Unknown error occurred during customer login');
        }
      }
    },

    verifyEmail: async (
      _: unknown, 
      { otp, email }: { otp: string, email: string }
    ) => {
      try {
        // Verify email using OTP
        const verificationResult = await AuthService.verifyEmail(otp, email);
        return verificationResult;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error verifying email:', error.message);
          throw new Error('Error verifying email: ' + error.message);
        } else {
          console.error('Unknown error occurred during email verification');
          throw new Error('Unknown error occurred during email verification');
        }
      }
    },

    resendVerificationEmail: async (
      _: unknown, 
      { email }: { email: string }
    ) => {
      try {
  
        const resendResult = await AuthService.resendVerificationEmail(email);
        return resendResult;
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error('Error resending verification email:', error.message);
          throw new Error('Error resending verification email: ' + error.message);
        } else {
          console.error('Unknown error occurred during email resend');
          throw new Error('Unknown error occurred during email resend');
        }
      }
    }
  }
};
