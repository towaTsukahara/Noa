import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";

const LABEL = { skill: "技術スタックタグ", hobby: "興味タグ", cert: "資格タグ" };

const TagEditPage = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();

    // プロフィール編集から渡された「編集中フォーム」。無ければ空で開始
    const form = location.state?.form || { bio: "", skill: [], hobby: [], cert: [] };

    const [selected, setSelected] = useState(form[type] || []); // このカテゴリの選択中タグ
    const [q, setQ] = useState("");                          // 検索キーワード
    const [candidates, setCandidates] = useState([]);          // DBから取得した候補
    const [newTag, setNewTag] = useState("");
    
    // q が変わるたび、DBから既存タグを検索
    useEffect(() => {
        if (!q.trim()) { setCandidates([]); return; }
        api(`/tags?q=${encodeURIComponent(q.trim())}`)
            .then((tags) => setCandidates(tags.map((t) => t.name)))
            .catch(() => setCandidates([]));
    }, [q]);

    const toggle = (name) => {
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

    // 選択をフォームに反映して編集画面へ戻す
    const handleSave = () => {
        navigate("/profile/edit", { state: { form: { ...form, [type]: selected } } });
    };
   
    return (
        <div>
            <h2>{LABEL[type]}</h2>

            {/* 選択中（クリックで外す） */}
            <div>
                <h3>選択中 ({selected.length})</h3>
                {selected.map((name) => (
                    <span key={name} onClick={() => toggle(name)} style={{ margin: 5, cursor: "pointer" }}>
                        {name} ×
                    </span>
                ))}
            </div>

            {/* 検索してクリックで追加 */}
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="タグを検索" />
            <div>
                {candidates.map((name) => (
                    <span key={name} onClick={() => toggle(name)} style={{ margin: 5, cursor: "pointer" }}>
                        {selected.includes(name) ? "✓ " : ""}{name}
                    </span>
                ))}
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
        </div>
    );
};
export default TagEditPage;