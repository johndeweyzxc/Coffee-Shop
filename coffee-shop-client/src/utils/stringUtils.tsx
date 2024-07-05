export const truncateDescription = (str: string) => {
  return str.length > 60 ? str.substring(0, 60) + "..." : str;
};

export const truncateName = (str: string) => {
  return str.length > 20 ? str.substring(0, 20) + "..." : str;
};
