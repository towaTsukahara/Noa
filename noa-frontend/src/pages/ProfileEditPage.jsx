import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";
import "./ProfileEditPage.css";

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

    if (!form) return <div className="profile-edit page"><p className="empty-note">読み込み中...</p></div>;

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

    // /meのレスポンスが["Java", "React"]なら残す。[{id:1,name:"Java"}]なら消す
    // const renderTags = (arr) =>
    //     (arr || []).map((tag) => (
    //         <span key={tag} className="tag">#{tag}</span>
    //     ));

    return (
        <div className="profile-edit page">
            <h1 className="page-title">プロフィール編集</h1>

            <div className="edit-block">
                <h3>自己紹介</h3>
                <textarea
                    className="field"
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                />
            </div>

            <div className="edit-block">
                <h3>技術タグ</h3>
                <div className="edit-taglist">
                    {form.skill.map((tag) => (
                        <span key={tag.id} className="tag">
                            #{tag.name}
                        </span>
                    ))}</div>
                <button onClick={() => editTags("skill")}>さらに表示</button>
            </div >

            <div className="edit-block">
                <h3>興味タグ</h3>
                <div className="edit-taglist">
                    {form.hobby.map((tag) => (
                        <span key={tag.id} className="tag">
                            #{tag.name}
                        </span>
                    ))}
                </div>
                <button onClick={() => editTags("hobby")}>さらに表示</button>
            </div >

            <div className="edit-block">
                <h3>趣味タグ</h3>
                <div className="edit-taglist">
                    {form.cert.map((tag) => (
                        <span key={tag.id} className="tag">
                            #{tag.name}
                        </span>
                    ))}
                </div>
                <button onClick={() => editTags("cert")}>さらに表示</button>
            </div >

            <div className="edit-actions">
                <button className="btn btn-quiet" onClick={() => navigate("/profile")}>
                    キャンセル
                </button>
                <button className="btn" onClick={handleSave}>
                    保存
                </button>
            </div>
        </div >
    );
}

export default ProfileEditPage;
