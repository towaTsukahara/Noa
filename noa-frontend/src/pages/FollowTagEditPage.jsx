import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";

// タグをフォロー/解除する画面（カテゴリなし・フラット）
// type prop は使わなくなった（カテゴリ廃止）。App.jsx 側のルートも後で1本に整理する。
const FollowTagEditPage = () => {
    const navigate = useNavigate();

    const [searchKeyword, setSearchKeyword] = useState("");
    const [allTags, setAllTags] = useState([]);          // 候補（GET /tags）
    const [followingNames, setFollowingNames] = useState(new Set()); // フォロー中タグ名
    const [loading, setLoading] = useState(true);

    // 候補タグと、現在フォロー中のタグを取得
    const load = async () => {
        setLoading(true);
        try {
            const tags = await api("/tags");                 // [{id, name}]
            setAllTags(tags);
            const following = await api("/me/following/tags"); // [{id, name}]
            setFollowingNames(new Set(following.map((t) => t.name)));
        } catch (e) {
            // 失敗時は空のまま
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    // タグをクリックしたら、その場でフォロー/解除を実行（楽観的更新）
    const toggleTag = async (name) => {
        const isFollowing = followingNames.has(name);
        // 先に画面を更新
        setFollowingNames((prev) => {
            const next = new Set(prev);
            if (isFollowing) next.delete(name);
            else next.add(name);
            return next;
        });
        // APIを叩く
        try {
            await api(`/tags/${encodeURIComponent(name)}/follow`, {
                method: isFollowing ? "DELETE" : "POST",
            });
        } catch (e) {
            // 失敗したら元に戻す
            setFollowingNames((prev) => {
                const next = new Set(prev);
                if (isFollowing) next.add(name);
                else next.delete(name);
                return next;
            });
            alert("操作に失敗しました。");
        }
    };

    const filteredTags = useMemo(() => {
        const kw = searchKeyword.toLowerCase();
        return allTags.filter((t) => t.name.toLowerCase().includes(kw));
    }, [allTags, searchKeyword]);

    if (loading) return <p style={{ padding: 20 }}>読み込み中...</p>;

    return (
        <div style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
            <h2>タグをフォロー</h2>

            <input
                type="text"
                placeholder="タグを検索"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                style={{ width: "100%", padding: 8, marginBottom: 16 }}
            />

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {filteredTags.length === 0 && <p>タグが見つかりません。</p>}
                {filteredTags.map((tag) => {
                    const on = followingNames.has(tag.name);
                    return (
                        <span
                            key={tag.id}
                            onClick={() => toggleTag(tag.name)}
                            style={{
                                padding: "6px 14px",
                                borderRadius: 999,
                                cursor: "pointer",
                                border: on ? "none" : "1px solid #ccc",
                                background: on ? "#1a1a1a" : "#fff",
                                color: on ? "#fff" : "#333",
                                userSelect: "none",
                            }}
                        >
                            #{tag.name} {on ? "✓" : "+"}
                        </span>
                    );
                })}
            </div>

            <div style={{ marginTop: 24 }}>
                <button onClick={() => navigate("/follow")}>戻る</button>
            </div>
        </div>
    );
};

export default FollowTagEditPage;