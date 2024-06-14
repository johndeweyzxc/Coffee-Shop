import { Unsubscribe, User } from "firebase/auth";
import {
  isUserSignedInFirebase,
  authListenerInFirebase,
  signInWithGoogleInFirebase,
  signOutInFirebase,
} from "./auth/appAuth";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
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

  const isSignedIn = (): boolean => {
    return isUserSignedInFirebase();
  };

  const signInGoogle = (
    cb: (user: User | null, status: LOGIN_WITH_GOOGLE_STATUS) => void
  ) => {
    signInWithGoogleInFirebase(cb);
  };

  const signOut = (cb: (status: SIGNOUT_STATUS) => void) => {
    signOutInFirebase(cb);
  };

  return {
    addAuthListener,
    removeAuthListener,
    isSignedIn,
    signInGoogle,
    signOut,
  };
};

export default useAppAuthModel;
