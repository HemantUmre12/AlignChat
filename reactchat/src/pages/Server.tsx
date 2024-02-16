import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import MessageInterface from "../components/Main/MessageInterface";
import ServerChannels from "../components/SecondaryDraw/ServerChannels";
import { useNavigate, useParams } from "react-router-dom";
import useCrud from "../hooks/useCrud";
import { useEffect } from "react";
import { Server } from "../@type/server.d";
import ServerLanding from "../components/Main/ServerLanding";
import LoadingScreen from "./templates/LoadingScreen";
import UserServers from "../components/PrimaryDraw/UserServers";

// TODO: Refactor
const Server = () => {
  const { serverId, channelId } = useParams();

  // Fetch the server data
  const { dataCRUD, error, fetchData } = useCrud<Server>(
    [],
    `/server/select/?by_serverID=${serverId}`
  );

  useEffect(() => {
    fetchData();
  }, [serverId]);

  // Navigate to home page incase unable to fetch server data
  const navigate = useNavigate();
  useEffect(() => {
    if (!isValidChannel()) {
      navigate(`/server/${serverId}`);
    }
  }, []);

  if (error !== null && error.message === "400") {
    navigate("/");
    return null;
  }

  // Check if the channelId is valid by searching for it
  // in the data fetched from API
  const isValidChannel = (): boolean => {
    if (!channelId) {
      return true;
    }

    return dataCRUD.some((server) => {
      server.channel_server.some(
        (channel) => channel.id === parseInt(channelId)
      );
    });
  };

  // !! Fix this !!
  if (!dataCRUD.length) {
    return <LoadingScreen />;
  }

  // TODO: Remove incase not needed
  if (dataCRUD.length !== 1) {
    console.log("Unexpected Server Result");
  }

  const activeServer: Server = dataCRUD[0];

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      {/* Using  Render Prop design pattern*/}
      <PrimaryDraw>
        {(open: boolean) => (
          <UserServers open={open} data={dataCRUD}></UserServers>
        )}
      </PrimaryDraw>
      <SecondaryDraw>
        <ServerChannels activeServer={activeServer} />
      </SecondaryDraw>
      <Main>
        {channelId ? (
          <MessageInterface activeServer={activeServer} channelId={channelId} />
        ) : (
          <ServerLanding activeServer={activeServer} />
        )}
      </Main>
    </Box>
  );
};

export default Server;
