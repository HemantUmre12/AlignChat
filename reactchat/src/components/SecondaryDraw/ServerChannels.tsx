import { useTheme } from "@mui/material/styles";
import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Server, Channel } from "../../@type/server.d";

interface Props {
  data: Server[];
  serverId: number;
}

const ServerChannels: React.FC<Props> = (props) => {
  const activeServer: Server | undefined = props.data.find(
    (server) => server.id === props.serverId
  );
  const data: Channel[] = activeServer?.channel_server ?? [];

  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          height: "50px",
          display: "flex",
          alignItems: "center",
          px: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: "sticky",
          backgroundColor: theme.palette.background.default,
        }}
      >
        <Typography
          variant="body1"
          style={{
            textOverflow: "ellipsis",
            overflow: "hidden",
            whiteSpace: "nowrap",
          }}
        >
          {activeServer?.name ?? "Server"}
        </Typography>
      </Box>

      <List sx={{ py: 0 }}>
        {data.map((item) => (
          <ListItem
            disablePadding
            key={item.id}
            sx={{ display: "block", maxHeight: "40px" }}
            dense={true}
          >
            <Link
              to={`/server/${props.serverId}/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 48 }}>
                <ListItemText
                  primary={
                    <Typography
                      variant="body1"
                      textAlign="start"
                      paddingLeft={1}
                    >
                      {item.name}
                    </Typography>
                  }
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default ServerChannels;
