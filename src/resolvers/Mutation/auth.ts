import { User } from "@prisma/client";
import { Context } from "../../index";
import isEmail from "validator/lib/isEmail";
import isLength from "validator/lib/isLength";
import bcrypt from "bcryptjs";
import JWT from "jsonwebtoken";

interface SignupArgs {
  credentials: {
    email: string;
    password: string;
  };
  name: string;
  bio: string;
}

interface UserPayload {
  userErrors: {
    message: string;
  }[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    parent: any,
    { credentials: { email, password }, name, bio }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    if (!isEmail(email)) {
      return {
        userErrors: [
          {
            message: "Invalid email",
          },
        ],
        token: null,
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
        token: null,
      };
    }

    if (!name || !bio) {
      return {
        userErrors: [
          {
            message: "You must provide a name and bio to create a user",
          },
        ],
        token: null,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        profile: {
          create: {
            bio,
          },
        },
      },
    });

    const token = await JWT.sign(
      { userId: user.id },
      process.env.JWT_SIGNATURE!,
      {
        expiresIn: "1d",
      }
    );

    return {
      userErrors: [],
      token: token,
    };
  },
  signin: async (
    parent: any,
    { credentials: { email, password } }: SignupArgs,
    { prisma }: Context
  ): Promise<UserPayload> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return {
        userErrors: [
          {
            message: "Invalid credentials",
          },
        ],
        token: null,
      };
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return {
        userErrors: [
          {
            message: "Invalid credentials",
          },
        ],
        token: null,
      };
    }

    const token = await JWT.sign(
      { userId: user.id },
      process.env.JWT_SIGNATURE!,
      {
        expiresIn: "1d",
      }
    );

    return {
      userErrors: [],
      token,
    };
  },
};
