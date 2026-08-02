import React from "react";
import { Link } from "react-router-dom";
import { CONFIG } from "@/lib/charityConfig";

export default function PrivacyPolicy() {
  return (
    <div className="charity-site">
      <div className="wrap section" style={{ maxWidth: 760 }}>
        <Link to="/" className="btn btn--ghost btn--sm" style={{ marginBottom: "1.4rem" }}>
          ← Back to home
        </Link>
        <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.6rem)", marginBottom: ".4rem" }}>
          Privacy Policy
        </h1>
        <p style={{ color: "var(--ink-soft)", marginBottom: "2rem" }}>
          Last updated: August 2, 2026
        </p>

        <div className="prose" style={{ color: "var(--ink)", lineHeight: 1.7 }}>
          <p>
            {CONFIG.orgName} (“we”, “us”) operates the {CONFIG.website} website and mobile
            application (the “App”). This policy explains what information we collect and how we
            use it. By using the App, you agree to the practices described here.
          </p>

          <h2 style={{ fontSize: "1.25rem", marginTop: "1.8rem", marginBottom: ".5rem" }}>
            Information we collect
          </h2>
          <p>When you make a donation or add your name to our donor wall, we may collect:</p>
          <ul style={{ paddingLeft: "1.2rem", marginBottom: "1rem" }}>
            <li>Your name (optional — you may donate anonymously).</li>
            <li>An optional message for the elders.</li>
            <li>The donation amount and frequency (one-time or monthly).</li>
          </ul>
          <p>
            Technical information such as device type and browser may also be collected
            automatically to keep the App secure and reliable.
          </p>

          <h2 style={{ fontSize: "1.25rem", marginTop: "1.8rem", marginBottom: ".5rem" }}>
            How we use your information
          </h2>
          <ul style={{ paddingLeft: "1.2rem", marginBottom: "1rem" }}>
            <li>To display your name and message on the public donor wall (unless you choose to remain anonymous).</li>
            <li>To issue donation receipts and 80G tax documents when requested.</li>
            <li>To thank donors and, with your consent, share occasional updates about the home.</li>
            <li>To detect and prevent fraud or abuse.</li>
          </ul>

          <h2 style={{ fontSize: "1.25rem", marginTop: "1.8rem", marginBottom: ".5rem" }}>
            Payments
          </h2>
          <p>
            Donations are made directly through UPI to the foundation's bank account
            ({CONFIG.bank.bankName}, A/C ending{" "}
            {CONFIG.bank.accountNumber.slice(-4)}). We do <strong>not</strong> collect, process,
            or store any card numbers, bank credentials, or payment-card data within the App.
            UPI transactions are handled entirely by your banking/UPI app and the NPCI network.
          </p>

          <h2 style={{ fontSize: "1.25rem", marginTop: "1.8rem", marginBottom: ".5rem" }}>
            Data storage &amp; security
          </h2>
          <p>
            Donor records are stored securely on our hosting platform with access controls.
            Only authorized administrators of {CONFIG.orgName} can view or manage full donor
            details.
          </p>

          <h2 style={{ fontSize: "1.25rem", marginTop: "1.8rem", marginBottom: ".5rem" }}>
            Your rights
          </h2>
          <p>
            You may request access to, correction of, or deletion of your personal data at any
            time by contacting us using the details below. Anonymous donations leave only the
            donation amount and frequency — no personally identifying information.
          </p>

          <h2 style={{ fontSize: "1.25rem", marginTop: "1.8rem", marginBottom: ".5rem" }}>
            Children's privacy
          </h2>
          <p>
            The App is not directed to children under 18, and we do not knowingly collect
            personal information from minors.
          </p>

          <h2 style={{ fontSize: "1.25rem", marginTop: "1.8rem", marginBottom: ".5rem" }}>
            Contact us
          </h2>
          <p>
            Questions about this policy or your data? Email or call us — see our{" "}
            <Link to="/support" className="link-strong">Support page</Link>. You can also reach
            us at <a href={`tel:${CONFIG.phone}`} className="link-strong">{CONFIG.phone}</a> or
            visit {CONFIG.location}.
          </p>

          <p style={{ marginTop: "2rem", color: "var(--ink-soft)", fontSize: ".9rem" }}>
            © {new Date().getFullYear()} {CONFIG.orgName}. Reg. No. {CONFIG.societyRegNo}.
          </p>
        </div>
      </div>
    </div>
  );
}