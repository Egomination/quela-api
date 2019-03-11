import { gql } from "apollo-server";

const typeDefs = gql`
	type Patient {
		id: ID!
		name: String!
		surname: String!
		TC: String!
		info_temp: String!
		info_airPres: String!
		info_pulse: String!
		email: String!
		password: String!
		doctorID: Doctor!
	}

	type Doctor {
		id: ID!
		name: String!
		surname: String!
		proficiency: String!
		email: String!
		password: String!
		patientID: [Patient]
	}

	type Query {
		getPatient(id: String!): Patient
		getDoctor(id: String!): Doctor
	}

	type Mutation {
		createDoctor(name: String!, surname: String!, proficiency: String!, 
		email: String!, password: String!, patientID: [String]!): Doctor
		addPatientDoctor(doctorID: String!, patientID: String!): Doctor
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;

export { typeDefs };