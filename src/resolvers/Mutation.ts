import { postResolvers } from "./Mutation/post";
import { authResolvers } from "./Mutation/auth";

export const Mutation = {
  ...postResolvers,
  ...authResolvers,
};
