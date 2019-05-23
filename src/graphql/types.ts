import { gql } from "apollo-server";

const typeDefs = gql`

	type graphData {
		data: Int!
		time: Int!
	}

	type PatientValue {
		name: String!
		val_min: String!
		val_max: String!
		graph_data: [graphData]!
	}

	type Patient {
		id: ID!
		TC: String!
		name: String!
		surname: String!
		email: String!
		profile_pic: String!
		room_no: String!
		illness: String!
		gender: String!
		age: Int!
		weight: String!
		height: String!
		telephone: String!
		values: [PatientValue]!
		doctorID: [Doctor]!
	}

	type Doctor {
		id: ID!
		name: String!
		surname: String!
		proficiency: String!
		email: String!
		profile_pic: String!
		gender: String!
		age: Int!
		hospital_name: String!
		telephone: String!
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
			email: String!, profile_pic: String!, gender: String!, age: Int!, 
			hospital_name: String!, telephone: String!): Boolean
		addPatientDoctor(doctorID: String!, patientID: String!): Boolean
		
		createPatient(id: String!, name: String!, surname: String!, TC: String!
			email: String!, profile_pic: String!, room_no: String!, illness: String!,
			gender: String!, age: Int!, weight: String!, height: String!, 
			telephone: String!): Boolean
		addDoctorPatient(patientID: String!, doctorID: String!): Boolean
		updatePatientData(patientID: String!, field_name: String!,
		new_value: Int!): Boolean
	}

	schema {
		query: Query
		mutation: Mutation
	}
`;

export { typeDefs };
