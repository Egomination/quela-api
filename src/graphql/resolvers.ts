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

	Mutation: {
		// Doctors
		async createDoctor(_, input) {
			let newDoctor = {
				name: input.name,
				surname: input.surname,
				proficiency: input.proficiency,
				email: input.email,
				password: input.password,
				//patientID: input.patientID
			};
			// const docCreator =
			await firestore()
				.collection("doctors")
				.add(newDoctor);
			// return docCreator.id
		},

		async addPatientDoctor(_, input) {
			let doctor = input.doctorID;
			let patient = input.patientID;

			await firestore()
				.collection("doctors")
				.doc(doctor)
				.update({
					patientID: firestore.FieldValue
						.arrayUnion(patient)
				});
		},
	}
};

export { resolvers };