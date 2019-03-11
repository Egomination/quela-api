import { firestore } from "firebase-admin";
import { ValidationError } from "apollo-server";

const resolvers = {
	Query: {
		// Patiens
		async getPatient(_: any, args: { id: any; }) {
			const patientDoc = await firestore()
				.collection("patients")
				.doc(args.id)
				.get();

			const patient = patientDoc.data();
			return patient || new ValidationError("Patient ID not found");
		},
		// Doctors
		async getDoctor(_: any, args: { id: any; }) {
			const patientDoc = await firestore()
				.collection("doctors")
				.doc(args.id)
				.get();

			const patient = patientDoc.data();
			return patient || new ValidationError("Patient ID not found");
		},
	},

	Mutation: {
		// Doctors
		async createDoctor(_, input) {
			const docCreator = await firestore()
				.collection("doctors")
				.doc();

			let newDoctor = {
				id: docCreator.id,
				name: input.name,
				surname: input.surname,
				proficiency: input.proficiency,
				email: input.email,
				password: input.password,
			};

			docCreator.set(newDoctor);
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
	},

	// Relationships
	Patient: {
		doctorID() {

		}
	},

	Doctor: {
		async patientID(doctorID) {
			let patientArr = [];
			await firestore()
				.collection("patients")
				.where("doctorID", "==", doctorID.id)
				.get()
				.then(snapshot => {
					if (snapshot.empty) {
						return new ValidationError("No patient for the doctor");
					}
					snapshot.forEach(patient => {
						// Due to this, Query takes it's time.
						patientArr.push(patient.data());
					});
				});
			return patientArr;
		},
	}
};

export { resolvers };