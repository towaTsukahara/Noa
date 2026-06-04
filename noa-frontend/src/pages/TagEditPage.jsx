import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

// ダミーデータ。バックエンド実装したら消す。
/*
const TAGS = {
    hobby: ["コーヒー", "登山", "ゲーム", "読書", "カフェ巡り", "ランニング"],
    skill: ["Java", "Spring Boot", "React", "AWS", "Python", "SQL"],
    cert: ["基本情報技術者", "応用情報技術者"],
};
*/

const TagEditPage = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [tags, setTags] = useState([]); // ← APIから取得
    const [hobbies, setHobbies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certs, setCerts] = useState([]);

    useEffect(() => {
        if (location.state) {
            setHobbies(location.state.hobbies || []);
            setSkills(location.state.skills || []);
            setCerts(location.state.certs || []);
        }
    }, [location.state]);

    useEffect(() => {
        fetch("/api/v1/tags")
            .then(res => res.json())
            .then(data => {
                const typeMap = {
                    hobby: "HOBBY",
                    skill: "TECH",
                    cert: "CERT"
                };
                const filtered = data.filter(tag => tag.type === typeMap[type]);
                setTags(filtered);
            });
    }, [type]);

    const selectedMap = {
        hobby: [hobbies, setHobbies],
        skill: [skills, setSkills],
        cert: [certs, setCerts],
    };

    const [selected, setSelected] = selectedMap[type] || [[], () => { }];

    const toggleTag = (tag) => {
        if (selected.includes(tag.id)) {
            setSelected(selected.filter(t => t !== tag.id));
        } else {
            setSelected([...selected, tag.id]);
        }
    };

    /*
    const handleCancelClick = () => {
        navigate("/profile/edit");
    };

    const handleSaveClick = () => {
        navigate("/profile/edit");
    };
    */

    const handleSave = async () => {
        const typeMap = {
            hobby: "HOBBY",
            skill: "TECH",
            cert: "CERT"
        };

        try {
            await fetch("http://localhost:8080/api/v1/tags/save", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    userId: 1,
                    tagIds: selected, // ← ID配列
                    category: typeMap[type]
                })
            });

            // 🔥 前の画面に戻る（state維持）
            navigate("/profile/edit", {
                state: {
                    hobbies,
                    skills,
                    certs
                }
            });

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h2>{type === "skill"
                ? "技術タグ"
                : type === "hobby"
                    ? "興味タグ"
                    : "資格タグ"}
            </h2>
            <div>
                {tags.map((tag) => (
                    <span
                        key={tag.id}
                        onClick={() => toggleTag(tag)}
                        style={{
                            margin: "5px",
                        }}
                    >
                        {tag.name}
                    </span>
                ))}
            </div>
            <div>
                <button onClick={() => navigate("/profile/edit")}>キャンセル</button>
                <button onClick={handleSave}>保存({selected.length}つ選択中)</button>
            </div>
        </div>
    );
};
export default TagEditPage;