import { User } from "firebase/auth";
import {
  authListenerInFirebase,
  registerUsingEmailAndPasswordInFirebase,
  signInUsingEmailAndPasswordInFirebase,
  signInWithGoogleInFirebase,
  signOutInFirebase,
} from "./auth/appAuth";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_EMAIL_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
  REGISTER_WITH_EMAIL_STATUS,
  SIGNOUT_STATUS,
} from "../status";

export interface AppUser {
  id: string;
  Email: string;
  PhotoURL: string;
}

export interface LoginInfo {
  Email: string;
  Password: string;
}

const useAppAuthModel = () => {
  const createAppUser = (user: User | null) => {
    if (user !== null) {
      return {
        id: user.uid,
        Email: user.email === null ? "" : user.email,
        PhotoURL: user.photoURL === null ? "" : user.photoURL,
      };
    }
    return {
      id: "",
      Email: "",
      PhotoURL: "",
    };
  };

  const addAuthListener = (
    onAuthChanges: (appUser: AppUser, status: AUTH_LISTENER_STATUS) => void
  ) => {
    const cb = (user: User | null, status: AUTH_LISTENER_STATUS) => {
      onAuthChanges(createAppUser(user), status);
    };
    return authListenerInFirebase(cb);
  };

  const signInGoogle = (
    onSignedIn: (appUser: AppUser, status: LOGIN_WITH_GOOGLE_STATUS) => void
  ) => {
    const cb = (user: User | null, status: LOGIN_WITH_GOOGLE_STATUS) => {
      onSignedIn(createAppUser(user), status);
    };
    signInWithGoogleInFirebase(cb);
  };

  const signOut = (cb: (status: SIGNOUT_STATUS) => void) =>
    signOutInFirebase(cb);

  const signInUsingEmailAndPassword = (
    loginInfo: LoginInfo,
    onSignedIn: (user: User | null, status: LOGIN_WITH_EMAIL_STATUS) => void
  ) => {
    signInUsingEmailAndPasswordInFirebase(
      loginInfo.Email,
      loginInfo.Password,
      onSignedIn
    );
  };

  const registerUsingEmailAndPassword = (
    loginInfo: LoginInfo,
    onRegistered: (
      user: User | null,
      status: REGISTER_WITH_EMAIL_STATUS
    ) => void
  ) => {
    registerUsingEmailAndPasswordInFirebase(
      loginInfo.Email,
      loginInfo.Password,
      onRegistered
    );
  };

  return {
    addAuthListener,
    signInGoogle,
    signOut,
    signInUsingEmailAndPassword,
    registerUsingEmailAndPassword,
  };
};

export default useAppAuthModel;
