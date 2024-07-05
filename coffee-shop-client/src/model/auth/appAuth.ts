import {
  GoogleAuthProvider,
  Unsubscribe,
  User,
  connectAuthEmulator,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import { FIREBASE_CONFIG } from "../../firebaseConf";
import {
  AUTH_LISTENER_STATUS,
  LOGIN_WITH_EMAIL_STATUS,
  LOGIN_WITH_GOOGLE_STATUS,
  REGISTER_WITH_EMAIL_STATUS,
  SIGNOUT_STATUS,
} from "../../status";

initializeApp(FIREBASE_CONFIG);
const provider = new GoogleAuthProvider();
const auth = getAuth();
if (window.location.hostname === "localhost") {
  console.log("[appAuth] Application using auth running in development mode");
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}

export const authListenerInFirebase = (
  onAuthChanged: (user: User | null, status: AUTH_LISTENER_STATUS) => void
): Unsubscribe => {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(
        `appAuth.authListenerInFirebase: User is authenticated with id ${user.uid}`
      );
      onAuthChanged(user, AUTH_LISTENER_STATUS.LOGGED_IN);
    } else {
      console.log("appAuth.authListenerInFirebase: User is not authenticated");
      onAuthChanged(null, AUTH_LISTENER_STATUS.LOGGED_OUT);
    }
  });
};

export const signInWithGoogleInFirebase = (
  onSignedIn: (user: User | null, status: LOGIN_WITH_GOOGLE_STATUS) => void
) => {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log(
        `appAuth.signInWithGoogleInFirebase: User signed in using google with email ${result.user.email}`
      );
      onSignedIn(result.user, LOGIN_WITH_GOOGLE_STATUS.SUCCESS);
    })
    .catch((error) => {
      console.log(
        `appAuth.signInWithGoogleInFirebase: There is a problem signing in using google`
      );
      onSignedIn(null, LOGIN_WITH_GOOGLE_STATUS.ERROR);
      if (error !== null || error !== undefined) {
        console.log(error);
      }
    });
};

export const signInUsingEmailAndPasswordInFirebase = (
  email: string,
  password: string,
  onSignedIn: (user: User | null, status: LOGIN_WITH_EMAIL_STATUS) => void
) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCreds) => {
      console.log(
        `appAuth.signInUsingEmailAndPasswordInFirebase: User signed in using email ${email} and password`
      );
      onSignedIn(userCreds.user, LOGIN_WITH_EMAIL_STATUS.SUCCESS);
    })
    .catch((error) => {
      console.log(
        `appAuth.signInUsingEmailAndPasswordInFirebase: There is a problem signing in using email and password`
      );

      onSignedIn(null, LOGIN_WITH_EMAIL_STATUS.ERROR);
      if (error !== null || error !== undefined) {
        const errorMessage = error.message;
        console.log(errorMessage);
      }
    });
};

export const registerUsingEmailAndPasswordInFirebase = (
  email: string,
  password: string,
  onRegistered: (user: User | null, status: REGISTER_WITH_EMAIL_STATUS) => void
) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCreds) => {
      console.log(
        `appAuth.registerUsingEmailAndPasswordInFirebase: User registered using email ${email} and password`
      );
      onRegistered(userCreds.user, REGISTER_WITH_EMAIL_STATUS.SUCCESS);
    })
    .catch((error) => {
      console.log(
        `appAuth.registerUsingEmailAndPasswordInFirebase: There is a problem registering using email and password`
      );

      onRegistered(null, REGISTER_WITH_EMAIL_STATUS.ERROR);
      if (error !== null || error !== undefined) {
        const errorMessage = error.message;
        console.log(errorMessage);
      }
    });
};

export const signOutInFirebase = (cb: (status: SIGNOUT_STATUS) => void) => {
  signOut(auth)
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
