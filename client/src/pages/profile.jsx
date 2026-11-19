export default function Profile() {
  return (
    <div className="profile-page">
      <h1>My Profile</h1>
      <p>View your account information.</p>

      <section className="profile-information">
        <div className="profile-avatar">JD</div>

        <h2>Jane Doe</h2>
        <p>Student · Uganda Christian University</p>
      </section>

      <section className="profile-details">
        <h2>Personal Information</h2>

        <div className="profile-detail-row">
          <span>Full Name</span>
          <strong>Jane Doe</strong>
        </div>

        <div className="profile-detail-row">
          <span>Email Address</span>
          <strong>jane@student.ucu.ac.ug</strong>
        </div>

        <div className="profile-detail-row">
          <span>Student Number</span>
          <strong>2026-00000</strong>
        </div>

        <div className="profile-detail-row">
          <span>Account Type</span>
          <strong>Student</strong>
        </div>
      </section>
    </div>
  );
}