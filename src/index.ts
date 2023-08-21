import { ApolloServer } from "apollo-server";
import { typeDefs } from "./schema";
import { Query, Mutation } from "./resolvers";
import { PrismaClient } from "@prisma/client";
import { getUserFromToken } from "./utils";

const prisma = new PrismaClient();

export interface Context {
  prisma: PrismaClient;
  userInfo: { userId: number } | null;
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: ({ req }: any) => {
    const userInfo = getUserFromToken(req.headers.authorization);
    return {
      prisma,
      userInfo,
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
