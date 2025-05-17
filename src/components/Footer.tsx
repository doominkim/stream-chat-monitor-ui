import { ReactNode } from "react";

interface FooterProps {
  children?: ReactNode;
}

const Footer = ({ children }: FooterProps) => {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="copyright">
          © 2024 Stream Chat Monitor. All rights reserved.
        </div>
        <div className="footer-right">{children}</div>
      </div>
    </footer>
  );
};

export default Footer;
