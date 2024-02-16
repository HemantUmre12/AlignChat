import {
  AppBar,
  Avatar,
  Box,
  Drawer,
  IconButton,
  ListItemAvatar,
  Toolbar,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Channel, Server } from "../../@type/server";
import { useTheme } from "@mui/material/styles";
import { MEDIA_URL } from "../../config";
import { MoreVertOutlined } from "@mui/icons-material";
import ServerChannels from "../SecondaryDraw/ServerChannels";
import { useEffect, useState } from "react";

interface Props {
  activeServer: Server;
  channelId?: string;
}

const MessageInterfaceChannels: React.FC<Props> = (props) => {
  const theme = useTheme();
  const serverChannels = props.activeServer.channel_server;

  const getActiveChannelName = () => {
    const activeChannel: Channel | undefined = serverChannels.find(
      (channel) => channel.id === parseInt(props.channelId ?? "")
    );

    return activeChannel?.name ?? "Home";
  };
  const activeChannelName = getActiveChannelName();

  const [sideMenu, setSideMenu] = useState(false);
  const toggleDrawer = (state: boolean) => {
    setSideMenu(state);
  };

  const isSmallScreen = useMediaQuery(theme.breakpoints.up("sm"));
  useEffect(() => {
    if (isSmallScreen && sideMenu) {
      toggleDrawer(false);
    }
  }, [isSmallScreen, sideMenu]);

  const list = () => (
    <Box
      sx={{ minWidth: 200, paddingTop: `${theme.primaryAppBar.height}px` }}
      role="presentation"
      onClick={() => toggleDrawer(false)}
      onKeyDown={() => toggleDrawer(false)}
    >
      <ServerChannels activeServer={props.activeServer} />
    </Box>
  );

  return (
    <>
      <AppBar
        sx={{
          backgroundColor: theme.palette.background.default,
          borderBottom: `1px solid ${theme.palette.divider}`,
          flexDirection: "row",
        }}
        color="default"
        position="sticky"
        elevation={0}
      >
        <Toolbar
          variant="dense"
          sx={{
            minHeight: theme.primaryAppBar.height,
            height: theme.primaryAppBar.height,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: { xs: "block", sm: "none" } }}>
            <ListItemAvatar sx={{ minWidth: "40px" }}>
              <Avatar
                alt="Server Icon"
                src={`${MEDIA_URL}${props.activeServer.icon}`}
                sx={{ width: 30, height: 30 }}
              />
            </ListItemAvatar>
          </Box>
          <Typography noWrap component="div" textTransform="capitalize">
            {activeChannelName}
          </Typography>
        </Toolbar>

        <Box sx={{ flexGrow: 1 }}></Box>

        <Box
          sx={{ display: { xs: "block", sm: "none" } }}
          onClick={() => toggleDrawer(true)}
        >
          <IconButton color="inherit" edge="end">
            <MoreVertOutlined />
          </IconButton>
        </Box>

        <Drawer open={sideMenu} onClose={() => toggleDrawer(false)}>
          <Box>{list()}</Box>
        </Drawer>
      </AppBar>
    </>
  );
};

export default MessageInterfaceChannels;
