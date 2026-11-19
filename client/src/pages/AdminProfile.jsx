import { useState } from "react";

export default function AdminProfile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    fullName: "System Administrator",
    email: "admin@ucu.ac.ug",
    staffId: "UCU-ADMIN-001",
    role: "System Administrator",
    department: "Computing and Technology",
    phone: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();
    setIsEditing(false);
  }

  function handleCancel() {
    setIsEditing(false);
  }

  return (
    <div className="admin-profile-page">
      <div className="page-heading">
        <div>
          <h1>My Profile</h1>
          <p>View and manage your administrator account information.</p>
        </div>

        {!isEditing && (
          <button
            type="button"
            className="primary-button"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </button>
        )}
      </div>

      <section className="admin-profile-overview">
        <div className="admin-profile-avatar">
          {profile.fullName.charAt(0)}
        </div>

        <div className="admin-profile-summary">
          <h2>{profile.fullName}</h2>
          <p>{profile.role}</p>
          <span className="admin-account-status">Active Account</span>
        </div>
      </section>

      <section className="admin-profile-information">
        <div className="profile-section-heading">
          <h2>Personal Information</h2>
        </div>

        <form onSubmit={handleSave}>
          <div className="admin-profile-fields">
            <div className="profile-field">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                value={profile.fullName}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            <div className="profile-field">
              <label htmlFor="staffId">Staff ID</label>
              <input
                id="staffId"
                name="staffId"
                type="text"
                value={profile.staffId}
                disabled
              />
            </div>

            <div className="profile-field">
              <label htmlFor="role">Role</label>
              <input
                id="role"
                name="role"
                type="text"
                value={profile.role}
                disabled
              />
            </div>

            <div className="profile-field">
              <label htmlFor="department">Department</label>
              <input
                id="department"
                name="department"
                type="text"
                value={profile.department}
                onChange={handleChange}
                disabled={!isEditing}
              />
            </div>

            <div className="profile-field">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={profile.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
                disabled={!isEditing}
              />
            </div>
          </div>

          {isEditing && (
            <div className="admin-profile-actions">
              <button type="submit" className="primary-button">
                Save Changes
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleCancel}
              >
                Cancel
              </button>
            </div>
          )}
        </form>
      </section>

      <section className="admin-account-information">
        <h2>Account Information</h2>

        <div className="profile-detail-row">
          <span>Account Type</span>
          <strong>Administrator</strong>
        </div>

        <div className="profile-detail-row">
          <span>Account Status</span>
          <strong>Active</strong>
        </div>
      </section>
    </div>
  );
}