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

	type Staff {
		id: ID!
		name: String!
		surname: String!
	}

	type Query {
		getPatient(id: String!): Patient
		getDoctor(id: String!): Doctor
		getStaff(id: String!): Staff
		checkType(id: String!): String
	}

	type Mutation {
		createDoctor(id: String!, name: String!, surname: String!, proficiency: String!, 
			email: String!): Boolean
		addPatientDoctor(doctorID: String!, patientID: String!): Boolean
		
		createPatient(id: String!, name: String!, surname: String!, TC: String!
			email: String!, profile_pic: String!): Boolean
		createPatientData(id: String!, name:String!, min: String!, 
		max: String!): Boolean
		addDoctorPatient(patientID: String!, doctorID: String!): Boolean
		updatePatientData(patientID: String!, field_name: String!,
		new_value: String!): Boolean
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;

export { typeDefs };