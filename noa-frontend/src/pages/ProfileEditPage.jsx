import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";

function ProfileEditPage() {
    const navigate = useNavigate();
    const location = useLocation();

    const [form, setForm] = useState({
        bio: "",
        skill: [],
        hobby: [],
        cert: [],
    });

    useEffect(() => {
        if (location.state?.form) {
            setForm(location.state.form);
            return;
        }

        api("/me").then((me) =>
            setForm({
                bio: me.bio || "",
                skill: me.tags?.tech || [],
                hobby: me.tags?.hobby || [],
                cert: me.tags?.cert || [],
            })
        );
    }, [location.state]);

    if (!form) return <p>読み込み中...</p>;

    const handleTagSkillEditClick = () => {
        navigate("/tags/skilledit", { state: { form } });
    };

    const handleTagHobbyEditClick = () => {
        navigate("/tags/hobbyedit", { state: { form } });
    };

    const handleTagCertEditClick = () => {
        navigate("/tags/certedit", { state: { form } });
    };

    useEffect(()=>{
        if (location.state?.form) { setForm(location.state.form); return; }
        api("/me").then((me) => setForm({
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
            <div>
                <h3>技術タグ</h3>
                {form.skill.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}
                <button onClick={handleTagSkillEditClick}>
                    さらに表示
                </button>
            </div>
            <div>
                <h3>興味タグ</h3>
                {form.hobby.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}
                <button onClick={handleTagHobbyEditClick}>さらに表示</button>
            </div>
            <div>
                <h3>資格タグ</h3>
                {form.cert.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}
                <button onClick={handleTagCertEditClick}>さらに表示</button>
            </div>

            <div>
                <button onClick={() => navigate("/profile")}>
                    キャンセル
                </button>
                <button onClick={handleSave}>
                    保存
                </button>
            </div>
        </div>
        </div>
    );
}

export default ProfileEditPage;