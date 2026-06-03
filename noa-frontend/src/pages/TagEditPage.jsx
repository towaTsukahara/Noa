import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// ダミーデータ。バックエンド実装したら消す。
const TAGS = {
    hobby: ["コーヒー", "登山", "ゲーム", "読書", "カフェ巡り", "ランニング"],
    skill: ["Java", "Spring Boot", "React", "AWS", "Python", "SQL"],
    cert: ["基本情報技術者", "応用情報技術者"],
};

const TagEditPage = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [hobbies, setHobbies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certs, setCers] = useState([]);

    useEffect(() => {
        if (location.state) {
            setHobbies(location.state.hobbies || []);
            setSkills(location.state.skills || []);
            setCers(location.state.certs || []);
        }
    }, [location.state]);

    const selected = type === "hobby" ? hobbies : ("skill" ? skills : certs);
    const setSelected = type === "hobby" ? setHobbies : ("skill" ? setSkills : setCers);

    const toggleTag = (tag) => {
        if (selected.includes(tag)) {
            setSelected(selected.filter(t => t !== tag));
        } else {
            setSelected([...selected, tag]);
        }
    };

    const handleCancelClick = () => {
        navigate("/profile/edit");
    };

    const handleSaveClick = () => {
        navigate("/profile/edit");
    };

    return (
        <div>
            <h2>{type === "hobby" ? "興味タグ" : ("skill" ? "技術スタックタグ" : "資格タグ")}</h2>
            <div>
                {TAGS[type].map((tag) => (
                    <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
                        style={{
                            margin: "5px",
                        }}
                    >
                        {tag}
                    </span>
                ))}
            </div>
            <div>
                <button onClick={handleCancelClick}>キャンセル</button>
                <button onClick={handleSaveClick}>保存({selected.length}つ選択中)</button>
            </div>
        </div>
    );
};
export default TagEditPage;