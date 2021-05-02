import { createContext, FC, useContext, useState } from "react";

interface ContextProps {}

const WebRTCContext = createContext({} as ContextProps);

export const useWebRTC = () => useContext(WebRTCContext);

const WebRTCProvider: FC = ({ children }) => {
  const servers = {
    iceServers: [
      {
        urls: [
          "stun:stun1.l.google.com:19302",
          "stun:stun2.l.google.com:19302",
        ],
      },
    ],
    iceCandidatePoolSize: 10,
  };
  const pc = new RTCPeerConnection(servers);
  let localStream;
  let remoteStreams: Array<any> = [];

  const value = { pc, localStream, remoteStreams };

  return (
    <WebRTCContext.Provider value={value}>{children}</WebRTCContext.Provider>
  );
};

export default WebRTCProvider;
