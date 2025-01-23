import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { ChevronRightIcon, CreditCardIcon } from "@heroicons/react/24/solid";
import AppRoutes from "../routes/AppRoutes";
import { useTheme } from "@mui/material/styles";

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();

  return (
    <Box>
      <Box padding={2}>
        <Link to={'/dashboard'}>
          <Button
            variant="text"
            fullWidth
            sx={{
              textAlign: "left",
              color: theme.palette.text.primary,
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Box display={'flex'} alignItems={'center'} gap={1} justifyContent={'flex-start'}>
              <CreditCardIcon width={40} />
              <Typography variant="h6" sx={{ width: "100%", color: "inherit" }}>
                Loanify
              </Typography>
            </Box>
          </Button>
        </Link>
      </Box>
      <Box width={'90%'} padding={2} margin={'auto'}>
        <Box paddingX={1}>
          <Typography variant="h6" fontSize={12} sx={{ color: theme.palette.text.secondary }}>
            MENU
          </Typography>
        </Box>
        <List>
        {AppRoutes.filter(route => !route.exclude).map((route) => (
          <ListItem key={route.path} disablePadding>
            <ListItemButton
              component={Link}
              to={route.path}
              sx={{
                color: theme.palette.text.primary,
                backgroundColor: location.pathname === `/${route.path}` ? theme.palette.action.selected : 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent',
                },
                display: 'flex', // Add this
                alignItems: 'center', // Add this
              }}
            >
              {route?.icon && (
                <Box sx={{ marginRight: 2, display: 'flex', alignItems: 'center' }}>
                  {route.icon}
                </Box>
              )}
              <ListItemText primary={route.label} sx={{fontSize: '0.2rem'}}/>
              {route?.children && <ChevronRightIcon width={24} />}
            </ListItemButton>
          </ListItem>
        ))}
        </List>
      </Box>
    </Box>
  );
};

export default Sidebar;
