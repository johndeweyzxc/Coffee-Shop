import {
  Unsubscribe,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../../firebaseConf";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_EMAIL_STATUS,
  SIGNOUT_STATUS,
} from "../../status";

export interface LoginAsAdmin {
  Username: string;
  Password: string;
}

initializeApp(FIREBASE_CONFIG);

export const authListenerInFirebase = (
  cb: (user: User | null, status: AUTH_LISTENER_STATUS) => void
): Unsubscribe => {
  return onAuthStateChanged(getAuth(), (user) => {
    if (user) {
      console.log(
        `appAuth.authListenerInFirebase: User is authenticated with id ${user.uid}`
      );
      cb(user, AUTH_LISTENER_STATUS.LOGGED_IN);
    } else {
      console.log("appAuth.authListenerInFirebase: User is not authenticated");
      cb(null, AUTH_LISTENER_STATUS.LOGGED_OUT);
    }
  });
};

export const signInWithEmailInFirebase = (
  loginData: LoginAsAdmin,
  cb: (user: User | null, status: LOGIN_WITH_EMAIL_STATUS) => void
) => {
  signInWithEmailAndPassword(getAuth(), loginData.Username, loginData.Password)
    .then((result) => {
      console.log(
        `appAuth.signInWithEmailInFirebase: User signed in using email ${result.user.email}`
      );
      cb(result.user, LOGIN_WITH_EMAIL_STATUS.SUCCESS);
    })
    .catch((error) => {
      console.log(
        `appAuth.signInWithEmailInFirebase: There is a problem signing in using email`
      );
      cb(null, LOGIN_WITH_EMAIL_STATUS.ERROR);
      if (error !== null || error !== undefined) {
        console.log(error.message);
      }
    });
};

export const signOutInFirebase = (cb: (status: SIGNOUT_STATUS) => void) => {
  signOut(getAuth())
    .then(() => {
      console.log("appAuth.signOutWithGoogleInFirebase: User signed out");
      cb(SIGNOUT_STATUS.SUCCESS);
    })
    .catch((error) => {
      console.log(
        "appAuth.signOutWithGoogleInFirebase: There is a problem signing out"
      );
      cb(SIGNOUT_STATUS.ERROR);
      if (error !== null || error !== undefined) {
        console.log(error);
      }
    });
};
