import React from "react";
import './Feature.css'
import line1 from '../../assets/line1.png';
import line2 from '../../assets/line2.png';
import line3 from '../../assets/line3.png';
import box1 from '../../assets/box1.png';
import box2 from '../../assets/box2.png';
import box3 from '../../assets/box3.png';
import brandIcons from '../../assets/brandIcons.png'

const Feature = () => {
  return (
    <section className="features">
      <div className="section-header">
        <h2>At its core, Hubly is a robust CRM solution.</h2>
        <p>
         Hubly helps businesses streamline customer interactions, track leads, and automate tasks-saving you time and maximizing revenue. Whether you're a startup or an enterprise, Hubly adapts to your needs, giving you the tools to scale efficiently.
        </p>
      </div>

      <div className="features-container">
        <div className="feature-list">
          <div className="feature-item">
            <h3>MULTIPLE PLATFORMS TOGETHER!</h3>
            <p>
            Email communication is a breeze with our fully integrated, drag & drop email builder.
            </p>
          </div>
          <div className="feature-item">
            <h3>CLOSE</h3>
            <p>Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more!</p>
          </div>
          <div className="feature-item">
            <h3>NURTURE</h3>
            <p>Capture leads using our landing pages, surveys, forms, calendars, inbound phone system & more!</p>
          </div>
        </div>
        <div className="feature-visual">
          {/* Placeholder for the Funnel Graphic */}
          <div className="Brand_icons">
            <img src={brandIcons} alt="Icons" />
            </div>
          <div className="funnel-graphic">
            <p>CAPTURE</p>
            <img src={line3} alt="line-3" />
            <img src={box3} alt="box-3" />
          </div>
          <div className="funnel-graphic">
            <p>NURTURE</p>
            <img src={line2} alt="line-2" />
            <img src={box2} alt="box-2" />
          </div>
          <div className="funnel-graphic">
            <p>CLOSE</p>
            <img src={line1} alt="line-1" />
            <img src={box1} alt="box-1" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Feature;
