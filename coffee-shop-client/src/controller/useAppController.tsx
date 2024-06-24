import { useEffect, useState } from "react";
import { HOME_PAGE } from "../strings";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
  SIGNOUT_STATUS,
} from "../status";
import useAppViewModel from "../viewmodel/useAppViewModel";
import { User } from "firebase/auth";

export type Anchor = "top" | "left" | "bottom" | "right";

const useAppController = () => {
  const { addAuthListener, removeAuthListener, signInGoogle, signOut } =
    useAppViewModel();

  // * STATE MANAGEMENT FOR APPLICATION INCLUDING AUTHENTICATION
  // Indicator when a user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  // The ID of the user when a user is logged in
  const [userId, setUserId] = useState<string | null>("");
  // The email @ of the user when a user is logged in
  const [userEmail, setUserEmail] = useState<string | null>("");
  // URL link to the profile picture of the user when a user is logged in
  const [userPhotoUrl, setUserPhotoUrl] = useState<string | null>("");
  // The current page being shown bellow the header
  const [currentPage, setCurrentPage] = useState<string>(HOME_PAGE);
  // Use in login with google
  const [isOpenLoginWGoogle, setIsOpenLoginWGoogle] = useState<boolean>(false);
  // Use for drawer for small screen sizes
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  const onCloseDrawer = () => setIsOpenDrawer(false);
  const onOpenDrawer = () => setIsOpenDrawer(true);

  const onCloseLoginWithGoogle = () => {
    if (isOpenLoginWGoogle) setIsOpenLoginWGoogle(false);
  };
  const onOpenLoginWithGoogle = () => {
    if (!isOpenLoginWGoogle) setIsOpenLoginWGoogle(true);
  };

  const onChangeCurrentPage = (page: string) => setCurrentPage(page);
  const setUserInfo = (user: User | null) => {
    if (user !== null) {
      setUserId(user?.uid);
      setUserEmail(user?.email);
      setUserPhotoUrl(user?.photoURL);
    }
  };
  const unsetUserInfo = () => {
    setUserId("");
    setUserEmail("");
    setUserPhotoUrl("");
  };

  const onSignInWithGoogle = () => {
    const onSignedIn = (
      user: User | null,
      status: LOGIN_WITH_GOOGLE_STATUS
    ) => {
      if (status === LOGIN_WITH_GOOGLE_STATUS.SUCCESS) {
        setIsLoggedIn(true);
        if (user !== null) {
          setUserInfo(user);
        }
      } else if (status === LOGIN_WITH_GOOGLE_STATUS.ERROR) {
        setIsLoggedIn(false);
        unsetUserInfo();
      }
    };
    signInGoogle(onSignedIn);
  };
  const onSignOutWithGoogle = () => {
    // TODO: Refactor code
    window.location.pathname = "/";

    const onSignedOut = (status: SIGNOUT_STATUS) => {
      setIsLoggedIn(false);

      if (status === SIGNOUT_STATUS.SUCCESS) {
        // DO NOTHING HERE
      } else if (status === SIGNOUT_STATUS.ERROR) {
        // DO NOTHING HERE
      }
    };

    signOut(onSignedOut);
  };

  useEffect(() => {
    const cb = (user: User | null, status: AUTH_LISTENER_STATUS) => {
      if (status === AUTH_LISTENER_STATUS.LOGGED_IN) {
        setIsLoggedIn(true);
        if (user) {
          setUserInfo(user);
        } else {
          unsetUserInfo();
        }
      } else if (status === AUTH_LISTENER_STATUS.LOGGED_OUT) {
        unsetUserInfo();
      }
    };
    console.log("[useAppController] Adding auth listener");
    const unsubscribe = addAuthListener(cb);
    return () => {
      console.log("[useAppController] Removing auth listener");
      removeAuthListener(unsubscribe);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currentPage,
    isLoggedIn,
    userId,
    userEmail,
    userPhotoUrl,
    onChangeCurrentPage,

    isOpenDrawer,
    onOpenDrawer,
    onCloseDrawer,

    isOpenLoginWGoogle,
    onOpenLoginWithGoogle,
    onCloseLoginWithGoogle,
    onSignInWithGoogle,
    onSignOutWithGoogle,
  };
};

export default useAppController;
