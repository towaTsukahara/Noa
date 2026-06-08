import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";

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
                    tagNames: selected, // ← 名前で送る（findOrCreate用）
                    category: typeMap[type]
                })
            });

            navigate("/profile/edit", {
                state: { form: { ...form, [type]: selected } }
            });

        } catch (err) {
            console.error(err);
        }
        
    };

    return (
        <div>
            <h2>{LABEL[type]}</h2>

            {/* 選択中（クリックで外す） */}
            <div>
                <h3>選択中 ({selected.length})</h3>
                {selected.map((name) => (
                    <span key={name} onClick={() => removeSelected(name)} style={{ margin: 5, cursor: "pointer" }}>
                        {name} ×
                    </span>
                ))}
            </div>

            {/* 検索 */}
            <div style={{ marginTop: "10px" }}>
                <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="タグを検索"
                    style={{ padding: "6px", width: "200px" }}
                />
            </div>

            {/* 新規作成（候補に無い名前を打って追加） */}
            <div>
                <input value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="新しいタグ名" />
                <button onClick={addNew}>新規追加</button>
            </div>

            <div>
                <button onClick={() => navigate("/profile/edit", { state: { form } })}>キャンセル</button>
                <button onClick={handleSave}>保存（{selected.length}つ選択中）</button>
            </div>

            {/* タグ候補 */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",

            }}>
                {candidates.map((tag) => (
                    <span
                        key={tag.id}
                        onClick={() => toggle(tag)}
                        style={{
                            margin: 5,
                            cursor: "pointer",
                            backgroundColor: selected.includes(tag.name) ? "blue" : "gray",
                            color: "white",
                            padding: "8px 12px",
                            borderRadius: "12px",
                        }}
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