import { firestore } from "firebase-admin";
import { ApolloError, ValidationError } from "apollo-server";

const resolvers = {
  Query: {
		async getPatient(_: any, args: { id: any; }) {
      try {
        const patientDoc = await firestore()
        .collection("patients")
        .doc(args.id)
				.get();
				
				const patient = patientDoc.data();
				return patient || new ValidationError("Patient ID not found");
      } catch (error) {
        throw new ApolloError(error);
      }
		},
  },
};

export { resolvers };