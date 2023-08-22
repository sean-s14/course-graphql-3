import { Context } from "../index";

interface UserParentType {
  id: number;
}

export const User = {
  posts: (parent: UserParentType, args: any, { prisma, userInfo }: Context) => {
    const isOwnProfile = parent.id === userInfo?.userId;

    return prisma.post.findMany({
      where: {
        authorId: Number(parent.id),
        published: isOwnProfile ? undefined : true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
