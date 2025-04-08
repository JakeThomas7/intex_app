import { useState } from "react";
import "../../styles/privacy/FAQ.css";

function PrivacyFAQItem({ question, children }: { question: string; children: React.ReactNode }) {
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
        <PrivacyFAQItem question="What personal data does CineNiche collect?">
          <p>We collect your name, email, phone number, account credentials, ratings, watch history, and optional demographic data to personalize your streaming experience.</p>
        </PrivacyFAQItem>
        <PrivacyFAQItem question="Why does CineNiche need my data?">
          <p>
          Your data helps us tailor your movie recommendations, improve our platform, and support features like user reviews and favorites.
          </p>
        </PrivacyFAQItem>
        <PrivacyFAQItem question="Who has access to my data?">
          <p>Your data is only accessible to authorized CineNiche team members. We do not sell or share your information with third parties.</p>
        </PrivacyFAQItem>
        {/* Repeat for other questions */}
        <PrivacyFAQItem question="How can I manage or delete my data?">
          <p>You can request a copy of your data or ask us to delete your account by emailing privacy@cineniche.com. We honor all GDPR-related rights.</p>
        </PrivacyFAQItem>
        <PrivacyFAQItem question="Does CineNiche use cookies?">
        <p>Yes, we use cookies to save your login state, improve your recommendations, and enhance site performance. You can control non-essential cookies in your browser settings.</p>
        </PrivacyFAQItem>
        <PrivacyFAQItem question="Who can I contact with privacy questions?">
          <p>
            For any concerns, please email us at <strong>privacy@cineniche.com</strong>. We're happy to answer questions about how your data is used.
          </p>
        </PrivacyFAQItem>
      </div>
    </div>
  );
}

export default PrivacyFAQ;
