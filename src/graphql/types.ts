import { gql } from "apollo-server";

const typeDefs = gql`

	type PatientValue {
		name: String!
		val_curr: String!
		val_min: String!
		val_max: String!
		last_upd: Int!
	}

	type DataSubResult {
		name: String!
		val_curr: String!
		val_min: String!
		val_max: String!
		last_upd: Int!
		p_name: String!
		p_surname: String!
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
		createPatientData(id: String!, name:String!, min: String!, 
		max: String!): Boolean
		addDoctorPatient(patientID: String!, doctorID: String!): Boolean
		updatePatientData(patientID: String!, field_name: String!,
		new_value: String!): Boolean
	}

	type Subscription {
  	dataUpdated(doctorID: String): DataSubResult
  }

	schema {
		query: Query
		mutation: Mutation
		subscription: Subscription
	}
`;

export { typeDefs };