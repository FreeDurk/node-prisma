import {
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";
import { prisma } from "../../lib/prisma";
import PostType from "./post.defs";

const UserType: GraphQLObjectType = new GraphQLObjectType({
  name: "User",
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    email: { type: new GraphQLNonNull(GraphQLString) },
    name: { type: GraphQLString },
    posts: {
      type: new GraphQLList(PostType),
      resolve: (parent) => parent.posts
    },
  }),
});

export default UserType;

// model User {
//   id    Int     @id @default(autoincrement())
//   email String  @unique
//   name  String?
//   posts Post[]

//   @@map("users")
// }
