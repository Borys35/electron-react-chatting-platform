import React, { FC, useState } from "react";
import { FaPlus, FaHashtag, FaVolumeDown, FaCog } from "react-icons/fa";
import firebase from "firebase";
import { firestore } from "../lib/firebase";
import { useAuth } from "../providers/AuthProvider";
import CreateRoomModal from "./CreateRoomModal";
import ItemWithImage from "./ItemWithImage";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";
import RoomModal from "./RoomModal";

interface Props {
  serverId: string;
  roomId: string;
  isOwner: boolean;
  values: Array<any>;
  // values: Array<{ id: string; name: string; type: string }>;
  onTextRoomClick: Function;
  onVoiceRoomClick: Function;
}

const RoomList: FC<Props> = ({
  serverId,
  roomId,
  isOwner,
  values,
  onTextRoomClick,
  onVoiceRoomClick,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [settingsModalId, setSettingsModalId] = useState<string>("");
  const { user } = useAuth();

  async function updateRoom(id: string, name: string) {
    await firestore
      .collection("servers")
      .doc(serverId)
      .collection("rooms")
      .doc(id)
      .update({ name });
  }

  async function deleteRoom(id: string) {
    await firestore
      .collection("servers")
      .doc(serverId)
      .collection("rooms")
      .doc(id)
      .delete();

    // DELETE CONVERSATION TOO
    (
      await firestore
        .collection("conversations")
        .where("type", "==", "textRoom")
        .where("accessIds", "array-contains", id)
        .get()
    ).forEach((c) => c.ref.delete());
  }

  return (
    <ListWrapper>
      {isOwner && (
        <StandardItem
          text="Create room"
          icon={FaPlus}
          onClick={() => setIsCreateModalOpen(true)}
        />
      )}
      {values.map(({ id, name }: any) => (
        <StandardItem
          key={id}
          text={name}
          icon={FaHashtag}
          active={id === roomId}
          onClick={() => onTextRoomClick(id)}
          subIcons={[
            {
              iconComponent: FaCog,
              onClick: () => setSettingsModalId(id),
              show: isOwner,
            },
          ]}
        />
      ))}
      <CreateRoomModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        serverId={serverId}
      />
      <RoomModal
        isOpen={Boolean(settingsModalId)}
        onRequestClose={() => setSettingsModalId("")}
        onUpdate={({ name }: any) => updateRoom(settingsModalId, name)}
        onDelete={() => deleteRoom(settingsModalId)}
      />
    </ListWrapper>
  );
};

export default RoomList;
