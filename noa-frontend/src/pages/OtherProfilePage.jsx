import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import FollowButton from "../components/user/FollowButton";
import { relativeTime } from "../utils/relativeTime";

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

  if (loading) return <p style={{ padding: 20 }}>読み込み中...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;
  if (!profile) return null;

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      {/* TODO(フェーズ2): アイコン画像はメディア機能実装後。今はプレースホルダ */}
      <div style={{ width: 100, height: 100, background: "#bbb", borderRadius: "50%", margin: "0 auto 12px" }} />

      {/* 表示名：nickname優先・なければhandle（F-105の秘匿ルール） */}
      <h2 style={{ textAlign: "center", margin: "0 0 4px" }}>
        {profile.nickname || profile.handle}
      </h2>
      {profile.nickname && (
        <p style={{ textAlign: "center", color: "#888", fontSize: 13, margin: 0 }}>{profile.handle}</p>
      )}
      {/* TODO(F-114): ニックネームの設定・変更UIは nickname API 本実装後にここへ */}

      <div style={{ textAlign: "center", margin: "16px 0" }}>
        <FollowButton handle={profile.handle} initialFollowing={profile.isFollowing} />
      </div>

      <section style={{ marginBottom: 20 }}>
        <h3>自己紹介</h3>
        <p style={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>{profile.bio || "（未設定）"}</p>
      </section>

      <section style={{ marginBottom: 20 }}>
        <h3>興味タグ</h3>
        <p>技術: {profile.tags.tech.join("、") || "—"}</p>
        <p>趣味: {profile.tags.hobby.join("、") || "—"}</p>
        <p>資格: {profile.tags.cert.join("、") || "—"}</p>
      </section>

      <h3>投稿</h3>
      {posts.length === 0 && <p>まだ投稿がありません。</p>}
      {posts.map((post) => (
        <div key={post.id} style={{ border: "1px solid #ccc", borderRadius: 8, padding: 12, marginBottom: 10 }}>
          <div style={{ overflowWrap: "anywhere", whiteSpace: "pre-wrap" }}>{post.body}</div>
          <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}>
            ♡ {post.likeCount}　💬 {post.replyCount}　{relativeTime(post.createdAt)}
          </div>
          {/* いいねトグルが必要ならタイムラインと同じ handleLikeToggle パターンを追加 */}
        </div>
      ))}
    </div>
  );
}