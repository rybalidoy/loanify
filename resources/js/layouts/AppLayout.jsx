import { Box, Grid } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useIsAuthenticated } from "../hooks/authHook";

import TopNavbar from "../components/TopNavbar";
import { useTheme } from "@mui/material";

const AppLayout = ({ children }) => {
  const theme = useTheme();
  const { user } = useIsAuthenticated();

  return (
    <Box height="100vh" overflow="hidden" bgcolor={theme.palette.background.default}>
      <Grid container height="100%">
        <Grid item xs={2} bgcolor={theme.palette.background.primary} height={"100%"}>
          <Sidebar />
        </Grid>
        <Grid item xs={10} height={"100%"}  backgroundColor={theme.palette.background.default}>
          <TopNavbar user={user} />
          <Box padding={2} height="calc(100% - 64px)" overflow="auto" width={"90%"} margin={"auto"}>
            {children}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default AppLayout;