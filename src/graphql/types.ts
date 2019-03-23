import { gql } from "apollo-server";

const typeDefs = gql`

	type PatientValue {
		name: String!
		val_curr: String!
		val_min: String!
		val_max: String!
	}

	type Patient {
		id: ID!
		TC: String!
		name: String!
		surname: String!
		email: String!
		profile_pic: String!
		values: [PatientValue]!
		doctorID: [Doctor]!
	}

	type Doctor {
		id: ID!
		name: String!
		surname: String!
		proficiency: String!
		email: String!
		patientID: [Patient]!
	}

	type Query {
		getPatient(id: String!): Patient
		getDoctor(id: String!): Doctor
	}

	type Mutation {
		createDoctor(name: String!, surname: String!, proficiency: String!, 
			email: String!): Doctor
		addPatientDoctor(doctorID: String!, patientID: String!): Doctor
		
		createPatient(name: String!, surname: String!, TC: String!
			email: String!, profile_pic: String!): Patient
		createPatientData(id: String!, name:String!, min: String!, 
		max: String!): Patient
		addDoctorPatient(patientID: String!, doctorID: String!): Patient
		updatePatientData(patientID: String!, field_name: String!,
		new_value: String!): Patient
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;

export { typeDefs };