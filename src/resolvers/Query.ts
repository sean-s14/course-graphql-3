import { Context } from "../index";

export const Query = {
  me: (parent: any, args: any, { prisma, userInfo }: Context) => {
    if (!userInfo) return null;

    return prisma.user.findUnique({
      where: {
        id: userInfo.userId,
      },
    });
  },
  profile: async (
    parent: any,
    { userId }: { userId: string },
    { prisma, userInfo }: Context
  ) => {
    const isMyProfile =
      userInfo && userInfo.userId === Number(userId) ? true : false;

    const profile = await prisma.profile.findUnique({
      where: {
        userId: Number(userId),
      },
    });

    if (!profile) return null;

    return {
      ...profile,
      isMyProfile,
    };
  },
  posts: (parent: any, args: any, { prisma }: Context) => {
    return prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });
  },
};
