import React from "react";
import "./Footer.css";
import logo from "../../assets/logo.png";
import Mail from '../../assets/Mail.png'
import Linkedin from '../../assets/Linkedin.png'
import Twitter from '../../assets/Twitter.png'
import Youtube from '../../assets/Youtube.png'
import Discord from '../../assets/Discord.png'
import Figma from '../../assets/Figma.png'
import instagram from '../../assets/instagram.png'



const Footer = () => {
  return (
    <footer className="footer-section">
      <div className="footer-container">
      
        <div className="footer-brand">
          <div className="logo">
            <img className="cloud-icon" src={logo} />
            <span className="brand-name">Hubly</span>
          </div>
        </div>

        <div className="footer-links">
          {/* Row 1, Column 1 */}
          <div className="link-column">
            <h4>Product</h4>
            <p>Universal checkout</p>
            <p>Payment workflows</p>
            <p>Observability</p>
            <p>UpliftAI</p>
            <p>Apps & integrations</p>
          </div>

          {/* Row 1, Column 2 */}
          <div className="link-column">
            <h4>Why Primer</h4>
            <p>Expand to new markets</p>
            <p>Boost payment success</p>
            <p>Improve conversion rates</p>
            <p>Reduce payments fraud</p>
            <p>Recover revenue</p>
          </div>

          {/* Row 1, Column 3 */}
          <div className="link-column">
            <h4>Developers</h4>
            <p>Primer Docs</p>
            <p>API Reference</p>
            <p>Payment methods guide</p>
            <p>Service status</p>
            <p>Community</p>
          </div>

          {/* Row 2, Column 1 */}
          <div className="link-column">
            <h4>Resources</h4>
            <p>Blog</p>
            <p>Success stories</p>
            <p>News room</p>
            <p>Terms</p>
            <p>Privacy</p>
          </div>

          {/* Row 2, Column 2 */}
          <div className="link-column">
            <h4>Company</h4>
            <p>Careers</p>
          </div>

        
          <div className="footer-socials">
            
            <img src={Mail} alt="E-mail" />
            <img src={Linkedin} alt="Linkedin" />
            <img src={Twitter} alt="Twitter" />
            <img src={Youtube} alt="Youtube" />
            <img src={Discord} alt="Discord" />
            <img src={Figma} alt="Figma" />
            <img src={instagram} alt="Instagram" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
