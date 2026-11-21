
function ScreenPlaceholder() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        fontFamily: "Arial, sans-serif",
        fontSize: "18px",
        color: "#555555",
      }}
    >
      CLAIM SUBMITTED SUCCESSFULLY! <br />
      <span style={{ fontSize: "14px", color: "#888888" }}>
        Please wait for the administrator to review your claim.
      </span>
    </div>
  );
}

export default ScreenPlaceholder;
