import { firestore } from "firebase-admin";
import { ValidationError } from "apollo-server";

const resolvers = {
	Query: {
		// Patiens
		async getPatient(_: any, args: { id: any; }) {
			const patientData = await firestore()
				.collection("patients")
				.doc(args.id)
				.get();

			const patient = patientData.data();
			return patient || new ValidationError("Patient ID not found");
		},
		// Doctors
		async getDoctor(_: any, args: { id: any; }) {
			const doctorData = await firestore()
				.collection("doctors")
				.doc(args.id)
				.get();

			const doctor = doctorData.data();
			return doctor || new ValidationError("Patient ID not found");
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

		async createPatientData(_, input) {
			let newData = {
				name: input.name,
				val_curr: "0",
				val_min: input.min,
				val_max: input.max
			}

			await firestore()
				.collection("patients")
				.doc(input.id)
				.collection("values")
				.doc(input.name)
				.set(newData);
		},

		// Add a doctor to a patient
		async addDoctorPatient(_, input) {
			let patient = input.patientID;
			let doctor = input.doctorID;

			await firestore()
				.collection("doctors")
				.doc(patient)
				.update({
					doctorID: firestore.FieldValue
						.arrayUnion(doctor)
				});
		},

		async updatePatientData(_, input) {
			await firestore()
				.collection("patients")
				.doc(input.patientID)
				.collection("values")
				.doc(input.field_name)
				.update({
					val_curr: input.new_value
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
			let doctorArr = [];
			await firestore()
				.collection("doctors")
				.where("patientID", "array-contains", patient.id)
				.get()
				.then(snapshot => {
					snapshot.forEach(doctor => {
						// Due to this, Query takes it's time.
						doctorArr.push(doctor.data());
					});
				});
			return doctorArr;
		}
	},

	Doctor: {
		async patientID(doctor) {
			let patientArr = [];
			await firestore()
				.collection("patients")
				.where("doctorID", "array-contains", doctor.id)
				.get()
				.then(snapshot => {
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