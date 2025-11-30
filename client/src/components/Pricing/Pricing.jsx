import React from 'react';
import './Pricing.css';
import tickCircle from '../../assets/tickCircle.png'; 

const Pricing = () => {
  return (
    <section className="pricing-section">
      <div className="pricing-header">
        <h2>We have plans for everyone!</h2>
        <p>
          We started with a strong foundation, then simply built all of the sales and
          marketing tools ALL businesses need under one platform.
        </p>
      </div>

      <div className="pricing-container">
      
        <div className="pricing-card">
          <h3 className="plan-name">STARTER</h3>
          <p className="plan-desc">
            Best for local businesses needing to improve their online reputation.
          </p>
          
          <div className="price-block">
            <span className="currency">$199</span>
            <span className="period">/monthly</span>
          </div>

          <h4 className="features-label">What’s included</h4>
          
          <ul className="feature-list">
            <li><img src={tickCircle} alt="check" /> Unlimited Users</li>
            <li><img src={tickCircle} alt="check" /> GMB Messaging</li>
            <li><img src={tickCircle} alt="check" /> Reputation Management</li>
            <li><img src={tickCircle} alt="check" /> GMB Call Tracking</li>
            <li><img src={tickCircle} alt="check" /> 24/7 Award Winning Support</li>
          </ul>

          <button className="btn-plan">SIGN UP FOR STARTER</button>
        </div>

        {/* --- Card 2: GROW --- */}
        <div className="pricing-card">
          <h3 className="plan-name">GROW</h3>
          <p className="plan-desc">
            Best for all businesses that want to take full control of their marketing automation and track their leads, click to close.
          </p>
          
          <div className="price-block">
            <span className="currency">$399</span>
            <span className="period">/monthly</span>
          </div>

          <h4 className="features-label">What’s included</h4>
          
          <ul className="feature-list">
            <li><img src={tickCircle} alt="check" /> Pipeline Management</li>
            <li><img src={tickCircle} alt="check" /> Marketing Automation Campaigns</li>
            <li><img src={tickCircle} alt="check" /> Live Call Transfer</li>
            <li><img src={tickCircle} alt="check" /> GMB Messaging</li>
            <li><img src={tickCircle} alt="check" /> Embed-able Form Builder</li>
            <li><img src={tickCircle} alt="check" /> Reputation Management</li>
            <li><img src={tickCircle} alt="check" /> 24/7 Award Winning Support</li>
          </ul>

          <button className="btn-plan">SIGN UP FOR STARTER</button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;