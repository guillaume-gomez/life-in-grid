import React from 'react';
import GitHubStarLink from "./GithubStarLink";

function Footer(): React.ReactElement {
  return (
    <footer className="p-4 footer bg-base-300 text-base-content footer-center p-6">
      <div>
        <p> 2022 - Made By Guillaume Gomez</p>
        <a href="https://github.com/guillaume-gomez/life-in-grid" className="text-xs">Did you enjoyed ? 😊 Star the project </a>
        <GitHubStarLink />
      </div>
    </footer>
  );
}

export default Footer;