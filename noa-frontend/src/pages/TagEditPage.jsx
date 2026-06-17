import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";
import "./TagEditPage.css";

const LABEL = { skill: "技術スタックタグ", hobby: "興味タグ", cert: "趣味タグ" };

const TagEditPage = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // プロフィール編集から渡された「編集中フォーム」。無ければ空で開始
    const form = location.state?.form || { bio: "", skill: [], hobby: [], cert: [] };

    const [selected, setSelected] = useState(form[type] || []); // このカテゴリの選択中タグ
    const [q, setQ] = useState("");                          // 検索キーワード
    const [allTags, setAllTags] = useState([]);     // DBの全タグ
    const [candidates, setCandidates] = useState([]);          // DBから取得した候補
    const [newTag, setNewTag] = useState("");
    const [error, setError] = useState("");

    const removeSelected = (name) => {
        setSelected(selected.filter(t => t !== name));
    };

    //  初回：全タグ取得（検索してなくても表示）
    useEffect(() => {
        api("/tags")
            .then((data) => {
                setAllTags(data);
                setCandidates(data); // 最初は全部表示
            })
            .catch(() => {
                setAllTags([]);
                setCandidates([]);
            });
    }, []);

    useEffect(() => {
        if (!q.trim()) {
            setCandidates(allTags);
            return;
        }

        const filtered = allTags.filter(tag =>
            tag.name.toLowerCase().includes(q.toLowerCase())
        );

        setCandidates(filtered);
    }, [q, allTags]);

    const toggle = (tag) => {
        const name = tag.name;
        setSelected(selected.includes(name)
            ? selected.filter(t => t !== name)
            : [...selected, name]);
    };

    // 候補に無いタグを新規追加（DBへの作成は保存時＝PUT /me/profile の find-or-create）
    const addNew = () => {
        const name = newTag.trim().toLowerCase();
        if (name && !selected.includes(name)) setSelected([...selected, name]);
        setNewTag("");
    };

    //  DB保存
    const handleSave = async () => {
        const typeMap = {
            hobby: "HOBBY",
            skill: "TECH",
            cert: "CERT"
        };

        try {
            await api("/tags/save", {
                method: "POST",
                body: JSON.stringify({
                    userId: 1,
                    tagNames: selected,
                    category: typeMap[type]
                })
            });

            navigate("/profile/edit", {
                state: { form: { ...form, [type]: selected } }
            });

        } catch (err) {
            console.error(err);
            setError(err.message || "保存に失敗しました")
        }
    };

    return (
        <div className="tag-edit page">
            <h2 className="page-title">{LABEL[type]}</h2>

            {/* 選択中（クリックで外す） */}
            <div className="edit-block">
                <h3>選択中 ({selected.length})</h3>
                <div className="tag-cloud" style={{ padding: 0 }}>
                    {selected.map((name) => (
                        <span
                            key={name}
                            className="tag-toggle is-on"
                            onClick={() => removeSelected(name)}
                        >
                            {name} ×
                        </span>
                    ))}
                </div>
            </div>

            {/* 検索 */}
            <div className="edit-block">
                <h3>検索</h3>
                <input
                    className="field"
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="タグを検索"
                />
            </div>

            {/* 新規作成（候補に無い名前を打って追加） */}
            <div className="edit-block">
                <h3>新規作成</h3>
                <div className="new-tag-row">
                    <input
                        className="field"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="新しいタグ名"
                    />
                    <button className="btn btn-ghost" onClick={addNew}>新規追加</button>
                </div>
            </div>

            {error && (
                <p className="error-message">
                    {error}
                </p>
            )}
            <div className="edit-actions">
                <button className="btn btn-quiet" onClick={() => navigate("/profile/edit", { state: { form } })}>
                    キャンセル
                </button>
                <button className="btn" onClick={handleSave}>
                    保存（{selected.length}つ選択中）
                </button>
            </div>

            {/* タグ候補 */}
            <div className="tag-cloud">
                {candidates.map((tag) => (
                    <span
                        key={tag.id}
                        className={`tag-toggle ${selected.includes(tag.name) ? "is-on" : ""}`}
                        onClick={() => toggle(tag)}
                    >
                        {selected.includes(tag.name) ? "✓ " : ""}
                        {tag.name}
                    </span>
                ))}
            </div>
        </div>
    );
};
export default TagEditPage;
