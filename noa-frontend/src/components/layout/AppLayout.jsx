import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import NavBar from "./NavBar";
import PostComposeModal from "../post/PostComposeModal";
import { useAuth } from "../../context/AuthContext";
import "./AppLayout.css";

function AppLayout() {
  const { user, loading } = useAuth();
  const [showCompose, setShowCompose] = useState(false);
  const [lastPostedAt, setLastPostedAt] = useState(null);

  // 起動時の /me 確認が終わるまでは何も出さない（ちらつき防止）
  if (loading) return null;

  // 未ログインならログイン画面へ（レイアウト内の全画面が自動で保護される）
  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="layout">
      <SideBar onCompose={() => setShowCompose(true)} />
      <div className="main">
        <NavBar />
        <Outlet context={{ lastPostedAt }} />
      </div>

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
