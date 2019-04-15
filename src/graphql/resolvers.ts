import query from "./resolvers/query";
import mutation from "./resolvers/mutation";
import { patient, doctor } from "./resolvers/relationships";

const resolvers = {
	Query: query,
	Mutation: mutation,
	Patient: patient,
	Doctor: doctor
};

export { resolvers };