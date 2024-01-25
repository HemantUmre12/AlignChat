import React, { useState } from "react";
import useWebSocket from "react-use-websocket";
import useCrud from "../../hooks/useCrud";
import { Server } from "../../@type/server";
import MessageInterfaceChannels from "./MessageInterfaceChannels";
import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Scroll from "./Scroll";
import useAuthServiceContext from "../../context/useAuthServiceContext";

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface SendMessageData {
  type: string;
  message: string;
  // [key: string]: any;
}

interface Props {
  activeServer: Server;
  channelId: string;
}

const MessageInterface: React.FC<Props> = (props) => {
  const theme = useTheme();

  const { logout, refreshAccessToken } = useAuthServiceContext();
  const [reconnectionAttempt, setReconnectionAttempt] = useState(0);
  const maxConnectionAttempt = 4;

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    sendJsonMessage({
      type: "message",
      message,
    } as SendMessageData);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendJsonMessage({
        type: "message",
        message,
      } as SendMessageData);
    }
  };

  const formatTimeStamp = (timestamp: string): string => {
    const date = new Date(Date.parse(timestamp));
    const formattedDate = `${date.getDate()}/${
      date.getMonth() + 1
    }/${date.getFullYear()}`;

    const formattedTime = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    return `${formattedDate} at ${formattedTime}`;
  };

  return (
    <>
      <MessageInterfaceChannels
        activeServer={props.activeServer}
        channelId={props.channelId}
      />

      {/* Messages */}
      <Scroll>
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {newMessage.map((msg: Message, index: number) => {
            return (
              <ListItem key={index} alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="user image" />
                </ListItemAvatar>
                <ListItemText
                  primaryTypographyProps={{
                    fontSize: "12px",
                    variant: "body2",
                  }}
                  primary={
                    <>
                      <Typography
                        component="span"
                        variant="body1"
                        color="text.primary"
                        sx={{ display: "inline", fontW: 600 }}
                      >
                        {msg.sender}
                      </Typography>
                      <Typography
                        component="span"
                        variant="caption"
                        color="textSecondary"
                      >
                        {" at "}
                        {formatTimeStamp(msg.timestamp)}
                      </Typography>
                    </>
                  }
                  secondary={
                    <>
                      <Typography
                        variant="body1"
                        style={{
                          overflow: "visible",
                          whiteSpace: "normal",
                          textOverflow: "clip",
                        }}
                        sx={{
                          display: "inline",
                          lineHeight: 1.2,
                          fontWeight: 400,
                          letterSpacing: "-0.2px",
                        }}
                        component="span"
                        color="text.primary"
                      >
                        {msg.content}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            );
          })}
        </List>
      </Scroll>

      {/* Textarea */}
      <Box sx={{ position: "sticky", bottom: 0, width: "100%" }}>
        <form
          onSubmit={handleSubmit}
          style={{
            bottom: 0,
            right: 0,
            padding: "1rem",
            backgroundColor: theme.palette.background.default,
            zIndex: 1,
          }}
        >
          <Box sx={{ display: "flex" }}>
            <TextField
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              sx={{ flexGrow: 1 }}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
            ></TextField>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default MessageInterface;
