import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { relativeTime } from "../utils/relativeTime";
import FollowButton from "../components/user/FollowButton";
import MiniPostCard from "../components/post/MiniPostCard";
import CharCount from "../components/common/CharCount";
import "./OtherProfilePage.css";
import heart_filled from '/icons/heart_filled.svg';
import heart from '/icons/heart.svg';
import reply from '/icons/reply.svg';

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
        await api(`/users/${handle}/nickname`, { method: "DELETE" });
      } else {
        await api(`/users/${handle}/nickname`, {
          method: "PUT",
          body: JSON.stringify({ nickname: trimmed }),
        });
      }
      setEditingNick(false);
      await load();
    } catch (e) {
      setError("ニックネームの保存に失敗しました。");
    }
  };

  // 編集を開始（今のニックネームを入力欄に入れる）
  const startEditNickname = () => {
    setNickInput(profile.nickname || "");
    setEditingNick(true);
  };

  // プロフィールのタグ（文字列）から、そのタグの投稿一覧へ
  const goToTag = async (tagName) => {
    try {
      const data = await api(`/tags/by-name/${encodeURIComponent(tagName)}`);
      navigate(`/tag/${data.id}`);
    } catch (e) {
      setError("タグを開けませんでした。");
    }
  };

  // いいねのトグル（他人の投稿にいいね／取消）
  const handleLikeToggle = async (post) => {
    try {
      await api(`/posts/${post.id}/like`, {
        method: post.likedByMe ? "DELETE" : "POST",
      });
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? {
              ...p,
              likedByMe: !p.likedByMe,
              likeCount: p.likedByMe ? p.likeCount - 1 : p.likeCount + 1,
            }
            : p
        )
      );
    } catch (e) {
      setError("いいねできませんでした。");
    }
  };

  // 文字列タグの配列を、クリックできる形で並べる
  const renderTags = (arr) =>
    (arr || []).map((t) => (
      <span
        key={t}
        className="tag"
        style={{ cursor: "pointer" }}
        onClick={() => goToTag(t)}
      >
        #{t}
      </span>
    ));

  // 投稿カード（ProfilePage と同じ表記順。ただし削除ボタンは無し）
  const renderPostCard = (post) => (
    <div
      key={post.id}
      className="mini-post"
      onClick={() => navigate(`?post=${post.id}`)}
      style={{ cursor: "pointer" }}
    >
      <div className="mini-body">{post.body}</div>
      <div className="mini-meta">
        <span className="mini-time">{relativeTime(post.createdAt)}</span>
        <button
          className={`mini-like ${post.likedByMe ? "liked" : ""}`}
          onClick={(e) => { e.stopPropagation(); handleLikeToggle(post); }}
        >
          <img src={post.likedByMe ? heart_filled : heart} alt="いいね" className="icon-like" />
          <span>{post.likeCount}</span>
        </button>
        <span className="mini-reply">
          <img src={reply} alt="返信" className="icon-reply" />
          <span>{post.replyCount}</span>
        </span>
      </div>
    </div>
  );

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
                <CharCount current={nickInput.length} max={30} />
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
          <FollowButton
            handle={profile.handle}
            initialFollowing={profile.isFollowing}
            onChanged={(following) =>
              setProfile((prev) => ({ ...prev, isFollowing: following }))
            }
          />
        </div>
      </div>

      <section className="op-section">
        <h3>自己紹介</h3>
        <p>{profile.bio || "（未設定）"}</p>
      </section>

      <section className="op-section">
        <h3>タグ</h3>
        <div className="profile-tagset">
          <div className="tag-group">
            <div className="tag-group-label">技術スタック</div>
            <div className="tag-row">{renderTags(profile.tags?.tech)}</div>
          </div>
          <div className="tag-group">
            <div className="tag-group-label">興味</div>
            <div className="tag-row">{renderTags(profile.tags?.hobby)}</div>
          </div>
          <div className="tag-group">
            <div className="tag-group-label">趣味</div>
            <div className="tag-row">{renderTags(profile.tags?.cert)}</div>
          </div>
        </div>
      </section>

      <div className="section-title">投稿</div>
      {posts.length === 0 && <p className="empty-note">まだ投稿がありません。</p>}
      {posts.map((post) => (
        <MiniPostCard
          key={post.id}
          post={post}
          onLike={handleLikeToggle}
        />
      ))}
    </div>
  );
}