import query from "./resolvers/query";
import mutation from "./resolvers/mutation";
import { patient, doctor } from "./resolvers/relationships";
import { subs } from "./resolvers/subs";

const resolvers = {
	Query: query,
	Mutation: mutation,
	Patient: patient,
	Doctor: doctor,
	Subscription: subs
};

export { resolvers };