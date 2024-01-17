import { useState } from "react";
import useWebSocket from "react-use-websocket";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@type/server";
import MessageInterfaceChannels from "./MessageInterfaceChannels";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface Props {
  activeServer: Server;
  channelId: string;
}

const MessageInterface: React.FC<Props> = (props) => {
  const [newMessage, setNewMessage] = useState<Message[]>([]);
  const [message, setMessage] = useState("");
  const { fetchData } = useCrud<Message>(
    [],
    `/messages/?channel_id=${props.channelId}`
  );

  const socketURL = `ws://127.0.0.1:8000/${props.activeServer.id}/${props.channelId}`;

  // Establish a Websocket connection with the server
  const { sendJsonMessage } = useWebSocket(socketURL, {
    onOpen: async () => {
      try {
        const data = await fetchData();
        setNewMessage([]);
        setNewMessage(Array.isArray(data) ? data : []);
        console.log("Connected🔗");
      } catch (error) {
        console.log(error);
      }
    },
    onClose: () => {
      console.log("Closed🚫");
    },
    onError: () => {
      console.log("Error☢️");
    },
    onMessage: (msg) => {
      const data = JSON.parse(msg.data);
      const new_message = data.new_message;
      setNewMessage((prevMessage) => [...prevMessage, new_message]);
    },
  });

  const handleSendMessage = () => {
    sendJsonMessage({ type: "message", message });
    setMessage("");
  };

  return (
    <>
      <MessageInterfaceChannels
        activeServer={props.activeServer}
        channelId={props.channelId}
      />

      <div>
        {newMessage.map((msg: Message, index: number) => {
          return (
            <div key={index}>
              <p>{msg.content}</p>
            </div>
          );
        })}

        <form>
          <label>
            Enter message:
            <input
              type="text"
              onChange={(e) => setMessage(e.target.value)}
              value={message}
            ></input>
          </label>
        </form>

        <button onClick={handleSendMessage}>Send Message</button>
      </div>
    </>
  );
};

export default MessageInterface;
