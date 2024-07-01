import { Unsubscribe, User } from "firebase/auth";

import {
  signInWithEmailInFirebase,
  authListenerInFirebase,
  signOutInFirebase,
} from "./auth/appAuth";

export interface LoginAsAdmin {
  Username: string;
  Password: string;
}

const useAppAuthModel = () => {
  const addAuthListener = (cb: (user: User | null) => void) => {
    return authListenerInFirebase(cb);
  };
  const signInEmail = (
    loginData: LoginAsAdmin,
    cb: (success: boolean) => void
  ) => {
    signInWithEmailInFirebase(loginData, cb);
  };
  const signOut = (cb: (success: boolean) => void) => {
    signOutInFirebase(cb);
  };

  return {
    addAuthListener,
    signInEmail,
    signOut,
  };
};

export default useAppAuthModel;
