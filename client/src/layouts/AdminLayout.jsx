
import { Outlet } from "react-router-dom";
import AdminHeader from "../components/admin/AdminHeader";
import AdminSidebar from "../components/admin/AdminSidebar";
import "../styles/admin.css";

export default function AdminLayout() {
  return (
    <div className="admin-shell">
      <AdminHeader />

      <div className="admin-body">
        <AdminSidebar />

        <div className="admin-main-column">
          <main className="admin-content">
            <Outlet />
          </main>

        </div>
      </div>
    </div>
  );
}
