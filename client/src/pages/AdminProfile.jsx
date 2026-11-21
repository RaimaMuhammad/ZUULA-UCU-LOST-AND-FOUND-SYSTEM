
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminProfile() {
  const { user } = useAuth();

  const initialProfile = {
    fullName: user?.fullName || user?.full_name || "Administrator",
    email: user?.email || "",
    staffId: user?.staffId || user?.staff_id || "",
    role: user?.role || "Administrator",
    department: user?.department || "",
    phone: user?.phone || user?.phone_number || "",
  };

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  function handleChange(e) {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSave(e) {
    e.preventDefault();

    // Backend profile update will be connected separately.
    setIsEditing(false);
  }

  function handleCancel() {
    setProfile(initialProfile);
    setIsEditing(false);
  }

  const initials = profile.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <div className="admin-profile-page">

      {/* PAGE HEADING */}
      <div className="admin-profile-heading">
        <h1>My Profile</h1>
        <p>View and manage your administrator account information.</p>
      </div>

      {/* MAIN PROFILE LAYOUT */}
      <div className="admin-profile-layout">

        {/* LEFT PROFILE CARD */}
        <section className="admin-profile-card">

          <div className="admin-profile-cover">
            <div className="admin-profile-cover-pattern"></div>
          </div>

          <div className="admin-profile-avatar-wrapper">
            <div className="admin-profile-avatar">
              {initials || "A"}
            </div>
          </div>

          <div className="admin-profile-user-information">
            <h2>{profile.fullName}</h2>

            <p className="admin-profile-email">
              {profile.email}
            </p>

            <span className="admin-profile-role">
              {profile.role}
            </span>
          </div>

          <div className="admin-profile-card-divider"></div>

          <div className="admin-profile-staff-number">
            <span>Staff ID</span>
            <strong>{profile.staffId || "Not provided"}</strong>
          </div>

          <div className="admin-profile-edit-action">
            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
              >
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                className="admin-profile-cancel-edit"
                onClick={handleCancel}
              >
                Cancel Editing
              </button>
            )}
          </div>

        </section>

        {/* RIGHT INFORMATION PANEL */}
        <section className="admin-profile-account-panel">

          <div className="admin-profile-account-heading">
            <h2>Personal Information</h2>
            <p>Manage your administrator account details.</p>
          </div>

          <form onSubmit={handleSave}>

            <div className="admin-profile-form-fields">

              <div className="admin-profile-field">
                <label htmlFor="adminFullName">Full Name</label>
                <input
                  id="adminFullName"
                  name="fullName"
                  type="text"
                  value={profile.fullName}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="admin-profile-field">
                <label htmlFor="adminEmail">Email Address</label>
                <input
                  id="adminEmail"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleChange}
                  disabled={!isEditing}
                  required
                />
              </div>

              <div className="admin-profile-field">
                <label htmlFor="adminStaffId">Staff ID</label>
                <input
                  id="adminStaffId"
                  name="staffId"
                  type="text"
                  value={profile.staffId}
                  disabled
                />
              </div>

              <div className="admin-profile-field">
                <label htmlFor="adminRole">Role</label>
                <input
                  id="adminRole"
                  name="role"
                  type="text"
                  value={profile.role}
                  disabled
                />
              </div>

              <div className="admin-profile-field">
                <label htmlFor="adminDepartment">Department</label>
                <input
                  id="adminDepartment"
                  name="department"
                  type="text"
                  value={profile.department}
                  onChange={handleChange}
                  disabled={!isEditing}
                />
              </div>

              <div className="admin-profile-field">
                <label htmlFor="adminPhone">Phone Number</label>
                <input
                  id="adminPhone"
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
              <div className="admin-profile-form-actions">
                <button type="submit" className="admin-save-button">
                  Save Changes
                </button>

                <button
                  type="button"
                  className="admin-cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            )}

          </form>

          {/* ACCOUNT INFORMATION */}
          <div className="admin-profile-account-divider"></div>

          <div className="admin-profile-account-heading admin-account-info-heading">
            <h2>Account Information</h2>
            <p>Details about your UCU administrator account.</p>
          </div>

          <div className="admin-profile-account-details">

            <div className="admin-profile-detail-row">
              <span>Account Type</span>
              <strong>Administrator</strong>
            </div>

            <div className="admin-profile-detail-row">
              <span>Account Status</span>
              <strong className="admin-profile-active">Active</strong>
            </div>

            <div className="admin-profile-detail-row">
              <span>Staff ID</span>
              <strong>{profile.staffId || "Not provided"}</strong>
            </div>

            <div className="admin-profile-detail-row">
              <span>Department</span>
              <strong>{profile.department || "Not provided"}</strong>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}
