import {
  Avatar,
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { ABOUT_PAGE, CART_PAGE, HOME_PAGE, MENU_PAGE } from "../../strings";

interface UserInfoProps {
  userPhotoUrl: string | null;
  userEmail: string | null;
}
const UserInfo = (props: UserInfoProps) => {
  const ProfilePicture = () => {
    if (props.userPhotoUrl !== null) {
      return (
        <Avatar
          alt="User profile"
          src={props.userPhotoUrl}
          sx={{ marginRight: ".5rem", height: "2rem", width: "2rem" }}
        />
      );
    }
    const firstLetter = props.userEmail?.charAt(0);
    return (
      <Avatar sx={{ marginRight: ".5rem", height: "2rem", width: "2rem" }}>
        {firstLetter}
      </Avatar>
    );
  };

  return (
    <div className="mr-8 m-4 font-inter font-semibold flex items-center">
      <ProfilePicture />
      {props.userEmail === "" ? "Guest" : props.userEmail}
    </div>
  );
};

interface AuthButtonProps {
  onSignIn: () => void;
  onSignOut: () => void;
  userEmail: string | null;
}
const AuthButtons = (props: AuthButtonProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton
        onClick={() => {
          if (props.userEmail === "") {
            props.onSignIn();
          } else {
            props.onSignOut();
          }
        }}
      >
        <ListItemText
          primary={props.userEmail === "" ? "SIGN IN" : "SIGN OUT"}
        />
      </ListItemButton>
    </ListItem>
  );
};

interface NavDrawerProps {
  onCloseDrawer: () => void;
  isOpenDrawer: boolean;
  userEmail: string | null;
  userPhotoUrl: string | null;
  onSignIn: () => void;
  onSignOut: () => void;
}
export default function NavDrawer(props: NavDrawerProps) {
  const NAV_LIST = [HOME_PAGE, MENU_PAGE, CART_PAGE, ABOUT_PAGE];

  return (
    <Drawer
      anchor="right"
      open={props.isOpenDrawer}
      onClose={() => props.onCloseDrawer()}
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
        <List>
          {NAV_LIST.map((text, index) => (
            <ListItem key={text} disablePadding>
              <ListItemButton>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          <AuthButtons
            onSignIn={props.onSignIn}
            onSignOut={props.onSignOut}
            userEmail={props.userEmail}
          />
        </List>
      </Box>
    </Drawer>
  );
}
