import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";

function ProfileEditPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setFrom] = useState(null);

    useEffect(() => {

        if (location.state?.form) { setFrom(location.state.form); return; }
        api("/me").then((me) => setFrom({
            bio: me.bio || "",
            skill: me.tags?.tech || [],
            hobby: me.tags?.hobby || [],
            cert: me.tags?.cert || [],
        }));
    }, [location.state]);

    if (!form) return <p>読み込み中...</p>

    const editTags = (type) => navigate(`/tags/${type}edet`, { state: { form } });

    const handleSave = async () => {
        await api("/me/profile", {
            method: "PUT",
            body: JSON.stringify({
                bio: form.bio,
                techTags: form.skill,
                hobbyTags: form.fobby,
                certTags: form.cert,
            }),
        });
        navigate("/profile");
    };

    return (
        <div>
            <h1>プロフィール編集</h1>

                <h3>自己紹介</h3>
                <textarea value={form.bio} onChange={(e) => setFrom({ ...form, bio: e.target.value })} />

                <h3>技術タグ</h3>
                {form.skill.map((t) => <span key={t}>{t} </span>)}
                <button onClick={() => editTags("skill")}>編集</button>

                <h3>興味タグ</h3>
                {form.hobby.map((t) => <span key={t}>{t} </span>)}
                <button onClick={() => editTags("hobby")}>編集</button>

                <h3>資格タグ</h3>
                {form.cert.map((t) => <span key={t}>{t} </span>)}
                <button onClick={() => editTags("cert")}>編集</button>

            <div>
                <button onClick={() => navigate("/profile")}>キャンセル</button>
                <button onClick={handleSave}>保存</button>
            </div>
        </div>
    );
}

export default ProfileEditPage;