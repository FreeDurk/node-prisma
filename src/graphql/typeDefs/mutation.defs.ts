import {
  GraphQLInputObjectType,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import UserType from "./user.defs";
import { prisma } from "../../lib/prisma";
import { User } from "../../../generated/prisma/client";

const PostInputType = new GraphQLInputObjectType({
  name: "PostInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLString },
  },
});

const MutationType = new GraphQLObjectType({
  name: "Mutations",
  fields: {
    createUser: {
      type: UserType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        post: { type: PostInputType },
      },
      resolve: async (_, { email, name, post }) => {
        return prisma.user.create({
          data: {
            email,
            name,
            ...(post && {
              posts: {
                create: post,
              },
            }),
          },
          include: {
            bookings: true,
          },
        });
      },
    },
    updateUser: {
      type: UserType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, user: User) => { 
        return await prisma.user.update({
          where: { id: user.id }, data: {
           ...user
        } })
      } 
    }
  },
});

export default MutationType;
