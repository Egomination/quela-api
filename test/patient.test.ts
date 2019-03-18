import axios from "axios";

const patientSearch = async (searchQuery: String) => {
  const response = await axios.post("http://localhost:4000/", {
    query: `
        query{
          getPatient(
            id: "LwUY6z3pTql0VbQemjBh"
          ) {
            ${searchQuery}
          }
        }
      `
  });
  return response.data;
}

describe("Patient value Test", () => {
  test("should be 10", async () => {
    const searchQuery = `
      values {
        val_curr
      }  
    `;
    const response = await patientSearch(searchQuery);
    expect(response).toMatchObject({
      data: {
        getPatient: {
          values: [
            {
              val_curr: "10"
            }
          ]
        }
      }
    });
  });

  test("should be changed to 20", async () => {
    await axios.post("http://localhost:4000/", {
      query: `
        mutation{
          updatePatientData(
            patientID: "LwUY6z3pTql0VbQemjBh", 
            new_value: "20",
            field_name: "Test"
          ){
            name
          }
        }
      `
    });

    const searchQuery = `
      values {
        val_curr
      }  
    `;
    const response = await patientSearch(searchQuery);
    expect(response).toMatchObject({
      data: {
        getPatient: {
          values: [
            {
              val_curr: "20"
            }
          ]
        }
      }
    });
  });

  test("should be changed to 10 again", async () => {
    await axios.post("http://localhost:4000/", {
      query: `
        mutation{
          updatePatientData(
            patientID: "LwUY6z3pTql0VbQemjBh", 
            new_value: "10",
            field_name: "Test"
          ){
            name
          }
        }
      `
    });

    const searchQuery = `
      values {
        val_curr
      }  
    `;
    const response = await patientSearch(searchQuery);
    expect(response).toMatchObject({
      data: {
        getPatient: {
          values: [
            {
              val_curr: "10"
            }
          ]
        }
      }
    });
  });
});