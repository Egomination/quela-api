import axios from "axios";

describe("Connection", () => {
  test("to localhost", async () => {
    // ID LwUY6z3pTql0VbQemjBh is the Test Patient
    const response = await axios.post("http://localhost:4000/", {
      query: `
        query{
          getPatient(
            id: "LwUY6z3pTql0VbQemjBh"
          ) {
            name
          }
        }
      `
    });
    expect(response.status).toBe(200);
  });
});