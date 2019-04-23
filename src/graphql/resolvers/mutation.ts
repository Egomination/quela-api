import { firestore } from "firebase-admin";

import "../../email";
import sendMail from "../../email";

const mutation = {
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
        profile_pic: input.profile_pic,
        room_no: input.room_no,
        illness: input.illness,
        gender: input.gender,
        age: input.age,
        weight: input.weight,
        height: input.height,
        telephone: input.telephone
      });

    await firestore()
      .collection("users")
      .doc(input.id)
      .set({ type: "patient" });
  },

  async createPatientData(_, input) {
    await firestore()
      .collection("patients")
      .doc(input.id)
      .collection("values")
      .doc(input.name)
      .set({
        name: input.name,
        val_min: input.min,
        val_max: input.max
      });
  },

  // Add a doctor to a patient
  async addDoctorPatient(_, input) {
    await firestore()
      .collection("patients")
      .doc(input.patientID)
      .update({
        doctorID: firestore.FieldValue
          .arrayUnion(input.doctorID)
      });
  },

  async updatePatientData(_, input) {
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
        graph_data: firestore.FieldValue
          .arrayUnion({
            "data": input.new_value,
            "time": data.updateTime.seconds
          })
      });

    // Alert Email Check
    if (input.new_value > data.data().val_max || input.new_value < data.data().val_min) {
      sendMail(String(input.new_value));
    }
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
        profile_pic: input.profile_pic,
        gender: input.gender,
        age: input.age,
        hospital_name: input.hospital_name,
        telephone: input.telephone
      });

    await firestore()
      .collection("users")
      .doc(input.id)
      .set({ type: "doctor" });
  },

  // Add a patient to the doctor
  async addPatientDoctor(_, input) {
    await firestore()
      .collection("doctors")
      .doc(input.doctorID)
      .update({
        patientID: firestore.FieldValue
          .arrayUnion(input.patientID)
      });
  },
}

export default mutation;