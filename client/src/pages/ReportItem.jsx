
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import StudentTopbar from "../components/layout/StudentTopbar";
import StudentSidebar from "../components/layout/StudentSidebar";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export default function ReportItem() {
  const navigate = useNavigate();
  const locationState = useLocation();
  const fileInputRef = useRef(null);

  // A report passed through navigation state means edit mode.
  const editingReport = locationState.state?.report || null;
  const isEditing = Boolean(editingReport);

  const [reportType, setReportType] = useState("Lost");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [time, setTime] = useState("");

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [originalImage, setOriginalImage] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load the selected report when opening the page in edit mode.
  useEffect(() => {
    if (!editingReport) return;

    setReportType(
      String(editingReport.report_type || "lost").toLowerCase() === "found"
        ? "Found"
        : "Lost"
    );

    setTitle(editingReport.title || "");
    setCategory(editingReport.category || "");
    setDescription(editingReport.description || "");
    setLocation(editingReport.location || "");

    // Convert the saved date into the form's date and time fields.
    if (editingReport.incident_date) {
      const savedDate = new Date(editingReport.incident_date);

      if (!Number.isNaN(savedDate.getTime())) {
        setDay(String(savedDate.getDate()).padStart(2, "0"));
        setMonth(String(savedDate.getMonth() + 1).padStart(2, "0"));
        setYear(String(savedDate.getFullYear()));
        setTime(
          `${String(savedDate.getHours()).padStart(2, "0")}:${String(
            savedDate.getMinutes()
          ).padStart(2, "0")}`
        );
      }
    }

    // Display the existing report photograph.
    if (editingReport.image_url) {
      const existingImage = editingReport.image_url.startsWith("http")
        ? editingReport.image_url
        : `${API_ORIGIN}${
            editingReport.image_url.startsWith("/") ? "" : "/"
          }${editingReport.image_url}`;

      setOriginalImage(existingImage);
      setImagePreview(existingImage);
    }
  }, [editingReport]);

  // Clean up only temporary browser image previews.
  useEffect(() => {
    return () => {
      if (imagePreview.startsWith("blob:")) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  function handleImageChange(e) {
    const selectedImage = e.target.files?.[0];

    setError("");

    if (!selectedImage) return;

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedTypes.includes(selectedImage.type)) {
      setError("Please select a JPG, PNG, WEBP or GIF image.");
      e.target.value = "";
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      setError("The photograph must not exceed 5MB.");
      e.target.value = "";
      return;
    }

    setImage(selectedImage);
    setImagePreview(URL.createObjectURL(selectedImage));
  }

  function removeImage() {
    setImage(null);
    setImagePreview(originalImage);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (loading) return;

    setError("");

    if (!day || !month || !year || !time) {
      setError("Please enter the complete date and time.");
      return;
    }

    const numericDay = Number(day);
    const numericMonth = Number(month);
    const numericYear = Number(year);

    const dateCheck = new Date(
      numericYear,
      numericMonth - 1,
      numericDay
    );

    if (
      dateCheck.getFullYear() !== numericYear ||
      dateCheck.getMonth() !== numericMonth - 1 ||
      dateCheck.getDate() !== numericDay ||
      numericYear < 2000 ||
      numericYear > 2100
    ) {
      setError("Please enter a valid date.");
      return;
    }

    const formattedDate = `${year}-${month.padStart(
      2,
      "0"
    )}-${day.padStart(2, "0")}T${time}`;

    const formData = new FormData();

    formData.append("reportType", reportType.toLowerCase());
    formData.append("title", title.trim());
    formData.append("category", category);
    formData.append("description", description.trim());
    formData.append("location", location.trim());
    formData.append("incidentDate", formattedDate);

    // Only attach a photograph if the student selected a new one.
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);

      const url = isEditing
        ? `${API_BASE_URL}/reports/${editingReport.id}`
        : `${API_BASE_URL}/reports`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Unable to update your report."
              : "Unable to submit your report.")
        );
      }

      if (isEditing) {
        // Updating an existing report does not create a new report.
        navigate("/my-reports", {
          replace: true,
          state: { updated: true },
        });
      } else {
        // New reports continue to use the confirmation page.
        navigate("/report-submitted", {
          replace: true,
          state: {
            reportType,
            report: data.report || null,
          },
        });
      }
    } catch (err) {
      setError(err.message || "Unable to connect to the server.");
      setLoading(false);
    }
  }

  return (
    <div className="student-dashboard report-dashboard">
      <StudentTopbar />

      <div className="student-dashboard-body">
        <StudentSidebar />

        <main className="student-dashboard-content">
          <div className="report-item-page">

            <div className="report-page-heading">
              <h1>{isEditing ? "Edit report" : "Report item"}</h1>

              <p>
                {isEditing
                  ? "Update the information about your reported item."
                  : "Add the item details so its owner can find it."}
              </p>
            </div>

            <form className="report-form" onSubmit={handleSubmit}>

              {/* LEFT PANEL */}
              <section className="report-photo-panel">

                <div className="report-type-selection">
                  <button
                    type="button"
                    className={`report-type-button lost-type ${
                      reportType === "Lost" ? "selected" : ""
                    }`}
                    onClick={() => setReportType("Lost")}
                    disabled={isEditing}
                  >
                    Lost Item
                  </button>

                  <button
                    type="button"
                    className={`report-type-button found-type ${
                      reportType === "Found" ? "selected" : ""
                    }`}
                    onClick={() => setReportType("Found")}
                    disabled={isEditing}
                  >
                    Found Item
                  </button>
                </div>

                <div className="report-photo-area">
                  <div className="report-photo-circle">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Reported item"
                      />
                    ) : (
                      <div className="report-photo-placeholder">
                        <span>+</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="report-camera-button"
                    onClick={() => fileInputRef.current?.click()}
                    aria-label="Upload item photograph"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="25"
                      height="25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M14 4H10L8 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4z" />
                      <circle cx="12" cy="13" r="3" />
                    </svg>
                  </button>
                </div>

                <input
                  ref={fileInputRef}
                  id="item-photo"
                  className="report-hidden-file-input"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={handleImageChange}
                />

                <button
                  type="button"
                  className="report-change-photo"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Change photo
                </button>

                {image && (
                  <button
                    type="button"
                    className="report-remove-photo"
                    onClick={removeImage}
                  >
                    Remove selected photo
                  </button>
                )}

                <div className="report-photo-guidance">
                  <p>Add a clear photo of the item.</p>

                  <p>
                    Your photo helps the right person
                    recognise their belongings.
                  </p>

                  <small>
                    JPG, PNG, WEBP or GIF. Maximum size: 5MB.
                  </small>
                </div>
              </section>

              {/* RIGHT PANEL */}
              <section className="report-details-panel">

                <div className="report-field report-field-full">
                  <label htmlFor="item-title">Item name</label>

                  <input
                    id="item-title"
                    type="text"
                    placeholder="Enter item name"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={150}
                    required
                  />
                </div>

                <div className="report-fields-two">
                  <div className="report-field">
                    <label htmlFor="item-category">
                      Choose a category
                    </label>

                    <select
                      id="item-category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      <option value="Electronics">Electronics</option>
                      <option value="Bags">Bags</option>
                      <option value="Books">Books</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Keys">Keys</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="report-field">
                    <label htmlFor="item-location">
                      Choose a location
                    </label>

                    <input
                      id="item-location"
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="report-field report-date-section">
                  <label>Enter the date and time</label>

                  <div className="report-date-fields">
                    <input
                      type="number"
                      placeholder="DD"
                      aria-label="Day"
                      min="1"
                      max="31"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      required
                    />

                    <input
                      type="number"
                      placeholder="MM"
                      aria-label="Month"
                      min="1"
                      max="12"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      required
                    />

                    <input
                      type="number"
                      placeholder="YYYY"
                      aria-label="Year"
                      min="2000"
                      max="2100"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      required
                    />

                    <input
                      type="time"
                      aria-label="Time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="report-field report-description-field">
                  <label htmlFor="item-description">
                    About the item
                  </label>

                  <textarea
                    id="item-description"
                    rows="4"
                    placeholder="Describe the item and provide any useful details."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>

                {error && (
                  <div
                    className="report-error-message"
                    role="alert"
                  >
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  className="primary-button"
                  disabled={loading}
                >
                  {loading
                    ? isEditing
                      ? "Saving changes..."
                      : "Submitting report..."
                    : isEditing
                      ? "Save Changes"
                      : `Add to ${reportType.toLowerCase()}`}
                </button>

              </section>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
