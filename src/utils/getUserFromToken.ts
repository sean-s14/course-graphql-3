import JWT from "jsonwebtoken";

export function getUserFromToken(token: string): { userId: string } | null {
  try {
    return JWT.verify(token, process.env.JWT_SIGNATURE!) as {
      userId: string;
    };
  } catch (error) {
    return null;
  }
}
