import React from 'react';
import GitHubStarLink from "./GithubStarLink";

function Footer(): React.ReactElement {
  return (
    <footer className="footer bg-base-300 text-base-content footer-center p-6">
      <div>
        <a href="https://waitbutwhy.com/2014/05/life-weeks.html" className="link text-lg">More information about this project</a>
        <p> 2022 - Made By Guillaume Gomez</p>
        <a href="https://github.com/guillaume-gomez/life-in-grid" className="text-xs">Did you enjoyed ? 😊 Star the project </a>
        <GitHubStarLink />
      </div>
    </footer>
  );
}

export default Footer;