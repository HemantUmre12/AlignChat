import { Box, Typography } from "@mui/material";
import { Server } from "../../@type/server";
import MessageInterfaceChannels from "./MessageInterfaceChannels";

type Props = {
  activeServer: Server;
};

const ServerLanding: React.FC<Props> = (props) => {
  return (
    <>
      <MessageInterfaceChannels activeServer={props.activeServer} />

      <Box
        sx={{
          overflow: "hidden",
          p: { xs: 0 },
          height: `calc(80vh)`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography
            variant="h4"
            fontWeight={700}
            letterSpacing={"-0.5px"}
            sx={{ px: 5 }}
          >
            Welcome to {props.activeServer.name}
          </Typography>

          <Typography>{props.activeServer.description}</Typography>
        </Box>
      </Box>
    </>
  );
};

export default ServerLanding;
