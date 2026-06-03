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
    const [tags, setTags] = useState([]);
    const [hobbies, setHobbies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [selectedTags, setSelectedTags] = useState([])

    useEffect(() => {
        if (location.state) {
            setHobbies([...(location.state.hobbies || [])]);
            setSkills([...(location.state.skills || [])]);
        }
    }, [location.state]);

    /*
    useEffect(() => {
        fetch("http://localhost:5173/api/v1/tags")
            .then(res => {
                if (!res.ok) {
                    throw new Error("APIエラー: " + res.status);
                }
                return res.json();
            })
            .then(data => {
                console.log("成功:", data);
                setTags(data);
            })
            .catch(err => {
                console.error("失敗:", err);
            });
    }, []);
    
    useEffect(() => {
        setTags(
            TAGS[type].map((name, index) => ({
                id: index,
                name: name
            }))
        );
    }, [type]);
    */

    useEffect(() => {
        fetch("/api/v1/tags")
            .then(res => {
                if (!res.ok) {
                    throw new Error("APIエラー: " + res.status);
                }
                return res.json();
            })
            /*.then(data => {
                // typeでフィルタ
                const filtered = data.filter(tag => tag.type === type);
                setTags(filtered);
            })*/
            .then(data => {
                console.log("APIデータ:", data);

                const filtered = data.filter(tag => tag.type === type);
                console.log("filtered:", filtered);

                setTags(filtered);
            })
            .catch(err => {
                console.error(err);
            });
    }, [type]);

    const selected = type === "hobby" ? hobbies : skills;
    const setSelected = type === "hobby" ? setHobbies : setSkills;

    const toggleTag = (tag) => {
        if (selected.includes(tag.name)) {
            setSelected(selected.filter(t => t !== tag.name));
        } else {
            setSelected([...selected, tag.name]);
        }
    };

    const handleNext = () => {
        if (type === "hobby") {
            navigate("/tags/skill", {
                state: { hobbies: [...selected], skills: [...skills] },
            });
        } else {
            navigate("/register", {
                state: { hobbies: [...hobbies], skills: [...selected] },
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
                {tags.map((tag) => (
                    <button
                        key={`${type}-${tag.name}`}
                        onClick={() => toggleTag(tag)}
                        style={{
                            backgroundColor: selected.includes(tag.name) ? "blue" : "gray",
                            color: "white"
                        }}
                    >
                        {tag.name}
                    </button>
                ))}
            </div>
            <button onClick={handleNext}>
                次へ ({selected.length}つ選択中)
            </button>
        </div>
    );
};
export default TagPage;