import { initializeApp, credential } from "firebase-admin";
import { ApolloServer } from "apollo-server";

import { typeDefs } from "./graphql/types";
import { resolvers } from "./graphql/resolvers";

// Need this type of call because of error
const serviceAccount = require("./service-account.json");

initializeApp({
	credential: credential.cert(serviceAccount)
});

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen({ port: 4000 }).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});