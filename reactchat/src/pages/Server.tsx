import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import MessageInterface from "../components/Main/MessageInterface";
import ServerChannels from "../components/SecondaryDraw/ServerChannels";
import UserServers from "../components/PrimaryDraw/UserServers";
import { useNavigate, useParams } from "react-router-dom";
import useCrud from "../hooks/useCrud";
import { useEffect } from "react";
import { Server } from "../@type/server.d";

const Server = () => {
  // Fetch Data
  const { serverId, channelId } = useParams();
  const { dataCRUD, error, fetchData } = useCrud<Server>(
    [],
    `/server/select/?by_serverID=${serverId}`
  );
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!isChannel()) {
      navigate(`/server/${serverId}`);
    }
  }, []);

  // Navigate to home page incase unable to fetch server data
  const navigate = useNavigate();
  if (error !== null && error.message === "400") {
    navigate("/");
    return null;
  }

  // Check if the channelId is valid by searching for it
  // in the data fetched from API
  const isChannel = (): boolean => {
    if (!channelId) {
      return true;
    }

    return dataCRUD.some((server) => {
      server.channel_server.some(
        (channel) => channel.id === parseInt(channelId)
      );
    });
  };

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
        <ServerChannels
          data={dataCRUD}
          serverId={parseInt(serverId ?? "")}
        ></ServerChannels>
      </SecondaryDraw>
      <Main>
        <MessageInterface></MessageInterface>
      </Main>
    </Box>
  );
};

export default Server;
