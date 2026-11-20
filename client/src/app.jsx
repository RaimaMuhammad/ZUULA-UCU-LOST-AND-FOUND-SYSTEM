
import { Routes, Route } from "react-router-dom";

// PUBLIC PAGES
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";

// STUDENT PAGES
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

// ADMINISTRATOR PAGES
import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminReportDetails from "./pages/AdminReportDetails";
import AdminClaims from "./pages/AdminClaims";
import ReviewClaim from "./pages/ReviewClaim";
import ClaimApproved from "./pages/ClaimApproved";
import AdminConfirmReturn from "./pages/AdminConfirmReturn";
import AdminMessages from "./pages/AdminMessages";
import AdminProfile from "./pages/AdminProfile";

// ADMINISTRATOR LAYOUT
import AdminLayout from "./layouts/AdminLayout";

// GENERAL
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<Welcome />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* STUDENT ROUTES */}
      <Route
        element={<ProtectedRoute allowedRoles={["student"]} />}
      >
        <Route path="/home" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/item/:id" element={<ItemDetails />} />
        <Route path="/report-item" element={<ReportItem />} />
        <Route
          path="/report-submitted"
          element={<ReportSubmitted />}
        />
        <Route
          path="/submit-claim/:id"
          element={<SubmitClaim />}
        />
        <Route
          path="/claim-submitted"
          element={<ClaimSubmitted />}
        />
        <Route path="/my-reports" element={<MyReports />} />
        <Route path="/my-claims" element={<MyClaims />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* ADMINISTRATOR ROUTES */}
      <Route
        element={<ProtectedRoute allowedRoles={["admin"]} />}
      >
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />

          {/* Manage all reports */}
          <Route path="/admin/reports" element={<AdminReports />} />

          {/* View individual report details */}
          <Route
            path="/admin/reports/:id"
            element={<AdminReportDetails />}
          />

          {/* Existing administrator item page */}
          <Route path="/admin/item/:id" element={<ItemDetails />} />

          {/* Manage ownership claims */}
          <Route path="/admin/claims" element={<AdminClaims />} />

          {/* Review an individual claim */}
          <Route
            path="/admin/review-claim/:id"
            element={<ReviewClaim />}
          />

          {/* Successful claim approval */}
          <Route
            path="/admin/claim-approved/:id"
            element={<ClaimApproved />}
          />

          {/* Confirm physical return of item */}
          <Route
            path="/admin/confirm-return/:id"
            element={<AdminConfirmReturn />}
          />

          {/* Administrator messages */}
          <Route
            path="/admin/messages"
            element={<AdminMessages />}
          />

          {/* Administrator profile */}
          <Route
            path="/admin/profile"
            element={<AdminProfile />}
          />
        </Route>
      </Route>

      {/* PAGE NOT FOUND */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
