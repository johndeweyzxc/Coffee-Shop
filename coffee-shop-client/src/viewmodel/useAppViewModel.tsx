import useAppAuthModel from "../model/useAppAuthModel";

const useAppViewModel = () => {
  const { addAuthListener, removeAuthListener, signInGoogle, signOut } =
    useAppAuthModel();
  return {
    addAuthListener,
    removeAuthListener,
    signInGoogle,
    signOut,
  };
};

export default useAppViewModel;
