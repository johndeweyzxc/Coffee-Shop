import { Avatar, IconButton } from "@mui/material";
import { ABOUT_PAGE, CART_PAGE, HOME_PAGE, MENU_PAGE } from "../../strings";
import CoffeeShopLogo from "../../assets/images/coffee-shop-logo.jpg";
import MenuIcon from "@mui/icons-material/Menu";

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
    <div className="mr-8 max-md:hidden font-inter font-semibold flex items-center">
      <ProfilePicture />
      {props.userEmail === "" ? "Guest" : props.userEmail}
    </div>
  );
};

interface AuthButtonsProps {
  onSignIn: () => void;
  onSignOut: () => void;
  userEmail: string | null;
}
const AuthButtons = (props: AuthButtonsProps) => {
  return (
    <p
      className="mr-8 px-4 py-1 font-inter text-[1rem] text-sm
    font-bold border-black border-[1px] rounded-full
    hover:bg-[#00000010] ease-in-out duration-200 cursor-pointer self-center text-nowrap max-md:hidden"
      onClick={() => {
        if (props.userEmail === "") {
          props.onSignIn();
        } else {
          props.onSignOut();
        }
      }}
    >
      {props.userEmail === "" ? "Sign in" : "Sign out"}
    </p>
  );
};

interface NavButtonsProps {
  navBtns: string[];
  selectedNavBtn: string;
  onChangeCurrentPage: (page: string) => void;
}
const NavButtons = (props: NavButtonsProps) => {
  return (
    <div className="max-lg:hidden flex">
      {props.navBtns.map((nav, index) => {
        if (props.selectedNavBtn === nav) {
          return (
            <p
              className="mr-8 text-green-700 font-inter tracking-wide text-[1rem] 
              font-bold cursor-pointer"
              key={index}
              onClick={() => {
                props.onChangeCurrentPage(nav);
                if (nav === HOME_PAGE) {
                  window.location.href = "/";
                  return;
                }
                window.location.href = `/${nav.toLowerCase()}`;
              }}
            >
              {nav}
            </p>
          );
        }

        return (
          <p
            className="mr-8 font-inter tracking-wide text-[1rem] 
            font-bold hover:text-green-700 cursor-pointer"
            key={index}
            onClick={() => {
              props.onChangeCurrentPage(nav);
              if (nav === HOME_PAGE) {
                window.location.href = "/";
                return;
              }
              window.location.href = `/${nav.toLowerCase()}`;
            }}
          >
            {nav}
          </p>
        );
      })}
    </div>
  );
};

interface HeaderProps {
  selectedNav: string;
  onChangeCurrentPage: (page: string) => void;
  userEmail: string | null;
  userPhotoUrl: string | null;
  onSignOut: () => void;
  onSignIn: () => void;
  onOpenDrawer: () => void;
}
export default function Header(props: HeaderProps) {
  const NAV_LIST = [HOME_PAGE, MENU_PAGE, CART_PAGE, ABOUT_PAGE];

  return (
    <>
      <div className="w-full flex justify-between items-center p-4 max-md:p-2">
        <div className="flex items-center">
          <img
            alt="Coffee shop logo"
            src={CoffeeShopLogo}
            className="w-14 h-14 ml-8 mr-8 max-md:ml-4 max-md:mr-4 max-md:w-12 max-md:h-12"
          />
          <NavButtons
            navBtns={NAV_LIST}
            selectedNavBtn={props.selectedNav}
            onChangeCurrentPage={props.onChangeCurrentPage}
          />
        </div>
        <div className="flex">
          <UserInfo
            userEmail={props.userEmail}
            userPhotoUrl={props.userPhotoUrl}
          />
          <AuthButtons
            userEmail={props.userEmail}
            onSignIn={props.onSignIn}
            onSignOut={props.onSignOut}
          />
          <div className="invisible max-lg:visible">
            <IconButton onClick={() => props.onOpenDrawer()}>
              <MenuIcon />
            </IconButton>
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-gray-400" />
    </>
  );
}
