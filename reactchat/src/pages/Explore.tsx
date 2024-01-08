import { Box, CssBaseline } from "@mui/material";
import PrimaryAppBar from "./templates/PrimaryAppBar";
import PrimaryDraw from "./templates/PrimaryDraw";
import SecondaryDraw from "./templates/SecondaryDraw";
import Main from "./templates/Main";
import PopularChannels from "../components/PrimaryDraw/PopularChannels";
import ExploreCategories from "../components/SecondaryDraw/ExploreCategories";
import ExploreServer from "../components/Main/ExploreServer";

const Explore = () => {
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
      <Main>
        <ExploreServer />
      </Main>
    </Box>
  );
};

export default Explore;
