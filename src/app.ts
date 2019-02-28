import { initializeApp, credential } from "firebase-admin";
import { ApolloServer } from "apollo-server";

import { typeDefs } from "./graphql/types";
import { resolvers } from "./graphql/resolvers";

initializeApp({
	credential: credential.cert("./service-account.json")
});

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen({ port: 3000 }).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});