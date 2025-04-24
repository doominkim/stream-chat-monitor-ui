import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer>
      <div className="footer-content">
        <div className="copyright">
          © 2024 Stream Chat Monitor. All rights reserved.
        </div>
        <div className="footer-links">
          <Link to="/terms" className="footer-link">
            Terms of Service
          </Link>
          <Link to="/privacy" className="footer-link">
            Privacy Policy
          </Link>
          <Link to="/contact" className="footer-link">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
