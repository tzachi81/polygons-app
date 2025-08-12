import classes from "./appLoader.module.scss";
import type { FC } from "react";

interface IAppLoaderProps {}

export const AppLoader: FC<IAppLoaderProps> = () => {
  return <div className={classes.appLoader}></div>;
};
