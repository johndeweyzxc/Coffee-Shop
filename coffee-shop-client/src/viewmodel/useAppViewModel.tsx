import useAppAuthModel from "../model/useAppAuthModel";

const useAppViewModel = () => {
  const {
    addAuthListener,
    signInGoogle,
    signOut,
    signInUsingEmailAndPassword,
    registerUsingEmailAndPassword,
  } = useAppAuthModel();
  return {
    addAuthListener,
    signInGoogle,
    signOut,
    signInUsingEmailAndPassword,
    registerUsingEmailAndPassword,
  };
};

export default useAppViewModel;
