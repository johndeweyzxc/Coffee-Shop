import { useState } from "react";
import { HOME_PAGE } from "../strings";

export type Anchor = "top" | "left" | "bottom" | "right";

const useAppController = () => {
  // * STATE MANAGEMENT FOR APPLICATION
  // The current page being shown bellow the header
  const [currentPage, setCurrentPage] = useState<string>(HOME_PAGE);
  // Use for drawer for small screen sizes
  const [isOpenDrawer, setIsOpenDrawer] = useState<boolean>(false);

  const onCloseDrawer = () => setIsOpenDrawer(false);
  const onOpenDrawer = () => setIsOpenDrawer(true);

  const onChangeCurrentPage = (page: string) => setCurrentPage(page);

  return {
    currentPage,
    onChangeCurrentPage,
    isOpenDrawer,
    onOpenDrawer,
    onCloseDrawer,
  };
};

export default useAppController;
