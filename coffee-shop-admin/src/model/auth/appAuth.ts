import {
  Unsubscribe,
  User,
  connectAuthEmulator,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";

import { FIREBASE_CONFIG, IS_DEV_MODE } from "../../firebaseConf";
import { LoginAsAdmin } from "../useAppAuthModel";

initializeApp(FIREBASE_CONFIG);
const auth = getAuth();
if (IS_DEV_MODE) {
  console.log("[appAuth] Application using auth running in development mode");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export const authListenerInFirebase = (
  cb: (user: User | null) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(
        `appAuth.authListenerInFirebase: User is authenticated with id ${user.uid}`
      );
      cb(user);
    } else {
      console.log("appAuth.authListenerInFirebase: User is not authenticated");
      cb(null);
    }
  });
};

export const signInWithEmailInFirebase = (
  loginData: LoginAsAdmin,
  cb: (success: boolean) => void
) => {
  signInWithEmailAndPassword(auth, loginData.Username, loginData.Password)
    .then((result) => {
      console.log(
        `appAuth.signInWithEmailInFirebase: User signed in using email ${result.user.email}`
      );
      cb(true);
    })
    .catch((error) => {
      console.log(
        `appAuth.signInWithEmailInFirebase: There is a problem signing in using email`
      );
      cb(false);
      if (error !== null || error !== undefined) {
        console.log(error.message);
      }
    });
};

export const signOutInFirebase = (cb: (success: boolean) => void) => {
  signOut(auth)
    .then(() => {
      console.log("appAuth.signOutWithGoogleInFirebase: User signed out");
      cb(true);
    })
    .catch((error) => {
      console.log(
        "appAuth.signOutWithGoogleInFirebase: There is a problem signing out"
      );
      cb(false);
      if (error !== null || error !== undefined) {
        console.log(error);
      }
    });
};
