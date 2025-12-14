import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import UserType from "./user.defs";
import { prisma } from "../../lib/prisma";
import PostType from "./post.defs";

const QueryType: GraphQLObjectType = new GraphQLObjectType({
  name: "Query",
  fields: {
    hello: {
      type: GraphQLString,
      resolve: () => "Hello World",
    },
    user: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLInt) },
      },
      resolve: async (_, { id }) => {
        return await prisma.user.findUnique({
          where: { id },
          include: { posts: true },
        });
      },
    },
    users: {
      type: new GraphQLList(UserType),
      resolve: async () => {
          return await prisma.user.findMany({ include: {posts : true} });
      },
      },
      posts: {
          type: new GraphQLList(PostType),
          resolve: async () => { 
              return await prisma.post.findMany({ include: {author:true} })
          }
      }
  },
});

export default QueryType;
