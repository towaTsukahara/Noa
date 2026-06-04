import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const TagPage = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [tags, setTags] = useState([]);

    const [hobbies, setHobbies] = useState([]);
    const [skills, setSkills] = useState([]);
    const [certs, setCerts] = useState([]);

    const [selectedTags, setSelectedTags] = useState([])

    useEffect(() => {
        if (location.state) {
            setHobbies([...(location.state.hobbies || [])]);
            setSkills([...(location.state.skills || [])]);
            setCerts([...(location.state.certs || [])]);
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
    /*
    useEffect(() => {
        fetch("/api/v1/tags")
            .then(res => {
                if (!res.ok) {
                    throw new Error("APIエラー: " + res.status);
                }
                return res.json();
            })
            .then(data => {
                // typeでフィルタ
                const filtered = data.filter(tag => tag.type === type);
                setTags(filtered);
            })
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
    */



    useEffect(() => {
        fetch("http://localhost:8080/api/v1/tags")
            .then(res => {
                if (!res.ok) {
                    throw new Error("APIエラー: " + res.status);
                }
                return res.json();
            })
            .then(data => {
                const typeMap = {
                    hobby: "HOBBY",
                    skill: "TECH",
                    cert: "CERT"
                };

                const filtered = data.filter(
                    tag => tag.type === typeMap[type]
                );

                setTags(filtered);
            })
            .catch(err => console.error(err));
    }, [type]);

    const selectedMap = {
        hobby: [hobbies, setHobbies],
        skill: [skills, setSkills],
        cert: [certs, setCerts]
    };

    const selectedPair = selectedMap[type] || [[], () => { }];
    const selected = selectedPair[0];
    const setSelected = selectedPair[1];

    const toggleTag = (tag) => {
        if (selected.includes(tag.id)) {
            setSelected(selected.filter(t => t !== tag.id));
        } else {
            setSelected([...selected, tag.id]);
        }
    };

    const handleNext = () => {
        if (type === "skill") {
            navigate("/tags/hobby", {
                state: { hobbies, skills, certs },
            });
        } else if (type === "hobby") {
            navigate("/tags/cert", {
                state: { hobbies, skills, certs },
            });
        } else {
            // 最後
            navigate("/profile/edit", {
                state: { hobbies, skills, certs },
            });
        }
    };

    return (
        <div>
            <h2>{type === "hobby"
                ? "興味タグ"
                : type === "skill"
                    ? "技術タグ"
                    : "資格タグ"}
            </h2>
            <div>
                <button onClick={() => navigate(-1)}>
                    ← 戻る
                </button>
            </div>
            <div>
                {tags.map((tag) => (
                    <button
                        key={tag.id}
                        onClick={() => toggleTag(tag)}
                        style={{
                            backgroundColor: selected.includes(tag.id) ? "blue" : "gray",
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