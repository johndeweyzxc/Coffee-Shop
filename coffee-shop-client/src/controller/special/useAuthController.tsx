import { ChangeEvent, useEffect, useState } from "react";
import useAppAuthModel, {
  AppUser,
  LoginInfo,
} from "../../model/useAppAuthModel";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
  SIGNOUT_STATUS,
} from "../../status";

const useAuthController = () => {
  const EMPTY_APP_USER = () => {
    return {
      id: "",
      Email: "",
      PhotoURL: "",
    };
  };
  const EMPTY_LOGIN_INFO = () => {
    return {
      Email: "",
      Password: "",
    };
  };
  const { addAuthListener, signInGoogle, signOut } = useAppAuthModel();

  // * STATE MANAGEMENT FOR AUTHENTICATION
  // Indicator when a user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  // The currently signed in user
  const [currentUser, setCurrentUser] = useState<AppUser>(EMPTY_APP_USER());
  // Use in dialog when asking to login using Google account
  const [isOpenLoginWGoogle, setIsOpenLoginWGoogle] = useState<boolean>(false);
  // Use in dialog when registering new user using email and password
  const [isOpenUserRegister, setIsOpenUserRegister] = useState<boolean>(false);
  // Use when registering new user
  const [registerUser, setRegisterUser] = useState<LoginInfo>(
    EMPTY_LOGIN_INFO()
  );
  // Use in dialog when logging in using email and password
  const [isOpenUserLogin, setIsOpenUserLogin] = useState<boolean>(false);
  // Use when logging in using email and password
  const [loginUser, setLoginUser] = useState<LoginInfo>(EMPTY_LOGIN_INFO());

  const onLoginUsingEmailAndPassword = () => {
    // TODO: Implementation
  };
  const onRegisterUsingEmailAndPassword = () => {
    // TODO: Implementation
  };
  const onCloseRegistration = () => setRegisterUser(EMPTY_LOGIN_INFO());
  const onCloseLogin = () => setLoginUser(EMPTY_LOGIN_INFO());
  const onChangeRegister = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterUser({ ...registerUser, [name]: value });
  };
  const onChangeLogin = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginUser({ ...registerUser, [name]: value });
  };
  const onCloseLoginWithGoogle = () => {
    if (isOpenLoginWGoogle) setIsOpenLoginWGoogle(false);
  };
  const onOpenLoginWithGoogle = () => {
    if (!isOpenLoginWGoogle) setIsOpenLoginWGoogle(true);
  };
  const onSignInWithGoogle = () => {
    const onSignedIn = (appUser: AppUser, status: LOGIN_WITH_GOOGLE_STATUS) => {
      setCurrentUser(appUser);
      if (status === LOGIN_WITH_GOOGLE_STATUS.SUCCESS) {
        setIsLoggedIn(true);
      } else if (status === LOGIN_WITH_GOOGLE_STATUS.ERROR) {
        setIsLoggedIn(false);
      }
    };
    signInGoogle(onSignedIn);
  };
  const onSignOutWithGoogle = () => {
    window.location.pathname = "/";

    const onSignedOut = (status: SIGNOUT_STATUS) => {
      setIsLoggedIn(false);

      if (status === SIGNOUT_STATUS.SUCCESS) {
        // TODO: Show notification about error
      } else if (status === SIGNOUT_STATUS.ERROR) {
        // TODO: Show notification about error
      }
    };

    signOut(onSignedOut);
  };
  useEffect(() => {
    const cb = (appUser: AppUser, status: AUTH_LISTENER_STATUS) => {
      setCurrentUser(appUser);

      if (status === AUTH_LISTENER_STATUS.LOGGED_IN) {
        setIsLoggedIn(true);
      } else if (status === AUTH_LISTENER_STATUS.LOGGED_OUT) {
        setIsLoggedIn(false);
      }
    };
    console.log("[useAppController] Adding auth listener");
    const unsubscribe = addAuthListener(cb);
    return () => {
      console.log("[useAppController] Removing auth listener");
      unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isLoggedIn,
    currentUser,
    isOpenLoginWGoogle,
    onOpenLoginWithGoogle,
    onCloseLoginWithGoogle,
    onSignInWithGoogle,
    onSignOutWithGoogle,
  };
};

export default useAuthController;
