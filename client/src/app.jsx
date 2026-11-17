
import { Routes, Route } from "react-router-dom";

// General screens
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student screens
import Dashboard from "./pages/Dashboard";
import SearchResults from "./pages/SearchResults";
import ReportItem from "./pages/ReportItem";
import ReportSubmitted from "./pages/ReportSubmitted";
import ItemDetails from "./pages/ItemDetails";
import SubmitClaim from "./pages/SubmitClaim";
import ClaimSubmitted from "./pages/ClaimSubmitted";
import MyReports from "./pages/MyReports";
import MyClaims from "./pages/MyClaims";
import Messages from "./pages/Messages";
import Profile from "./pages/Profile";

// Administrator screens
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminClaims from "./pages/AdminClaims";
import ReviewClaim from "./pages/ReviewClaim";
import ClaimDecision from "./pages/AdminClaimDecision";
import ConfirmReturn from "./pages/AdminConfirmReturn";
import AdminMessages from "./pages/AdminMessages";
import AdminProfile from "./pages/AdminProfile";

function App() {
  return (
    <Routes>
      {/* General */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/item/:id" element={<ItemDetails />} />
      <Route path="/submit-claim/:id" element={<SubmitClaim />} />
      <Route path="/claim-submitted" element={<ClaimSubmitted />} />
      <Route path="/report-item" element={<ReportItem />} />
      <Route path="/report-submitted" element={<ReportSubmitted />} />
      <Route path="/my-reports" element={<MyReports />} />
      <Route path="/my-claims" element={<MyClaims />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />

      {/* Administrator */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/claims" element={<AdminClaims />} />
      <Route path="/admin/review-claim/:id" element={<ReviewClaim />} />
      <Route path="/admin/claim-decision/:id" element={<ClaimDecision />} />
      <Route path="/admin/confirm-return/:id" element={<ConfirmReturn />} />
      <Route path="/admin/messages" element={<AdminMessages />} />
      <Route path="/admin/profile" element={<AdminProfile />} />

      {/* Unknown routes */}
      <Route path="*" element={<h2>404 - Page Not Found</h2>} />
    </Routes>
  );
}

export default App;
