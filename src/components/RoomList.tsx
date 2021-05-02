import React, { FC, useState } from "react";
import { FaPlus, FaHashtag, FaVolumeDown } from "react-icons/fa";
import { useAuth } from "../providers/AuthProvider";
import CreateRoomModal from "./CreateRoomModal";
import ItemWithImage from "./ItemWithImage";
import ListWrapper from "./ListWrapper";
import StandardItem from "./StandardItem";

interface Props {
  serverId: string;
  roomId: string;
  server: any;
  // values: Array<{ id: string; name: string; type: string }>;
  onTextRoomClick: Function;
  onVoiceRoomClick: Function;
}

const RoomList: FC<Props> = ({
  serverId,
  roomId,
  server,
  onTextRoomClick,
  onVoiceRoomClick,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();

  return (
    <ListWrapper>
      {user.auth.uid === server.owner && (
        <StandardItem
          text="Create room"
          icon={FaPlus}
          onClick={() => setIsOpen(true)}
        />
      )}
      {server.rooms.map(({ id, name, type }: any) => (
        <>
          {type === "text" ? (
            <StandardItem
              text={name}
              icon={FaHashtag}
              active={id === roomId}
              onClick={() => onTextRoomClick(id)}
            />
          ) : (
            type === "voice" && (
              <div>
                <StandardItem
                  text={name}
                  icon={FaVolumeDown}
                  active={id === roomId}
                  onClick={() => onVoiceRoomClick(id)}
                />
                <ItemWithImage
                  text="User"
                  imageSrc="https://picsum.photos/id/2/200"
                  style={{ marginLeft: "32px", marginTop: "12px" }}
                />
              </div>
            )
          )}
        </>
      ))}
      <CreateRoomModal
        isOpen={isOpen}
        onRequestClose={() => setIsOpen(false)}
        serverId={serverId}
      />
    </ListWrapper>
  );
};

export default RoomList;
