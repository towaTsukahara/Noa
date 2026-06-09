import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import "./FollowTagEditPage.css";

// タグをフォロー/解除する画面（カテゴリなし・フラット）
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
        setFollowingNames((prev) => {
            const next = new Set(prev);
            if (isFollowing) next.delete(name);
            else next.add(name);
            return next;
        });
        try {
            await api(`/tags/${encodeURIComponent(name)}/follow`, {
                method: isFollowing ? "DELETE" : "POST",
            });
        } catch (e) {
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

    if (loading) return <div className="follow-tag-edit page"><p className="empty-note">読み込み中...</p></div>;

    return (
        <div className="follow-tag-edit page">
            <h2 className="page-title">タグをフォロー</h2>

            <div className="page-pad" style={{ paddingBottom: 6 }}>
                <input
                    className="field"
                    type="text"
                    placeholder="タグを検索"
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>

            <div className="tag-cloud">
                {filteredTags.length === 0 && <p>タグが見つかりません。</p>}
                {filteredTags.map((tag) => {
                    const on = followingNames.has(tag.name);
                    return (
                        <span
                            key={tag.id}
                            className={`tag-toggle ${on ? "is-on" : ""}`}
                            onClick={() => toggleTag(tag.name)}
                        >
                            #{tag.name} {on ? "✓" : "+"}
                        </span>
                    );
                })}
            </div>

            <div className="edit-actions" style={{ justifyContent: "flex-start" }}>
                <button className="btn btn-quiet" onClick={() => navigate("/follow")}>戻る</button>
            </div>
        </div>
    );
};

export default FollowTagEditPage;
