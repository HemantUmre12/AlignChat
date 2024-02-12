import { useState } from "react";
import useWebSocket from "react-use-websocket";
import useAuthServiceContext from "../context/useAuthServiceContext";
import useCrud from "../hooks/useCrud";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

const useChatService = (channelId: string, serverId: number) => {
  const { logout, refreshAccessToken } = useAuthServiceContext();
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);
  const maxConnectionAttempt = 4;

  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const { fetchData } = useCrud<Message>(
    [],
    `/messages/?channel_id=${channelId}`
  );

  const socketURL = `ws://157.245.158.180/${serverId}/${channelId}`;

  // Establish a Websocket connection with the server
  const { sendJsonMessage } = useWebSocket(socketURL, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
        console.log("Connected 🔗");
      } catch (error) {
        console.log(error);
      }
    },
    onClose: (event: CloseEvent) => {
      if (event.code === 4001) {
        console.log("Authentication Error");
        refreshAccessToken().catch((error) => {
          if (error.response && error.response.status === 401) {
            logout();
          }
        });
      }

      setReconnectionAttempt((prevAttempt) => prevAttempt + 1);

      console.log("Closed 🚫");
    },
    onError: () => {
      console.log("Error ☢️");
    },
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      const new_message = data.new_message;
      setNewMessage((prevMessage) => [...prevMessage, new_message]);
      setMessage("");
    },
    shouldReconnect: (closeEvent) => {
      if (
        closeEvent.code === 4001 &&
        reconnectionAttempt >= maxConnectionAttempt
      ) {
        setReconnectionAttempt(0);
        return false;
      }

      return true;
    },
    reconnectInterval: 1000,
  });

  return {
    newMessage,
    message,
    setMessage,
    sendJsonMessage,
  };
};

export default useChatService;
