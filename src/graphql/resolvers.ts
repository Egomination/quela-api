import { firestore } from "firebase-admin";
import { ValidationError, PubSub, withFilter } from "apollo-server";
import { Query } from "@google-cloud/firestore";

enum Events {
	Patient_Data_UPDATED = "Patient_Data_UPDATED",
}

const pubsub = new PubSub();

const resolvers = {
	Query: {
		// Patient
		async getPatient(_: any, args: { id: any; }) {
			const patientData = await firestore()
				.collection("patients")
				.doc(args.id)
				.get();

			const patient = patientData.data();
			return patient || new ValidationError("Patient ID not found");
		},
		// Doctor
		async getDoctor(_: any, args: { id: any; }) {
			const doctorData = await firestore()
				.collection("doctors")
				.doc(args.id)
				.get();

			const doctor = doctorData.data();
			return doctor || new ValidationError("Doctor ID not found");
		},
		// Staff
		async getStaff(_: any, args: { id: any; }) {
			const staffData = await firestore()
				.collection("staff")
				.doc(args.id)
				.get();

			const staff = staffData.data();
			return staff || new ValidationError("No Staff with that ID found");
		},
		// General
		async checkType(_: any, args: { id: any; }) {
			const type = await firestore()
				.collection("users")
				.doc(args.id)
				.get();

			return type.data().type;
		},
	},

	Mutation: {
		// Patients
		async createPatient(_, input) {
			await firestore()
				.collection("patients")
				.doc(input.id)
				.set({
					id: input.id,
					name: input.name,
					surname: input.surname,
					TC: input.TC,
					email: input.email,
					profile_pic: input.profile_pic
				});

			await firestore()
				.collection("users")
				.doc(input.id)
				.set({ type: "patient" });
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
				.collection("patients")
				.doc(patient)
				.update({
					doctorID: firestore.FieldValue
						.arrayUnion(doctor)
				});
		},

		async updatePatientData(_, input) {
			// Update value
			await firestore()
				.collection("patients")
				.doc(input.patientID)
				.collection("values")
				.doc(input.field_name)
				.update({
					val_curr: input.new_value
				});

			// Get the data of updated value
			const data = await firestore()
				.collection("patients")
				.doc(input.patientID)
				.collection("values")
				.doc(input.field_name)
				.get();

			// Update timestamp
			await firestore()
				.collection("patients")
				.doc(input.patientID)
				.collection("values")
				.doc(input.field_name)
				.update({
					last_upd: data.updateTime.seconds
				});

			// Get the data of Patient - For Subs -
			const patientData = await firestore()
				.collection("patients")
				.doc(input.patientID)
				.get();

			// Subscription output
			const output = Object.assign(data.data(),
				{ p_name: patientData.data().name },
				{ p_surname: patientData.data().surname }
			)

			// Subscription
			pubsub.publish(Events.Patient_Data_UPDATED, {
				doctorID: patientData.data().doctorID, dataUpdated: output
			});
		},

		// Doctors
		async createDoctor(_, input) {
			await firestore()
				.collection("doctors")
				.doc(input.id)
				.set({
					id: input.id,
					name: input.name,
					surname: input.surname,
					proficiency: input.proficiency,
					email: input.email,
					profile_pic: input.profile_pic
				});

			await firestore()
				.collection("users")
				.doc(input.id)
				.set({ type: "doctor" });
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
	},

	// Subscriptions
	Subscription: {
		dataUpdated: {
			subscribe: withFilter(
				() => pubsub.asyncIterator(Events.Patient_Data_UPDATED),
				(payload, args) => {
					return payload.doctorID.includes(args.doctorID);
				},
			),
		},
	}
};

export { resolvers };