import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";
const GuestLayout = () => {
  return (
    <Box>
      <Outlet/>
    </Box>
  );
}
export default GuestLayout;