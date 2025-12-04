import { GraphQLObjectType, GraphQLSchema, GraphQLString } from "graphql";
import QueryType from "./typeDefs/query.defs";
import MutationType from "./typeDefs/mutation.defs";


const schema = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})

export default schema;
