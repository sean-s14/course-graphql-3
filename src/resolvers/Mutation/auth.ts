import { User } from "@prisma/client";
import { Context } from "../../index";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import bcrypt from "bcryptjs";

interface SignupArgs {
  email: string;
  name: string;
  password: string;
  bio: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  user: null;
}

export const authResolvers = {
  signup: async (
    parent: any,
    { email, name, password, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    if (!isEmail(email)) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        user: null,
      };
    }

    const isValidPassword = isLength(password, { min: 5 });

    if (!isValidPassword) {
      return {
        userErrors: [
          {
            message: "Invalid password",
          },
        ],
        user: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "You must provide a name and bio to create a user",
          },
        ],
        user: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    return {
      userErrors: [],
      user: null,
    };
  },
};
