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
		// Patients
		async createPatient(_, input) {
			const patientCreator = await firestore()
				.collection("patients")
				.doc();

			let newPatient = {
				id: patientCreator.id,
				name: input.name,
				surname: input.surname,
				TC: input.TC,
				email: input.email,
				password: input.password,
				profile_pic: input.profile_pic
			};

			patientCreator.set(newPatient);
		},

		// Add a doctor to a patient
		async addDoctorPatient(_, input) {
			let patient = input.patientID;
			let doctor = input.doctorID;

			await firestore()
				.collection("patients")
				.doc(patient)
				.update({
					doctorID: doctor
				});
		},

		async updateTemp(_, input) {
			await firestore()
				.collection("patients")
				.doc(input.patientID)
				.update({
					val_temperature: input.temp
				});
		},

		async updateAirPrs(_, input) {
			await firestore()
				.collection("patients")
				.doc(input.patientID)
				.update({
					val_airPressure: input.aPrs
				});
		},

		async updatePulse(_, input) {
			await firestore()
				.collection("patients")
				.doc(input.patientID)
				.update({
					val_pulse: input.pulse
				});
		},

		async updateBloodPrs(_, input) {
			await firestore()
				.collection("patients")
				.doc(input.patientID)
				.update({
					val_bloodPressure: input.bPrs
				});
		},


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

		// Add a patient to the doctor
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
		async values(patient) {
			const _data = await firestore()
				.collection("patients")
				.doc(patient.id)
				.collection("values")
				.get()

			const pData = _data.docs.map(data => data.data());
			return pData;
		},

		async doctorID(patient) {
			let doctor: Object;

			await firestore()
				.collection("doctors")
				.where("patientID", "array-contains", patient.id)
				.get() // returns multiple objects
				.then(snapshot => {
					if (snapshot.empty) {
						return new ValidationError("No doctor assigned for this patient");
					}
					doctor = snapshot.docs[0].data();
				});
			return doctor;
		}
	},

	Doctor: {
		async patientID(doctor) {
			let patientArr = [];
			await firestore()
				.collection("patients")
				.where("doctorID", "==", doctor.id)
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