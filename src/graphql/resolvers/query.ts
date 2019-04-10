import { firestore } from "firebase-admin";
import { ValidationError } from "apollo-server";

const query = {
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
}

export default query;