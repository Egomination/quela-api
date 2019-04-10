import { PubSub, withFilter } from "apollo-server";

enum Events {
  Patient_Data_UPDATED = "Patient_Data_UPDATED",
}

const pubsub = new PubSub();

const subs = {
  dataUpdated: {
    subscribe: withFilter(
      () => pubsub.asyncIterator(Events.Patient_Data_UPDATED),
      (payload, args) => {
        return payload.patientID.includes(args.patientID);
      },
    ),
  },
}

export { subs, pubsub, Events };