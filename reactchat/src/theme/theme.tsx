import { createTheme, responsiveFontSizes } from "@mui/material";

declare module "@mui/material/styles" {
  interface Theme {
    primaryAppBar: {
      height: number;
    };
    primaryDraw: {
      width: number;
      closed: number;
    };
  }
  interface ThemeOptions {
    primaryAppBar: {
      height: number;
    };
    primaryDraw: {
      width: number;
      closed: number;
    };
  }
}

export const createMuiTheme = () => {
  let theme = createTheme({
    primaryAppBar: {
      height: 50,
    },
    primaryDraw: {
      width: 240,
      closed: 70,
    },
    typography: {
      fontFamily: ["IBM Plex Sans", "sans-serif"].join(","),
    },
    components: {
      MuiAppBar: {
        defaultProps: {
          color: "default",
          elevation: 0,
        },
      },
    },
  });
  theme = responsiveFontSizes(theme);
  return theme;
};

export default createMuiTheme;
