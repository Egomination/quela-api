import { firestore } from "firebase-admin";

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
}

export default mutation;