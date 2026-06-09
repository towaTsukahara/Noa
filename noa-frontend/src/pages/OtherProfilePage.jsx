import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import FollowButton from "../components/user/FollowButton";
import { relativeTime } from "../utils/relativeTime";
import "./OtherProfilePage.css";

export default function OtherProfilePage() {
  const { handle } = useParams(); // URLの /users/:handle から取得
  const { user } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 自分自身のhandleなら自分のプロフィールへ
  useEffect(() => {
    if (user && user.handle === handle) {
      navigate("/profile", { replace: true });
    }
  }, [user, handle]);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const p = await api(`/users/${handle}`); // 秘匿ビュー（isFollowing/nickname実値）
      setProfile(p);
      const data = await api(`/users/${handle}/posts`);
      setPosts(data.items);
    } catch (e) {
      setError("ユーザー情報の取得に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [handle]);

  if (loading) return <div className="other-profile page"><p className="empty-note">読み込み中...</p></div>;
  if (error) return <div className="other-profile page"><p className="empty-note">{error}</p></div>;
  if (!profile) return null;

  return (
    <div className="other-profile page">
      <div className="op-hero">
        {/* TODO(フェーズ2): アイコン画像はメディア機能実装後。今は抽象プレースホルダ */}
        <div className="avatar is-lg is-round op-avatar" />

        {/* 表示名：nickname優先・なければhandle（F-105の秘匿ルール） */}
        <div className="op-name">{profile.nickname || profile.handle}</div>
        {profile.nickname && <div className="op-handle">{profile.handle}</div>}
        {/* TODO(F-114): ニックネームの設定・変更UIは nickname API 本実装後にここへ */}

        <div className="op-follow">
          <FollowButton handle={profile.handle} initialFollowing={profile.isFollowing} />
        </div>
      </div>

      <section className="op-section">
        <h3>自己紹介</h3>
        <p>{profile.bio || "（未設定）"}</p>
      </section>

      <section className="op-section">
        <h3>タグ</h3>
        <p>技術: {profile.tags.tech.join("、") || "—"}</p>
        <p>趣味: {profile.tags.hobby.join("、") || "—"}</p>
        <p>資格: {profile.tags.cert.join("、") || "—"}</p>
      </section>

      <div className="section-title">投稿</div>
      {posts.length === 0 && <p className="empty-note">まだ投稿がありません。</p>}
      {posts.map((post) => (
        <div key={post.id} className="mini-post">
          <div className="mini-body">{post.body}</div>
          <div className="mini-meta">
            <span>♡ {post.likeCount}</span>
            <span>💬 {post.replyCount}</span>
            <span>{relativeTime(post.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
