import { User } from "firebase/auth";
import {
  authListenerInFirebase,
  registerUsingEmailAndPasswordInFirebase,
  signInWithGoogleInFirebase,
  logInUsingEmailAndPasswordInFirebase,
  logOutInFirebase,
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

  const signInWithGoogle = (
    onSignedIn: (appUser: AppUser, status: LOGIN_WITH_GOOGLE_STATUS) => void
  ) => {
    const cb = (user: User | null, status: LOGIN_WITH_GOOGLE_STATUS) => {
      onSignedIn(createAppUser(user), status);
    };
    signInWithGoogleInFirebase(cb);
  };

  const logOut = (cb: (status: SIGNOUT_STATUS) => void) => logOutInFirebase(cb);

  const logInUsingEmailAndPassword = (
    loginInfo: LoginInfo,
    onSignedIn: (user: AppUser | null, status: LOGIN_WITH_EMAIL_STATUS) => void
  ) => {
    const cb = (user: User | null, status: LOGIN_WITH_EMAIL_STATUS) => {
      if (user !== null) {
        const appUser: AppUser = {
          id: user.uid,
          Email: user.email === null ? "" : user.email,
          PhotoURL: user.photoURL === null ? "" : user.photoURL,
        };
        onSignedIn(appUser, status);
      } else {
        onSignedIn(null, status);
      }
    };
    logInUsingEmailAndPasswordInFirebase(
      loginInfo.Email,
      loginInfo.Password,
      cb
    );
  };

  const registerUsingEmailAndPassword = (
    loginInfo: LoginInfo,
    onRegistered: (
      user: AppUser | null,
      status: REGISTER_WITH_EMAIL_STATUS
    ) => void
  ) => {
    const cb = (user: User | null, status: REGISTER_WITH_EMAIL_STATUS) => {
      if (user !== null) {
        const appUser: AppUser = {
          id: user.uid,
          Email: user.email === null ? "" : user.email,
          PhotoURL: user.photoURL === null ? "" : user.photoURL,
        };
        onRegistered(appUser, status);
      } else {
        onRegistered(null, status);
      }
    };
    registerUsingEmailAndPasswordInFirebase(
      loginInfo.Email,
      loginInfo.Password,
      cb
    );
  };

  return {
    addAuthListener,
    signInWithGoogle,
    logOut,
    logInUsingEmailAndPassword,
    registerUsingEmailAndPassword,
  };
};

export default useAppAuthModel;
