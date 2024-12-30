import { FunctionComponent } from "react";
import { Link } from "react-router";
import classNames from "classnames";

export const Thumbnail: FunctionComponent<{
  imgSrc: string;
  path: string;
  isSelected?: boolean;
}> = ({ imgSrc, path, isSelected }) => {
  return (
    <Link to={path}>
      <img
        src={imgSrc}
        className={classNames("w-full rounded-md", {
          "border-2 border-white": isSelected,
        })}
      />
    </Link>
  );
};
