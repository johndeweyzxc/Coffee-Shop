import { Unsubscribe, User } from "firebase/auth";
import {
  LoginAsAdmin,
  signInWithEmailInFirebase,
  authListenerInFirebase,
  signOutInFirebase,
} from "./auth/appAuth";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_EMAIL_STATUS,
  SIGNOUT_STATUS,
} from "../status";

const useAppAuthModel = () => {
  const addAuthListener = (
    cb: (user: User | null, status: AUTH_LISTENER_STATUS) => void
  ) => {
    return authListenerInFirebase(cb);
  };

  const removeAuthListener = (unsubscribe: Unsubscribe) => {
    unsubscribe();
  };

  const signInEmail = (
    loginData: LoginAsAdmin,
    cb: (user: User | null, status: LOGIN_WITH_EMAIL_STATUS) => void
  ) => {
    signInWithEmailInFirebase(loginData, cb);
  };

  const signOut = (cb: (status: SIGNOUT_STATUS) => void) => {
    signOutInFirebase(cb);
  };

  return {
    addAuthListener,
    removeAuthListener,
    signInEmail,
    signOut,
  };
};

export default useAppAuthModel;
