import { Context, useContext } from "react";
import { User } from "firebase/auth";
import { Avatar } from "@mui/material";

import CoffeeShopLogo from "../../assets/images/coffee-shop-logo.jpg";
import {
  ADMIN_NEW_PRODUCT,
  ADMIN_ORDER_TAB,
  ADMIN_PRODUCT_TAB,
} from "../../strings";

interface UserInfoProps {
  userPhotoUrl: string;
  userEmail: string;
}
const UserInfo = (props: UserInfoProps) => {
  const ProfilePicture = () => {
    if (props.userPhotoUrl !== null || props.userPhotoUrl !== undefined) {
      return (
        <Avatar
          alt="User profile"
          src={props.userPhotoUrl!}
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
  onOpenLogin: () => void;
  onSignOut: () => void;
  userEmail: string;
}
const AuthButtons = (props: AuthButtonsProps) => {
  return (
    <p
      className="mr-8 px-4 py-1 font-inter text-[1rem] text-sm
    font-bold border-black border-[1px] rounded-full
    hover:bg-[#00000010] ease-in-out duration-200 cursor-pointer self-center text-nowrap max-md:hidden"
      onClick={() => {
        if (props.userEmail === "") {
          props.onOpenLogin();
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
            }}
          >
            {nav}
          </p>
        );
      })}
    </div>
  );
};

export type HeaderBarParams = {
  onSelectedNav: (name: string) => void;
  selectedNav: string;
  user: User | null;
  onOpenLogin: () => void;
  onSignOut: () => void;
};
export default function Headerbar(props: {
  context: Context<HeaderBarParams>;
}) {
  const context = useContext<HeaderBarParams>(props.context);
  const onSelectedNav = context.onSelectedNav;
  const selectedNav = context.selectedNav;
  const user = context.user;
  const onOpenLogin = context.onOpenLogin;
  const onSignOut = context.onSignOut;

  const NAV_LIST = [ADMIN_PRODUCT_TAB, ADMIN_ORDER_TAB, ADMIN_NEW_PRODUCT];

  let userEmail: string = "";
  let userPhotoUrl: string = "";
  if (user !== null) {
    userEmail = user.email !== null ? user.email : "";
    userPhotoUrl = user.photoURL !== null ? user.photoURL : "";
  }

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
            selectedNavBtn={selectedNav}
            onChangeCurrentPage={onSelectedNav}
          />
        </div>
        <div className="flex">
          <UserInfo userEmail={userEmail} userPhotoUrl={userPhotoUrl} />
          <AuthButtons
            userEmail={userEmail}
            onOpenLogin={onOpenLogin}
            onSignOut={onSignOut}
          />
          <div className="invisible max-lg:visible"></div>
        </div>
      </div>
      <div className="h-[1px] bg-gray-400" />
    </>
  );
}
