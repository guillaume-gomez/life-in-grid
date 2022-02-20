import React from 'react';
import GitHubStarLink from "./GithubStarLink";

function NavBar(): React.ReactElement {
  return (
     <div className="navbar bg-base-300">
        <div className="flex-1">
          <a className="btn btn-ghost normal-case text-xl">Life in Grid</a>
        </div>
        <div className="flex-none gap-2">
          <div className="rounded-full">
            <GitHubStarLink />
          </div>
        </div>
      </div>
  );
}

export default NavBar;
