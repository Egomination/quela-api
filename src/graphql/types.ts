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
		patientID: [Patient]!
  }

	type Query {
		getAllPatient(id: String!): Patient
	}

	schema {
    query: Query
  }
`;

export { typeDefs };