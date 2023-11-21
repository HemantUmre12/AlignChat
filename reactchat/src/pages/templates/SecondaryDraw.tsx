import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useAxiosWithInterceptor from "../../helpers/jwtinterceptor";

const SecondaryDraw = () => {
  const theme = useTheme();
  const jwtAxios = useAxiosWithInterceptor();

  // Testing custom Axios instance
  jwtAxios
    .get("http://127.0.0.1:8000/api/server/select/?category=cat-1")
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });

  return (
    <Box
      sx={{
        mt: `${theme.primaryAppBar.height}px`,
        height: `calc(100vh - ${theme.primaryAppBar.height}px)`,
        width: `${theme.secondaryDraw.width}px`,
        borderRight: `1px solid ${theme.palette.divider}`,
        display: { xs: "none", sm: "block" },
        overflow: "auto",
      }}
    >
      {[...Array(100)].map((_, i) => {
        return (
          <Typography key={i + 1} paragraph>
            {i}
          </Typography>
        );
      })}
    </Box>
  );
};

export default SecondaryDraw;
