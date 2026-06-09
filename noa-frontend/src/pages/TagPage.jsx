import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "./TagPage.css";

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
        <div className="tag-select page">
            <h2 className="page-title">{type === "hobby" ? "興味タグ" : "技術スタックタグ"}</h2>

            <div className="back-row">
                <button className="btn btn-quiet" onClick={() => navigate(-1)}>
                    ← 戻る
                </button>
            </div>

            <div className="tag-cloud">
                {TAGS[type].map((tag) => (
                    <span
                        key={tag}
                        className={`tag-toggle ${selected.includes(tag) ? "is-on" : ""}`}
                        onClick={() => toggleTag(tag)}
                    >
                        {tag}
                    </span>
                ))}
            </div>

            <div className="edit-actions">
                <button className="btn" onClick={handleNext}>
                    次へ（{selected.length}つ選択中）
                </button>
            </div>
        </div>
    );
};
export default TagPage;
