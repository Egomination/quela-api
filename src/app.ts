import { initializeApp, credential } from "firebase-admin";
import { ApolloServer, makeExecutableSchema } from "apollo-server";
import { config } from "dotenv";

import { typeDefs } from "./graphql/types";
import { resolvers } from "./graphql/resolvers";

config();

initializeApp({
	credential: credential.cert({
		"projectId": process.env.FIREBASE_PROJECT_ID,
		"privateKey": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
		"clientEmail": process.env.FIREBASE_CLIENT_EMAIL,
	}),

});

const schema = makeExecutableSchema({ typeDefs, resolvers });
const server = new ApolloServer({
	schema
});

server.listen({ port: process.env.PORT || 4000 }).then(({ url, subscriptionsUrl }) => {
	console.log(`Server ready at ${url}`);
	console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});