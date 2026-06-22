import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/client";
import UserHandle from "../components/user/UserHandle";
import ErrorBanner from "../components/common/ErrorBanner";
import ConfirmModal from "../components/common/ConfirmModal";
import "./FollowPage.css";

export default function FollowPage() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("user");
    const [searchKeyword, setSearchKeyword] = useState("");

    const [users, setUsers] = useState([]);
    const [tags, setTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirm, setConfirm] = useState(null);

    const load = async () => {
        setLoading(true);
        try {
            const u = await api("/me/following");
            setUsers(u.items);
            const t = await api("/me/following/tags");
            setTags(t);
        } catch (e) {
            // 失敗時は空のまま
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const filteredUsers = useMemo(() => {
        const kw = searchKeyword.toLowerCase();
        return users.filter((u) =>
            (u.nickname || u.handle).toLowerCase().includes(kw)
        );
    }, [searchKeyword, users]);

    const filteredTags = useMemo(() => {
        const kw = searchKeyword.toLowerCase();
        return tags.filter((t) => t.name.toLowerCase().includes(kw));
    }, [searchKeyword, tags]);

    // ユーザーのフォロー解除：確認モーダルを開く
    const handleUnfollowUser = (handle) => {
        setConfirm({
            message: "フォローを解除しますか？",
            onConfirm: async () => {
                try {
                    await api(`/users/${handle}/follow`, { method: "DELETE" });
                    setUsers((prev) => prev.filter((u) => u.handle !== handle));
                } catch (e) {
                    setError("解除に失敗しました。");
                }
            },
        });
    };

    // タグのフォロー解除：確認モーダルを開く
    const handleUnfollowTag = (name) => {
        setConfirm({
            message: `#${name} のフォローを解除しますか？`,
            onConfirm: async () => {
                try {
                    await api(`/tags/${encodeURIComponent(name)}/follow`, { method: "DELETE" });
                    setTags((prev) => prev.filter((t) => t.name !== name));
                } catch (e) {
                    setError("解除に失敗しました。");
                }
            },
        });
    };

    if (loading) return <div className="follow page"><p className="empty-note">読み込み中...</p></div>;

    return (
        <div className="follow page">
            <ErrorBanner message={error} onClose={() => setError(null)} />

            <div className="follow-search">
                <input
                    className="field"
                    type="text"
                    placeholder="検索"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>

            <div className="tabs">
                <button
                    className={`tab ${activeTab === "user" ? "active" : ""}`}
                    onClick={() => setActiveTab("user")}
                >
                    ユーザー（{users.length}）
                </button>
                <button
                    className={`tab ${activeTab === "tag" ? "active" : ""}`}
                    onClick={() => setActiveTab("tag")}
                >
                    タグ（{tags.length}）
                </button>
            </div>

            {activeTab === "user" && (
                <div className="follow-list">
                    <h2>フォロー中のユーザー</h2>
                    {filteredUsers.length === 0 && <p>フォロー中のユーザーはいません。</p>}
                    {filteredUsers.map((u) => (
                        <div key={u.handle} className="row-between">
                            <span
                                className="follow-name"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/users/${u.handle}`)}
                            >
                                <UserHandle user={u} />
                            </span>
                            <button className="btn btn-quiet" onClick={() => handleUnfollowUser(u.handle)}>
                                フォローをやめる
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === "tag" && (
                <div className="follow-list">
                    <h2>フォロー中のタグ</h2>
                    {filteredTags.length === 0 && <p>フォロー中のタグはありません。</p>}
                    {filteredTags.map((t) => (
                        <div key={t.id} className="row-between">
                            <span
                                className="follow-tag"
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/tag/${t.id}`)}
                            >
                                #{t.name}
                            </span>
                            <button className="btn btn-quiet" onClick={() => handleUnfollowTag(t.name)}>
                                フォローをやめる
                            </button>
                        </div>
                    ))}
                    <button className="btn btn-ghost follow-add" onClick={() => navigate("/follow/tags")}>
                        ＋ タグを追加・編集
                    </button>
                </div>
            )}

            <div className="edit-actions" style={{ justifyContent: "flex-start" }}>
                <button className="btn btn-quiet" onClick={() => navigate("/profile")}>戻る</button>
            </div>

            <ConfirmModal
                open={confirm !== null}
                title="確認"
                message={confirm?.message}
                confirmLabel="解除する"
                onConfirm={() => { confirm.onConfirm(); setConfirm(null); }}
                onCancel={() => setConfirm(null)}
            />
        </div>
    );
}