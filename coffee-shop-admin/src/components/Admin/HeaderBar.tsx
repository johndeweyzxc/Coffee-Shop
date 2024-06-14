import { AppBar, Box, Button, Container } from "@mui/material";
import StarbucksLogo from "../../assets/images/starbucks-logo.png";
import {
  ADMIN_NEW_PRODUCT,
  ADMIN_ORDER_TAB,
  ADMIN_PRODUCT_TAB,
} from "../../strings";
import AddIcon from "@mui/icons-material/Add";
import LogoutIcon from "@mui/icons-material/Logout";
import { SIGNOUT_STATUS } from "../../status";

interface HeaderBarProps {
  onSelectedNav: (name: string) => void;
  signOut: (cb: (status: SIGNOUT_STATUS) => void) => void;
}
export default function Headerbar(props: HeaderBarProps) {
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
              color: "green",
              marginRight: "1rem",
            }}
            size="large"
            onClick={() => props.onSelectedNav(ADMIN_ORDER_TAB)}
          >
            ORDERS
          </Button>
          <Button
            variant="text"
            sx={{
              color: "green",
              marginRight: "1rem",
            }}
            size="large"
            onClick={() => props.onSelectedNav(ADMIN_PRODUCT_TAB)}
          >
            PRODUCTS
          </Button>
        </Box>
        <Button
          variant="contained"
          sx={{
            color: "white",
            marginRight: "1rem",
            flexGrow: 0,
          }}
          size="medium"
          color="success"
          startIcon={<AddIcon />}
          onClick={() => props.onSelectedNav(ADMIN_NEW_PRODUCT)}
        >
          NEW PRODUCT
        </Button>
        <Button
          variant="outlined"
          sx={{
            marginRight: "1rem",
            flexGrow: 0,
          }}
          color="error"
          startIcon={<LogoutIcon />}
          size="medium"
          onClick={() => {
            const onSignedOut = (status: SIGNOUT_STATUS) => {
              // TODO: Implementation
            };
            props.signOut(onSignedOut);
            window.location.href = "/";
          }}
        >
          LOGOUT
        </Button>
      </Container>
    </AppBar>
  );
}
