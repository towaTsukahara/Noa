import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const TagPage = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [tags, setTags] = useState({ hobby: [], skill: [] });

    const [hobbies, setHobbies] = useState([]);
    const [skills, setSkills] = useState([]);

    useEffect(() => {
        if (location.state) {
            setHobbies(location.state.hobbies || []);
            setSkills(location.state.skills || []);
        }
    }, [location.state]);

    useEffect(() => {
        fetch("http://localhost:8080/api/tags")
            .then((res) => res.json())
            .then((data) => {
                setTags(data);
            })
            .catch((err) => {
                console.error("タグ取得失敗", err);
            });
    }, []);

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
                {tags[type].map((tag) => (
                    <span
                        key={tag}
                        onClick={() => toggleTag(tag)}
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