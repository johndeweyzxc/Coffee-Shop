import { Avatar, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

import CoffeeShopLogo from "../../assets/images/coffee-shop-logo.png";
import { HOME_PAGE, NAV_LIST } from "../../strings";
import "./styles/NavigationBar.css";

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

  const userInfoClassName = () => {
    const isHome = window.location.pathname === "/";
    return isHome ? "user-info" : "user-info-not-home";
  };

  return (
    <div className={userInfoClassName()}>
      <ProfilePicture />
      {props.userEmail === "" ? "Guest" : props.userEmail}
    </div>
  );
};

interface AuthButtonsProps {
  onOpenSignIn: () => void;
  onOpenRegister: () => void;
  onLogOut: () => void;
  userEmail: string | null;
}
const AuthButtons = (props: AuthButtonsProps) => {
  const onClicked = () => {
    props.userEmail === "" ? props.onOpenSignIn() : props.onLogOut();
  };
  const authButtonClassName = () => {
    const isHome = window.location.pathname === "/";
    return isHome ? "auth-button" : "auth-button-not-home";
  };

  const RegisterButton = () => {
    if (props.userEmail === "") {
      return (
        <button
          className={authButtonClassName()}
          onClick={props.onOpenRegister}
        >
          <PersonAddIcon
            sx={{ marginRight: ".25rem", width: "1rem", height: "1rem" }}
          />
          Register
        </button>
      );
    } else {
      return null;
    }
  };

  const renderLoginButtonIcon = () => {
    return props.userEmail === "" ? (
      <LoginIcon
        sx={{ marginRight: ".25rem", width: "1rem", height: "1rem" }}
      />
    ) : (
      <LogoutIcon
        sx={{ marginRight: ".25rem", width: "1rem", height: "1rem" }}
      />
    );
  };

  return (
    <>
      <button className={authButtonClassName()} onClick={onClicked}>
        {renderLoginButtonIcon()}
        {props.userEmail === "" ? "Login" : "Logout"}
      </button>
      <RegisterButton />
    </>
  );
};

interface NavButtonsProps {
  navBtns: string[];
  selectedNavBtn: string;
  onChangeCurrentPage: (page: string) => void;
}
const NavButtons = (props: NavButtonsProps) => {
  const onClickNavButton = (nav: string) => {
    props.onChangeCurrentPage(nav);
    const path = nav === HOME_PAGE ? "/" : `/${nav.toLowerCase()}`;
    window.location.href = path;
  };
  const navButtonClassName = () => {
    const isHome = window.location.pathname === "/";
    return isHome ? "nav-button" : "nav-button-not-home";
  };
  const navButtonUnselectedClassName = () => {
    const isHome = window.location.pathname === "/";
    return isHome ? "nav-button-unselected" : "nav-button-unselected-not-home";
  };

  const RenderNavButtons = (nav: string, index: number) => {
    if (props.selectedNavBtn === nav) {
      return (
        <li
          className={navButtonClassName()}
          key={index}
          onClick={() => onClickNavButton(nav)}
        >
          {nav}
        </li>
      );
    }
    return (
      <li
        className={navButtonUnselectedClassName()}
        key={index}
        onClick={() => onClickNavButton(nav)}
      >
        {nav}
      </li>
    );
  };

  return (
    <ul className="max-lg:hidden flex">
      {props.navBtns.map((nav, index) => {
        return RenderNavButtons(nav, index);
      })}
    </ul>
  );
};

interface NavigationBarProps {
  selectedNav: string;
  onChangeCurrentPage: (page: string) => void;
  userEmail: string | null;
  userPhotoUrl: string | null;
  onLogOut: () => void;
  onOpenSignIn: () => void;
  onOpenRegister: () => void;
  onOpenDrawer: () => void;
}
export default function NavigationBar(props: NavigationBarProps) {
  const navBarClassName = () => {
    const isHome = window.location.pathname === "/";
    return isHome ? "navbar" : "navbar-not-home";
  };
  const menuIconColor = () => {
    const isHome = window.location.pathname === "/";
    return isHome
      ? "var(--md-sys-color-on-primary)"
      : "var(--md-sys-color-primary)";
  };

  return (
    <>
      <nav className={navBarClassName()}>
        <section className="flex items-center">
          <img
            alt="Coffee shop logo"
            src={CoffeeShopLogo}
            className="w-14 h-14 ml-8 mr-8 max-md:ml-4 max-md:mr-4 max-md:w-12 max-md:h-12 bg-md-sys-color-on-primary rounded-full"
          />
          <NavButtons
            navBtns={NAV_LIST}
            selectedNavBtn={props.selectedNav}
            onChangeCurrentPage={props.onChangeCurrentPage}
          />
        </section>
        <section className="flex">
          <UserInfo
            userEmail={props.userEmail}
            userPhotoUrl={props.userPhotoUrl}
          />
          <AuthButtons
            userEmail={props.userEmail}
            onOpenRegister={props.onOpenRegister}
            onOpenSignIn={props.onOpenSignIn}
            onLogOut={props.onLogOut}
          />
          <div className="hidden max-lg:block">
            <IconButton onClick={() => props.onOpenDrawer()}>
              <MenuIcon sx={{ color: menuIconColor() }} />
            </IconButton>
          </div>
        </section>
      </nav>
    </>
  );
}
