export default function AuthLayout({ title, lead, children }) {
  return (
    <div className="container container--narrow auth-page">
      <div className="auth-shell">
        <div className="auth-shell__brand">
          <img src="/favicon.png" alt="" className="auth-shell__logo" />
          <h2>EvoTest</h2>
          <p>{lead}</p>
          <ul className="auth-perks">
            <li>Timed MCQ assessments</li>
            <li>Instant score & review</li>
            <li>Five subject areas ready</li>
          </ul>
        </div>
        <div className="card auth-card">
          <h1>{title}</h1>
          {children}
        </div>
      </div>
    </div>
  );
}
