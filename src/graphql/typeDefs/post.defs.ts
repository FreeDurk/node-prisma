import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./user.defs";
import { prisma } from "../../lib/prisma";

const PostType: GraphQLObjectType  = new GraphQLObjectType({
  name: 'Post',
  fields: () => ({
    id: { type: new GraphQLNonNull(GraphQLInt) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: GraphQLString },
    published: { type: new GraphQLNonNull(GraphQLBoolean) },
    authorId: { type: new GraphQLNonNull(GraphQLInt) },
    createdAt: { type: new GraphQLNonNull(GraphQLString) },
    updatedAt: { type: new GraphQLNonNull(GraphQLString) },
    author: {
      type: UserType,
      resolve: async (parent) => {
        return await prisma.user.findUnique({
          where: { id: parent.authorId }
        });
      }
    }
  })
});

export default PostType;

// model Post {
//   id        Int     @id @default(autoincrement())
//   title     String
//   content   String? @db.Text
//   published Boolean @default(false)
//   author    User    @relation(fields: [authorId], references: [id])
//   authorId  Int

//   @@map("posts")
// }