import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
function RegisterPage() {
    const [icon, setIcon] = useState(null);
    const [header, setHeader] = useState(null);
    const [bio, setBio] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    const [hobbies, setHobbies] = useState([]);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        if (location.state) {
            setHobbies(location.state.hobbies || []);
            setSkills(location.state.skills || []);
        }
    }, [location.state]);

    const handleSubmit = () => {
        const data = {
            icon,
            header,
            bio,
            hobbies,
            skills
        };
        console.log(data);
        alert("登録しました");
    };

    return (
        <div>
            <h1>プロフィール</h1>
            <div>
                <h2>基本情報</h2>
                <div>
                    <p>アイコン</p>
                    <input
                        type="file"
                        onChange={(e) => setIcon(e.target.files[0])}
                    />
                </div>
                <div>
                    <p>ヘッダー</p>
                    <input
                        type="file"
                        onChange={(e) => setHeader(e.target.files[0])}
                    />
                </div>
                <div>
                    <p>自己紹介（200字以内）</p>
                    <textarea
                        value={bio}
                        maxLength={200}
                        onChange={(e) => setBio(e.target.value)}
                        style={StyleSheet.textarea}
                    />
                    <p>{bio.length}/200</p>
                </div>
            </div>
            {/*タグ*/}
            <div>
                <h2>タグ設定</h2>
                <div>
                    <p>趣味</p>
                    <button onClick={() => navigate("/tags/hobby", { state: { hobbies, skills } })}>
                        タグ追加
                    </button>
                    <div>{hobbies.join(", ")}</div>
                </div>
                <div>
                    <p>技術スタック</p>
                    <button onClick={() => navigate("/tags/skill", { state: { hobbies, skills } })}>
                        タグ追加
                    </button>
                    <div>{skills.join(", ")}</div>
                </div>
            </div>
            {/*ボタン*/}
            <div>
                <button>キャンセル</button>
                <button onClick={handleSubmit}>登録</button>
            </div>
        </div>
    )
}
export default RegisterPage