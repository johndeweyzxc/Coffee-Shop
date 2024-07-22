import useAppAuthModel, { LoginInfo } from "../model/useAppAuthModel";

const useAuthViewModel = () => {
  const verifyLoginInput = (loginInfo: LoginInfo): [boolean, string] => {
    if (loginInfo.Email.length === 0 || loginInfo.Password.length === 0) {
      return [false, "Email and password cannot be empty"];
    }
    return [true, ""];
  };
  const verifyRegisterInput = (loginInfo: LoginInfo): [boolean, string] => {
    if (loginInfo.Email.length === 0 || loginInfo.Password.length === 0) {
      return [false, "Email and password cannot be empty"];
    }
    if (loginInfo.Password.length < 8) {
      return [false, "Password should be greater than 8 characters"];
    }
    return [true, ""];
  };

  const {
    addAuthListener,
    signInWithGoogle,
    logOut,
    logInUsingEmailAndPassword,
    registerUsingEmailAndPassword,
  } = useAppAuthModel();

  return {
    addAuthListener,
    signInWithGoogle,
    logOut,
    logInUsingEmailAndPassword,
    registerUsingEmailAndPassword,

    verifyLoginInput,
    verifyRegisterInput,
  };
};

export default useAuthViewModel;
