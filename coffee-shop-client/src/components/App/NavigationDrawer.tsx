import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import HomeIcon from "@mui/icons-material/Home";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import InfoIcon from "@mui/icons-material/Info";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { HOME_PAGE, NAV_LIST } from "../../strings";
import "./styles/NavigationDrawer.css";

interface UserInfoProps {
  userPhotoUrl: string | null;
  userEmail: string | null;
}
const UserInfo = (props: UserInfoProps) => {
  const ProfilePicture = () => {
    if (props.userPhotoUrl?.length === 0 && props.userEmail?.length === 0) {
      return (
        <Avatar
          alt="User profile"
          sx={{
            marginRight: ".5rem",
            height: "2rem",
            width: "2rem",
            bgcolor: "var(--md-sys-color-primary)",
          }}
        >
          <AccountCircleIcon />
        </Avatar>
      );
    } else if (props.userPhotoUrl?.length !== 0) {
      return (
        <Avatar
          alt="User profile"
          src={props.userPhotoUrl as string}
          sx={{
            marginRight: ".5rem",
            height: "2rem",
            width: "2rem",
          }}
        />
      );
    }

    const firstLetter = props.userEmail?.charAt(0);
    return (
      <Avatar
        sx={{
          marginRight: ".5rem",
          height: "2rem",
          width: "2rem",
          padding: "1.25rem",
          bgcolor: "var(--md-sys-color-primary)",
        }}
      >
        {firstLetter?.toUpperCase()}
      </Avatar>
    );
  };

  return (
    <div className="user-info-nav-drawer">
      <ProfilePicture />
      {props.userEmail === "" ? "Guest" : props.userEmail}
    </div>
  );
};

interface AuthButtonProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogOut: () => void;
  userEmail: string | null;
}
const AuthButtons = (props: AuthButtonProps) => {
  const onButtonLoginClicked = () => {
    props.userEmail === "" ? props.onOpenLogin() : props.onLogOut();
  };
  const renderLoginIcon = () => {
    return props.userEmail === "" ? <LoginIcon /> : <LogoutIcon />;
  };

  return (
    <>
      <ListItem disablePadding>
        <ListItemButton onClick={onButtonLoginClicked}>
          <ListItemIcon>{renderLoginIcon()}</ListItemIcon>
          <ListItemText primary={props.userEmail === "" ? "Login" : "Logout"} />
        </ListItemButton>
      </ListItem>
      <ListItem disablePadding>
        <ListItemButton onClick={props.onOpenRegister}>
          <ListItemIcon>
            <PersonAddIcon />
          </ListItemIcon>
          <ListItemText>Register</ListItemText>
        </ListItemButton>
      </ListItem>
    </>
  );
};

interface NavigationDrawerProps {
  onCloseDrawer: () => void;
  isOpenDrawer: boolean;
  userEmail: string | null;
  userPhotoUrl: string | null;
  onChangeCurrentPage: (page: string) => void;
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  onLogOut: () => void;
}
export default function NavigationDrawer(props: NavigationDrawerProps) {
  const onClickedNavItem = (nav: string) => {
    props.onChangeCurrentPage(nav);
    const path = nav === HOME_PAGE ? "/" : `/${nav.toLowerCase()}`;
    window.location.href = path;
  };
  const buttonIcon = [
    <HomeIcon />,
    <MenuBookIcon />,
    <ShoppingCartIcon />,
    <ShoppingBasketIcon />,
    <InfoIcon />,
  ];
  const renderNav = (nav: string, index: number) => {
    return (
      <ListItem key={nav} disablePadding>
        <ListItemButton onClick={() => onClickedNavItem(nav)}>
          <ListItemIcon>{buttonIcon[index]}</ListItemIcon>
          <ListItemText primary={nav} sx={{ textTransform: "none" }} />
        </ListItemButton>
      </ListItem>
    );
  };

  return (
    <Drawer
      anchor="right"
      open={props.isOpenDrawer}
      onClose={() => props.onCloseDrawer()}
      sx={{ backdropFilter: "blur(5px)" }}
    >
      <Box
        role="presentation"
        onClick={() => props.onCloseDrawer()}
        onKeyDown={() => props.onCloseDrawer()}
      >
        <UserInfo
          userEmail={props.userEmail}
          userPhotoUrl={props.userPhotoUrl}
        />
        <Divider />
        <List>{NAV_LIST.map((nav, index) => renderNav(nav, index))}</List>
        <Divider />
        <List>
          <AuthButtons
            onOpenLogin={props.onOpenLogin}
            onLogOut={props.onLogOut}
            userEmail={props.userEmail}
            onOpenRegister={props.onOpenRegister}
          />
        </List>
      </Box>
    </Drawer>
  );
}
