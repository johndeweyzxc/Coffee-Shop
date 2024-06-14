import { AppBar, Container, Box, Button } from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LogoutIcon from "@mui/icons-material/Logout";

import { ABOUT_PAGE, CART_PAGE, MENU_PAGE } from "../../strings";
import StarbucksLogo from "../../assets/images/starbucks-logo.png";

interface HeaderBarProps {
  isLoggedIn: boolean;
  currentPage: string;
  signInWithGoogle: () => void;
  signOutWithGoogle: () => void;
}
export default function HeaderBar(props: HeaderBarProps) {
  return (
    <AppBar sx={{ backgroundColor: "white" }} position="static">
      <Container maxWidth="xl" sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ flexGrow: 1, display: "flex", alignItems: "center" }}>
          <img
            alt="Starbucks logo"
            src={StarbucksLogo}
            style={{
              width: "50px",
              borderRadius: "50%",
              marginRight: "1rem",
              marginTop: "1rem",
              marginBottom: "1rem",
            }}
          />
          <Button
            variant="text"
            sx={{
              color: `${props.currentPage === MENU_PAGE ? "green" : "gray"}`,
              marginRight: "1rem",
            }}
            size="large"
            onClick={() =>
              (window.location.href = `/${MENU_PAGE.toLowerCase()}`)
            }
          >
            {MENU_PAGE}
          </Button>
          <Button
            variant="text"
            sx={{
              color: `${props.currentPage === CART_PAGE ? "green" : "gray"}`,
              marginRight: "1rem",
            }}
            size="large"
            onClick={() =>
              (window.location.href = `/${CART_PAGE.toLowerCase()}`)
            }
          >
            {CART_PAGE}
          </Button>
          <Button
            variant="text"
            sx={{
              color: `${props.currentPage === ABOUT_PAGE ? "green" : "gray"}`,
              marginRight: "1rem",
            }}
            size="large"
            onClick={() =>
              (window.location.href = `/${ABOUT_PAGE.toLowerCase()}`)
            }
          >
            {ABOUT_PAGE}
          </Button>
        </Box>
        {props.isLoggedIn ? (
          <Button
            variant="outlined"
            sx={{
              marginRight: "1rem",
              flexGrow: 0,
            }}
            size="medium"
            color="error"
            onClick={() => props.signOutWithGoogle()}
            startIcon={<LogoutIcon />}
          >
            LOG OUT
          </Button>
        ) : (
          <Button
            variant="text"
            sx={{
              marginRight: "1rem",
              flexGrow: 0,
            }}
            size="medium"
            color="info"
            startIcon={<GoogleIcon />}
            onClick={() => props.signInWithGoogle()}
          >
            LOGIN WITH GOOGLE
          </Button>
        )}
      </Container>
    </AppBar>
  );
}
