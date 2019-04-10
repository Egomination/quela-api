import { firestore } from "firebase-admin";

const patient = {
  async values(patient) {
    const _data = await firestore()
      .collection("patients")
      .doc(patient.id)
      .collection("values")
      .get()

    const pData = _data.docs.map(data => data.data());
    return pData;
  },

  async doctorID(patient) {
    let doctorArr = [];
    await firestore()
      .collection("doctors")
      .where("patientID", "array-contains", patient.id)
      .get()
      .then(snapshot => {
        snapshot.forEach(doctor => {
          // Due to this, Query takes it's time.
          doctorArr.push(doctor.data());
        });
      });
    return doctorArr;
  }
}

const doctor = {
  async patientID(doctor) {
    let patientArr = [];
    await firestore()
      .collection("patients")
      .where("doctorID", "array-contains", doctor.id)
      .get()
      .then(snapshot => {
        snapshot.forEach(patient => {
          // Due to this, Query takes it's time.
          patientArr.push(patient.data());
        });
      });
    return patientArr;
  },
}

export { patient, doctor };
