import { useState } from "react";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import PostComposeModal from "../post/PostComposeModal";
import PostDetailPanel from "../post/PostDetailPanel";
import { useAuth } from "../../context/AuthContext";
import "./AppLayout.css";

function AppLayout() {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [showCompose, setShowCompose] = useState(false);
  const [lastPostedAt, setLastPostedAt] = useState(null);

  const hasDetail = !!searchParams.get("post"); // ?post があるか

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className={`layout ${hasDetail ? "has-detail" : ""}`}>
      <SideBar onCompose={() => setShowCompose(true)} />
      <div className="main">
        <NavBar />
        <Outlet context={{ lastPostedAt }} />
      </div>

      {/* 右カラム：?post=123 があるときだけ表示 */}
      <PostDetailPanel />

      {showCompose && (
        <PostComposeModal
          onClose={() => setShowCompose(false)}
          onPosted={() => setLastPostedAt(Date.now())}
        />
      )}
    </div>
  );
}

export default AppLayout;