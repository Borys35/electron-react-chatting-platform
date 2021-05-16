import firebase from "firebase";
import { firestore } from "../lib/firebase";

async function joinServer(serverId: string, user: any) {
  const doc = firestore.collection("servers").doc(serverId);

  const serverData = (await doc.get()).data();

  if (!serverData) return;

  firestore
    .collection("servers")
    .doc(serverId)
    .update({
      members: firebase.firestore.FieldValue.arrayUnion({
        uid: user.auth.uid,
        username: user.database.username,
        photoURL: user.database.photoURL,
      }),
    });
  firestore
    .collection("users")
    .doc(user.auth.uid)
    .update({
      servers: firebase.firestore.FieldValue.arrayUnion({
        id: serverId,
        name: serverData.name,
        photoURL: serverData.photoURL,
      }),
    });
}

export default joinServer;
