import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import PopularChannels from "../components/PrimaryDraw/PopularChannels";
import ExploreCategories from "../components/SecondaryDraw/ExploreCategories";

const Home = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <PrimaryAppBar />
      {/* Using  Render Prop design pattern*/}
      <PrimaryDraw>
        {(open: boolean) => <PopularChannels open={open} />}
      </PrimaryDraw>
      <SecondaryDraw>
        <ExploreCategories />
      </SecondaryDraw>
      <Main />
    </Box>
  );
};

export default Home;
