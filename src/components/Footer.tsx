import { ReactNode } from "react";

interface FooterProps {
  children?: ReactNode;
}

const Footer = ({ children }: FooterProps) => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">© 2024 Dominic. All rights reserved.</div>
        <div className="footer-right">
          <div className="footer-links">
            <a
              href="https://github.com/doominkim"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link github"
            >
              <svg
                height="16"
                width="16"
                viewBox="0 0 16 16"
                fill="currentColor"
              >
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
              </svg>
              GitHub
            </a>
            <a
              href="https://kimduumin.oopy.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link blog"
            >
              <svg
                height="16"
                width="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"></path>
                <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-3h2v11h-2z"></path>
              </svg>
              Blog
            </a>
            {children}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
