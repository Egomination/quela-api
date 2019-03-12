import { gql } from "apollo-server";

const typeDefs = gql`
	type Patient {
		id: ID!
		TC: String!
		name: String!
		surname: String!
		email: String!
		password: String!
		profile_pic: String!
		val_temperature: String!
		val_airPressure: String!
		val_pulse: String!
		doctorID: Doctor!
	}

	type Doctor {
		id: ID!
		name: String!
		surname: String!
		proficiency: String!
		email: String!
		password: String!
		patientID: [Patient]!
	}

	type Query {
		getPatient(id: String!): Patient
		getDoctor(id: String!): Doctor
	}

	type Mutation {
		createDoctor(name: String!, surname: String!, proficiency: String!, 
			email: String!, password: String!): Doctor
		addPatientDoctor(doctorID: String!, patientID: String!): Doctor
		
		createPatient(name: String!, surname: String!, TC: String!
			email: String!, password: String!, profile_pic: String!): Patient
		addDoctorPatient(patientID: String!, doctorID: String!): Patient
		updateTemp(patientID: String!, temp: String!): Patient
		updateAirPrs(patientID: String!, prs: String!): Patient
		updatePulse(patientID: String!, pulse: String!): Patient
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;

export { typeDefs };