import React, { useState } from "react";
import "/Users/mjmikes/Downloads/Classes/INTEX2/intex_app-main/frontend/src/styles/privacy/FAQ.css"; // Ensure your CSS file is correctly linked

function PrivacyFAQItem({ question, children }) {
  const [isOpen, setIsOpen] = useState(false); // State to handle open/close

  return (
    <div className="faq-item">
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question}
        <span className={`faq-toggle ${isOpen ? "open" : ""}`}>+</span>
      </button>
      {isOpen && <div className="faq-answer">{children}</div>}
    </div>
  );
}

function PrivacyFAQ() {
  return (
    <div className="faq-background">
      <div className="faq-container">
        <PrivacyFAQItem question="What Is Personal Data at Apple?">
          <p>Details about what personal data Apple considers.</p>
        </PrivacyFAQItem>
        <PrivacyFAQItem question="Your Privacy Rights at Apple">
          <p>
            Information about your rights regarding your personal data at Apple.
          </p>
        </PrivacyFAQItem>
        <PrivacyFAQItem question="Personal Data Apple Collects from You">
          <p>Examples of the data Apple collects directly from you.</p>
        </PrivacyFAQItem>
        {/* Repeat for other questions */}
        <PrivacyFAQItem question="Privacy Questions">
          <p>If you have any privacy concerns, please contact us.</p>
        </PrivacyFAQItem>
      </div>
    </div>
  );
}

export default PrivacyFAQ;
