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

  const [editingNick, setEditingNick] = useState(false); // ニックネーム編集モードか
  const [nickInput, setNickInput] = useState("");        // 入力中のニックネーム


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

  // ニックネーム保存（空なら削除扱い）
  const handleSaveNickname = async () => {
    try {
      const trimmed = nickInput.trim();
      if (trimmed === "") {
        // 空で保存＝削除
        await api(`/users/${handle}/nickname`, { method: "DELETE" });
      } else {
        await api(`/users/${handle}/nickname`, {
          method: "PUT",
          body: JSON.stringify({ nickname: trimmed }),
        });
      }
      setEditingNick(false);
      await load(); // 表示を更新（nicknameが反映される）
    } catch (e) {
      alert("ニックネームの保存に失敗しました。");
    }
  };

  // 編集を開始（今のニックネームを入力欄に入れる）
  const startEditNickname = () => {
    setNickInput(profile.nickname || "");
    setEditingNick(true);
  };

  return (
    <div className="other-profile page">
      <div className="op-hero">
        {/* TODO(フェーズ2): アイコン画像はメディア機能実装後。今は抽象プレースホルダ */}
        <div className="avatar is-lg is-round op-avatar" />

        {/* 表示名：nickname優先・なければhandle（F-105の秘匿ルール） */}
        <div className="op-name">{profile.nickname || profile.handle}</div>
        {profile.nickname && <div className="op-handle">{profile.handle}</div>}

        {/* ニックネーム編集（フォローしている相手にのみ表示） */}
        {profile.isFollowing && (
          <div className="op-nick">
            {editingNick ? (
              <div className="op-nick-edit">
                <input
                  type="text"
                  className="field op-nick-input"
                  value={nickInput}
                  onChange={(e) => setNickInput(e.target.value)}
                  placeholder="呼び名（自分だけに表示）"
                  maxLength={30}
                />
                <div className="op-nick-actions">
                  <button className="btn" onClick={handleSaveNickname}>保存</button>
                  <button className="btn btn-quiet" onClick={() => setEditingNick(false)}>やめる</button>
                </div>
              </div>
            ) : (
              <button className="btn-link op-nick-edit-btn" onClick={startEditNickname}>
                {profile.nickname ? "呼び名を変更" : "呼び名をつける"}
              </button>
            )}
          </div>
        )}
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
