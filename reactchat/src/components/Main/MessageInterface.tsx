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
import useChatService from "../../services/chatService";

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

  const { newMessage, message, setMessage, sendJsonMessage } = useChatService(
    props.channelId,
    props.activeServer.id
  );

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
