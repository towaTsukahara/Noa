import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// ダミーデータ。バックエンド実装したら消す。
const TAGS = {
    hobby: ["コーヒー", "登山", "ゲーム", "読書", "カフェ巡り", "ランニング"],
    skill: ["Java", "Spring Boot", "React", "AWS", "Python", "SQL"],
};

const TagPage = ({ type }) => {
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

    const selected = type === "hobby" ? hobbies : skills;
    const setSelected = type === "hobby" ? setHobbies : setSkills;

    const toggleTag = (tag) => {
        if (selected.includes(tag)) {
            setSelected(selected.filter(t => t !== tag));
        } else {
            setSelected([...selected, tag]);
        }
    };

    const handleNext = () => {
        if (type === "hobby") {
            navigate("/tags/skill", {
                state: { hobbies: selected, skills },
            });
        } else {
            navigate("/register", {
                state: { hobbies, skills: selected },
            });
        }
    };

    return (
        <div>
            <h2>{type === "hobby" ? "興味タグ" : "技術スタックタグ"}</h2>
            <div>
                <button onClick={() => navigate(-1)}>
                    ← 戻る
                </button>
            </div>
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
            <button onClick={handleNext}>
                次へ ({selected.length}つ選択中)
            </button>
        </div>
    );
};
export default TagPage;