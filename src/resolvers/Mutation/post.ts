import { Post } from "@prisma/client";
import { Context } from "../../index";
import { canUserMutatePost } from "../../utils";

interface PostArgs {
  post: {
    title?: string;
    content?: string;
  };
}

interface PostPayloadType {
  userErrors: {
    message: string;
  }[];
  post: Post | null;
}

export const postResolvers = {
  postCreate: async (
    parent: any,
    { post: { title, content } }: PostArgs,
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    if (!title || !content) {
      return {
        userErrors: [
          {
            message: "You must provide a title and content to create a post",
          },
        ],
        post: null,
      };
    }

    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId: userInfo.userId,
      },
    });

    return {
      userErrors: [],
      post,
    };
  },
  postUpdate: async (
    parent: any,
    { postId, post }: { postId: string; post: PostArgs["post"] },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const { title, content } = post;
    if (!title && !content) {
      return {
        userErrors: [
          {
            message: "Need to have at least one field to update",
          },
        ],
        post: null,
      };
    }

    let payloadToUpdate = {
      title,
      content,
    };

    if (!title) delete payloadToUpdate.title;
    if (!content) delete payloadToUpdate.content;

    const updatedPost = await prisma.post.update({
      where: {
        id: Number(postId),
        authorId: Number(userInfo.userId),
      },
      data: {
        ...payloadToUpdate,
      },
    });

    if (!updatedPost) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    return {
      userErrors: [],
      post: updatedPost,
    };
  },
  postDelete: async (
    parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const deletedPost = await prisma.post.delete({
      where: {
        id: Number(postId),
      },
    });

    console.log("Deleted Post:", deletedPost);

    return {
      userErrors: [],
      post: deletedPost,
    };
  },
  postPublish: async (
    parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const publishedPost = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        published: true,
      },
    });

    return {
      userErrors: [],
      post: publishedPost,
    };
  },
  postUnpublish: async (
    parent: any,
    { postId }: { postId: string },
    { prisma, userInfo }: Context
  ): Promise<PostPayloadType> => {
    if (!userInfo) {
      return {
        userErrors: [
          {
            message: "Forbidden access (unauthenticated)",
          },
        ],
        post: null,
      };
    }

    const error = await canUserMutatePost({
      userId: userInfo.userId,
      postId: Number(postId),
      prisma,
    });

    if (error) return error;

    const unpublishedPost = await prisma.post.update({
      where: {
        id: Number(postId),
      },
      data: {
        published: false,
      },
    });

    return {
      userErrors: [],
      post: unpublishedPost,
    };
  },
};
