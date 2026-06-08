import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";

function ProfileEditPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState(location.state?.form || null);

    useEffect(() => {
        if (location.state?.form) {
            setForm(location.state.form);
            return;
        }
        api("/me").then((me) => setForm({
            bio: me.bio || "",
            skill: me.tags?.tech || [],
            hobby: me.tags?.hobby || [],
            cert: me.tags?.cert || [],
        }));
    }, [location.state]);

    if (!form) return <p>読み込み中...</p>;

    const editTags = (type) => navigate(`/tags/${type}edit`, { state: { form } });

    const handleSave = async () => {
        await api("/me/profile", {
            method: "PUT",
            body: JSON.stringify({
                bio: form.bio,
                techTags: form.skill,
                hobbyTags: form.hobby,
                certTags: form.cert,
            }),
        });
        navigate("/profile");
    };

    return (
        <div>
            <h1>プロフィール編集</h1>

            <div>
                <h3>自己紹介</h3>
                <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} />
            </div>

            <div>
                <h3>技術タグ</h3>
                {form.skill.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}
                <button onClick={() => editTags("skill")}>さらに表示</button>
            </div>

            <div>
                <h3>興味タグ</h3>
                {form.hobby.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}
                <button onClick={() => editTags("hobby")}>さらに表示</button>
            </div>

            <div>
                <h3>趣味タグ</h3>
                {form.cert.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}
                <button onClick={() => editTags("cert")}>さらに表示</button>
            </div>

            <div>
                <button onClick={() => navigate("/profile")}>キャンセル</button>
                <button onClick={handleSave}>保存</button>
            </div>
        </div>
    );
}

export default ProfileEditPage;