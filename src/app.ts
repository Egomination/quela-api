import { initializeApp, credential } from "firebase-admin";
import { ApolloServer } from "apollo-server";
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

const server = new ApolloServer({
	typeDefs,
	resolvers
});

server.listen({ port: 4000 }).then(({ url }) => {
	console.log(`Server ready at ${url}`);
});