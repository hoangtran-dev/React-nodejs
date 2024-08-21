import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Footer from "src/components/footer/footer";

import Sidebar from "src/components/Sidebar";

function AdminLayout() {
  const navigate = useNavigate();
  const token = localStorage.getItem("Token");
  useEffect(() => {
    if (!token) {
      navigate("/404");
      return;
    }
  }, [token, navigate]);
  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px" }}>
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default AdminLayout;
