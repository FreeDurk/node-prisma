import { GraphQLInt, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import UserType from "./user.defs";
import { prisma } from "../../lib/prisma";

const QueryType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Query',
    fields: {
        hello: {
            type: GraphQLString,
            resolve: () => 'Hello World'
        },
        user: {
            type: UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: async (_, { id}) => { 
                return await prisma.user.findUnique({ where: { id }, include: {posts:true} })
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: async () => { 
                return await prisma.user.findMany()
            }
        }

    }
})

export default QueryType;