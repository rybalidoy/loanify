import { Box, IconButton } from "@mui/material";
import Sidebar from "../components/Sidebar";
import { useIsAuthenticated } from "../hooks/authHook";
import TopNavbar from "../components/TopNavbar";
import { useTheme } from "@mui/material";

const AppLayout = ({ children, toggleTheme, mode }) => {
  const theme = useTheme();
  const { user } = useIsAuthenticated();

  return (
    <Box
      height="100vh"
      overflow="hidden"
      bgcolor={theme.palette.background.default}
      display="flex" // Use Flexbox for layout
    >
      {/* Sidebar */}
      <Box
        width={{xs: "20%", lg: "16.6667%"}}
        bgcolor={theme.palette.background.paper}
        height="100%"
      >
        <Sidebar />
      </Box>

      {/* Main Content */}
      <Box
        flex={1}
        height="100%"
        bgcolor={theme.palette.background.default}
        overflow="hidden"
      >
        {/* Top Navigation */}
        <TopNavbar user={user} />

        {/* Page Content */}
        <Box
          padding={2}
          height="calc(100% - 64px)" // Adjust for TopNavbar height
          overflow="auto"
          width={{ xs: '100%', sm: '100%', md: '99%', lg: '95%'}}
          margin="auto"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AppLayout;