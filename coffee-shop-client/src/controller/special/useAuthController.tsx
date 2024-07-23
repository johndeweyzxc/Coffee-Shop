import { ChangeEvent, useEffect, useState } from "react";

import { AppUser, LoginInfo } from "../../model/useAppAuthModel";
import useAuthViewModel from "../../viewmodel/useAuthViewModel";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_EMAIL_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
  REGISTER_WITH_EMAIL_STATUS,
  SIGNOUT_STATUS,
} from "../../status";
import { MENU_PAGE } from "../../strings";

export interface InputHelperText {
  IsError: boolean;
  ErrorMessage: string;
}

const useAuthController = (
  handleOpenAlert: (severity: string, message: string) => void
) => {
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
  const EMPTY_INPUT_HELPER_TEXT = () => {
    return {
      IsError: false,
      ErrorMessage: "",
    };
  };
  const {
    addAuthListener,
    signInWithGoogle,
    logOut,
    logInUsingEmailAndPassword,
    registerUsingEmailAndPassword,

    verifyLoginInput,
    verifyRegisterInput,
  } = useAuthViewModel();

  // * STATE MANAGEMENT FOR AUTHENTICATION
  // Indicator when a user is logged in or not
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(true);
  // The currently signed in user
  const [currentUser, setCurrentUser] = useState<AppUser>(EMPTY_APP_USER());
  // Use in dialog when registering new user using email and password
  const [isOpenUserRegister, setIsOpenUserRegister] = useState<boolean>(false);
  // Use when registering new user
  const [registerUser, setRegisterUser] = useState<LoginInfo>(
    EMPTY_LOGIN_INFO()
  );
  // Use in dialog when logging in using email and password
  const [isOpenUserLogin, setIsOpenUserLogin] = useState<boolean>(false);
  // Use when logging in using email and password
  const [loginUserInfo, setLoginUserInfo] = useState<LoginInfo>(
    EMPTY_LOGIN_INFO()
  );
  // Use as helper text when logging in
  const [inputHelperText, setInputHelperText] = useState<InputHelperText>(
    EMPTY_INPUT_HELPER_TEXT()
  );

  const onLogInUsingEmailAndPassword = () => {
    const onLoggedIn = (
      appUser: AppUser | null,
      status: LOGIN_WITH_EMAIL_STATUS
    ) => {
      if (status === LOGIN_WITH_EMAIL_STATUS.WRONG_PASSWORD) {
        setInputHelperText({
          IsError: true,
          ErrorMessage: "Wrong username or password",
        });
      } else if (status === LOGIN_WITH_EMAIL_STATUS.INVALID_EMAIL) {
        setInputHelperText({ IsError: true, ErrorMessage: "Invalid email" });
      } else if (status === LOGIN_WITH_EMAIL_STATUS.ERROR) {
        setInputHelperText({
          IsError: true,
          ErrorMessage: "There is an error signing in",
        });
      } else {
        if (appUser !== null) setCurrentUser(appUser);
        setInputHelperText(EMPTY_INPUT_HELPER_TEXT());
        onCloseLogin();
      }
    };

    const [success, message] = verifyLoginInput(loginUserInfo);
    if (success) {
      logInUsingEmailAndPassword(loginUserInfo, onLoggedIn);
      setInputHelperText(EMPTY_INPUT_HELPER_TEXT());
    } else {
      setInputHelperText({ IsError: true, ErrorMessage: message });
    }
  };
  const onRegisterUsingEmailAndPassword = () => {
    const onRegistered = (
      appUser: AppUser | null,
      status: REGISTER_WITH_EMAIL_STATUS
    ) => {
      if (status === REGISTER_WITH_EMAIL_STATUS.INVALID_EMAIL) {
        setInputHelperText({ IsError: true, ErrorMessage: "Invalid email" });
      } else if (status === REGISTER_WITH_EMAIL_STATUS.EMAIL_ALREADY_EXISTS) {
        setInputHelperText({
          IsError: true,
          ErrorMessage: "Email is already taken",
        });
      } else if (status === REGISTER_WITH_EMAIL_STATUS.ERROR) {
        setInputHelperText({
          IsError: true,
          ErrorMessage: "There is an error signing in",
        });
      } else {
        if (appUser !== null) setCurrentUser(appUser);
        setInputHelperText(EMPTY_INPUT_HELPER_TEXT());
        onCloseRegistration();
      }
    };

    const [success, message] = verifyRegisterInput(registerUser);
    if (success) {
      registerUsingEmailAndPassword(registerUser, onRegistered);
      setInputHelperText(EMPTY_INPUT_HELPER_TEXT());
    } else {
      setInputHelperText({ IsError: true, ErrorMessage: message });
    }
  };
  const onOpenRegistration = () => {
    if (!isOpenUserRegister) setIsOpenUserRegister(true);
  };
  const onCloseRegistration = () => {
    if (isOpenUserRegister) {
      setIsOpenUserRegister(false);
      setInputHelperText(EMPTY_INPUT_HELPER_TEXT());
      setRegisterUser(EMPTY_LOGIN_INFO());
    }
  };
  const onOpenLogin = () => {
    if (!isOpenUserLogin) setIsOpenUserLogin(true);
  };
  const onCloseLogin = () => {
    if (isOpenUserLogin) {
      if (window.location.pathname === `/${MENU_PAGE.toLowerCase()}`) {
        // DO NOT CHANGE LOCATION
      } else if (window.location.pathname !== "/") {
        window.location.href = "/";
      }
      setIsOpenUserLogin(false);
      setInputHelperText(EMPTY_INPUT_HELPER_TEXT());
      setLoginUserInfo(EMPTY_LOGIN_INFO());
    }
  };
  const onChangeRegister = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterUser({ ...registerUser, [name]: value });
  };
  const onChangeLogin = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginUserInfo({ ...loginUserInfo, [name]: value });
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
    signInWithGoogle(onSignedIn);
  };
  const onLogOut = () => {
    if (window.location.pathname === `/${MENU_PAGE.toLowerCase()}`) {
      // DO NOT CHANGE LOCATION
    } else if (window.location.pathname !== "/") {
      window.location.href = "/";
    }
    const onLoggedOut = (status: SIGNOUT_STATUS) => {
      setIsLoggedIn(false);
      if (status === SIGNOUT_STATUS.ERROR) {
        handleOpenAlert("warning", "There is an error signing out");
      }
    };
    logOut(onLoggedOut);
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
    onSignInWithGoogle,
    onLogOut,

    isOpenUserLogin,
    onOpenLogin,
    loginUserInfo,
    onChangeLogin,
    onCloseLogin,
    onLogInUsingEmailAndPassword,

    isOpenUserRegister,
    onOpenRegistration,
    registerUser,
    onChangeRegister,
    onCloseRegistration,
    onRegisterUsingEmailAndPassword,

    inputHelperText,
  };
};

export default useAuthController;
