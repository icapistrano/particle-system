import { FunctionComponent } from "react";
import { Link } from "react-router";
import { AppRoutes } from "../routes/AppRoutes";

export const Home: FunctionComponent = () => {
  return (
    <div className="h-screen flex justify-center items-center bg-[#1A1A1A] text-white">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 sm:px-8 lg:px-16 w-full max-w-screen-xl">
        {AppRoutes.filter((route) => route.videoSrc !== undefined).map(
          ({ videoSrc, title, path }) => (
            <Thumbnail
              key={path}
              videoSrc={videoSrc!}
              title={title}
              path={path}
            />
          ),
        )}
      </div>
    </div>
  );
};

const Thumbnail: FunctionComponent<{
  videoSrc: string;
  title: string;
  path: string;
}> = ({ videoSrc, title, path }) => {
  return (
    <div className="relative rounded-xl overflow-hidden">
      <video
        src={videoSrc}
        autoPlay
        playsInline
        loop
        className="w-full h-auto object-cover"
      />
      <div className="absolute bottom-0 p-5 w-full flex justify-between items-center">
        <h2 className="text-lg">{title}</h2>
        <Link to={path}>
          <div className="rounded-full w-8 h-8 bg-white bg-opacity-10 flex justify-center items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              width="24"
              height="24"
              strokeWidth="2"
            >
              <path d="M17 7l-10 10"></path>
              <path d="M8 7l9 0l0 9"></path>
            </svg>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;
