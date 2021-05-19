import firebase from "firebase";
import { firestore } from "../lib/firebase";

async function createRoom(
  serverId: string,
  roomName: string,
  roomType: "text" | "voice"
) {
  console.log("type", roomType);
  // OLD APPROUCH
  //const { id } = firestore.collection("generate-id").doc();

  // firestore
  //   .collection("servers")
  //   .doc(serverId)
  //   .update({
  //     rooms: firebase.firestore.FieldValue.arrayUnion({
  //       id,
  //       name: roomName,
  //       type: roomType,
  //     }),
  //   });

  // NEW APPROUCH
  const { id } = await firestore
    .collection("servers")
    .doc(serverId)
    .collection("rooms")
    .add({
      name: roomName,
      type: roomType,
    });

  if (roomType === "text")
    await firestore.collection("conversations").add({
      type: "textRoom",
      accessIds: [id],
      messages: [],
    });
}

export default createRoom;
