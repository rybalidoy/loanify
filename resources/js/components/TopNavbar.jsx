import { Box, IconButton, Typography, Avatar, Menu, MenuItem } from "@mui/material";
import {
  UserCircleIcon,
  ArrowRightEndOnRectangleIcon,
  BellAlertIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useTheme } from "@mui/material/styles";
import { capitalizeEachWord } from "../utils/stringHelpers";
import { useState, useEffect, useRef } from "react";
import { logout } from "../api/auth";
import { useNavigate } from "react-router-dom";
import ThemeSwitcher from "../components/ThemeSwitcher";

const TopNavbar = ({ user }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const menuRef = useRef(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    const response = await logout();
    console.log(response);
    handleMenuClose();

    if (response?.status === 200) {
      navigate("/login");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        handleMenuClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuRef]);

  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      gap={2}
      bgcolor={theme.palette.background.toolbar}
    >
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        width={"95%"}
        margin={"auto"}
        justifyContent="flex-end"
      >
        <IconButton
          variant="outlined"
          sx={{
            borderRadius: "50%",
            color: theme.palette.primary.main,
            borderColor: theme.palette.primary.main,
          }}
        >
          <BellAlertIcon width={20} />
        </IconButton>
        <Box
          display="flex"
          alignItems="center"
          gap={1}
          onClick={handleMenuOpen}
          sx={{ cursor: "pointer", color: theme.palette.text.primary }}
        >
          <Box
            padding={2}
            display="flex"
            flexDirection="column"
            alignItems="flex-start"
            gap={0.5}
          >
            <Typography level="body1" fontSize={12}>
              {capitalizeEachWord(user?.name)}
            </Typography>
            <Typography level="body2" fontSize={12}>
              {user?.email}
            </Typography>
          </Box>
          <Avatar />
          <ChevronDownIcon width={16} />
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          sx={{ mt: 1 }}
          ref={menuRef}
        >
          <MenuItem onClick={handleMenuClose} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <UserCircleIcon width={24} />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleMenuClose} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Cog6ToothIcon width={24} />
            Account Settings
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <ArrowRightEndOnRectangleIcon width={24} />
            Logout
          </MenuItem>
        </Menu>
        <ThemeSwitcher />
      </Box>
    </Box>
  );
};

export default TopNavbar;
