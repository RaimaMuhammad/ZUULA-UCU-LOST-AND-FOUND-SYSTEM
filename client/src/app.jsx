
import { Routes, Route } from "react-router-dom";

// Public pages
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Student pages
import Home from "./pages/Home";
import SearchResults from "./pages/SearchResults";
import ItemDetails from "./pages/ItemDetails";
import ReportItem from "./pages/ReportItem";
import ReportSubmitted from "./pages/ReportSubmitted";
import SubmitClaim from "./pages/SubmitClaim";
import ClaimSubmitted from "./pages/ClaimSubmitted";
import MyReports from "./pages/MyReports";
import MyClaims from "./pages/MyClaims";
import Messages from "./pages/messages";
import Profile from "./pages/profile";

// Admin pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminClaims from "./pages/AdminClaims";
import ReviewClaim from "./pages/ReviewClaim";
import AdminClaimDecision from "./pages/AdminClaimDecision";
import ClaimApproved from "./pages/ClaimApproved";
import AdminConfirmReturn from "./pages/AdminConfirmReturn";
import AdminMessages from "./pages/AdminMessages";
import AdminProfile from "./pages/AdminProfile";

// Other pages
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student pages */}
      <Route path="/home" element={<Home />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/item/:id" element={<ItemDetails />} />
      <Route path="/report-item" element={<ReportItem />} />
      <Route path="/report-submitted" element={<ReportSubmitted />} />
      <Route path="/submit-claim/:id" element={<SubmitClaim />} />
      <Route path="/claim-submitted" element={<ClaimSubmitted />} />
      <Route path="/my-reports" element={<MyReports />} />
      <Route path="/my-claims" element={<MyClaims />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/profile" element={<Profile />} />

      {/* Admin pages */}
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/reports" element={<AdminReports />} />
      <Route path="/admin/claims" element={<AdminClaims />} />
      <Route path="/admin/review-claim/:id" element={<ReviewClaim />} />
      <Route
        path="/admin/claim-decision/:id"
        element={<AdminClaimDecision />}
      />
      <Route
        path="/admin/claim-approved/:id"
        element={<ClaimApproved />}
      />
      <Route
        path="/admin/confirm-return/:id"
        element={<AdminConfirmReturn />}
      />
      <Route path="/admin/messages" element={<AdminMessages />} />
      <Route path="/admin/profile" element={<AdminProfile />} />

      {/* Page not found */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
