import {
  Avatar,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import useCrud from "../../hooks/useCrud";
import { Link } from "react-router-dom";
import { MEDIA_URL } from "../../config";

interface Server {
  id: number;
  name: string;
  category: number;
  owner: number;
  description: string | null;
  icon: string | null;
  banner: string | null;
  channel_server: [];
}

type Props = {
  open: boolean;
};

const PopularChannels: React.FC<Props> = (props) => {
  const { dataCRUD, fetchData } = useCrud<Server>([], "/server/select/");

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box
        sx={{
          height: 50,
          p: 2,
          display: "flex",
          alignItems: "center",
          flex: "1 1 100%",
        }}
      >
        <Typography sx={{ display: props.open ? "block" : "none" }}>
          Popular
        </Typography>
      </Box>
      <List>
        {dataCRUD.map((item) => (
          <ListItem
            key={item.id}
            disablePadding
            sx={{ display: "block" }}
            dense={true}
          >
            <Link
              to={`/server/${item.id}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ListItemButton sx={{ minHeight: 0 }}>
                <ListItemIcon sx={{ minWidth: 0, justifyContent: "center" }}>
                  <ListItemAvatar sx={{ minWidth: "50px" }}>
                    <Avatar
                      alt="Server icon"
                      src={`${MEDIA_URL}${item.icon}`}
                    />
                  </ListItemAvatar>
                </ListItemIcon>

                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 700,
                        lineHeight: 1.2,
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.name}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      sx={{
                        fontWeight: 500,
                        lineHeight: 1.2,
                        color: "textSecondary",
                      }}
                    >
                      {item.category}
                    </Typography>
                  }
                  sx={{ opacity: props.open ? 1 : 0 }}
                  primaryTypographyProps={{
                    sx: {
                      textOverflow: "ellipsis",
                      overflow: "hidden",
                      whitespace: "nowrap",
                    },
                  }}
                />
              </ListItemButton>
            </Link>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default PopularChannels;
