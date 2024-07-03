import {
  GoogleAuthProvider,
  Unsubscribe,
  User,
  getAuth,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../../firebaseConf";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
  SIGNOUT_STATUS,
} from "../../status";

initializeApp(FIREBASE_CONFIG);
const provider = new GoogleAuthProvider();

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

export const signInWithGoogleInFirebase = (
  cb: (user: User | null, status: LOGIN_WITH_GOOGLE_STATUS) => void
) => {
  signInWithPopup(getAuth(), provider)
    .then((result) => {
      console.log(
        `appAuth.signInWithGoogleInFirebase: User signed in using google with email ${result.user.email}`
      );
      cb(result.user, LOGIN_WITH_GOOGLE_STATUS.SUCCESS);
    })
    .catch((error) => {
      console.log(
        `appAuth.signInWithGoogleInFirebase: There is a problem signing in using google`
      );
      cb(null, LOGIN_WITH_GOOGLE_STATUS.ERROR);
      if (error !== null || error !== undefined) {
        console.log(error);
      }
    });
};

export const isUserSignedInFirebase = (): boolean => {
  return getAuth().currentUser !== null;
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
