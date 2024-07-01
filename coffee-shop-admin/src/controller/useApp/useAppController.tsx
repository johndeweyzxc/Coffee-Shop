import { ChangeEvent, useEffect, useState } from "react";
import { User } from "firebase/auth";

import useAdminViewModel from "../../viewmodel/useAdminViewModel";
import { LoginAsAdmin } from "../../model/useAppAuthModel";
import { ADMIN_NEW_PRODUCT, ADMIN_PRODUCT_TAB } from "../../strings";

export default function useAppController(
  handleOpenAlert: (severity: string, message: string) => void,
  onOpenUpload: () => void
) {
  const { signInEmail, signOut, addAuthListener } = useAdminViewModel();

  const EMPTY_LOGIN_DATA = () => {
    return {
      Username: "",
      Password: "",
    };
  };

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [isOpenLogin, setIsOpenLogin] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loginData, setLoginData] = useState<LoginAsAdmin>(EMPTY_LOGIN_DATA);

  const onOpenLogin = () => setIsOpenLogin(true);
  const onCloseLogin = () => {
    window.location.href = "/";
  };
  const onChangeLoginData = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };
  const onSignIn = () => {
    setIsOpenLogin(false);
    const onSignedInWithEmail = (success: boolean) => {
      if (!success) {
        handleOpenAlert("error", "Error signing in with Email");
      }
    };
    signInEmail(loginData, onSignedInWithEmail);
  };
  const onSignOut = () => {
    const onSignedOut = (success: boolean) => {
      if (!success) {
        handleOpenAlert("error", "Error signing out with Email");
      }
    };
    signOut(onSignedOut);
  };
  const [selectedNav, setSelectedNav] = useState<string>(ADMIN_PRODUCT_TAB);
  const onSelectedNav = (name: string) => {
    if (name === ADMIN_NEW_PRODUCT) onOpenUpload();
    else setSelectedNav(name);
  };
  useEffect(() => {
    const onAuthChanged = (user: User | null) => {
      if (user !== null) {
        setIsLoggedIn(true);
        setUser(user);
      } else {
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    console.log("[useAdminController] Adding auth state listener");
    const unsubscribe = addAuthListener(onAuthChanged);
    return () => {
      console.log("[useAdminController] Removing auth state listener");
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    onSelectedNav,
    selectedNav,

    user,
    isLoggedIn,
    isOpenLogin,
    onOpenLogin,
    onCloseLogin,
    onChangeLoginData,
    onSignIn,
    onSignOut,
  };
}
