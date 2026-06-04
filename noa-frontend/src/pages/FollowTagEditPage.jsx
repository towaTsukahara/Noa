import { useNavigate, useLocation } from "react-router-dom";
import { useMemo, useState, useEffect } from "react";

// ダミーデータ。バックエンド実装したら消す。
const TAGS = {
    hobby: ["コーヒー", "登山", "ゲーム", "読書", "カフェ巡り", "ランニング"],
    skill: ["Java", "Spring Boot", "React", "AWS", "Python", "SQL"],
    cert: ["基本情報技術者", "応用情報技術者"],
};

const FollowTagEditPage = ({ type }) => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchKeyword, setSearchKeyword] = useState("");

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

    const selected = type === "hobby" ? hobbies : type === "skill" ? skills : certs;
    const setSelected = type === "hobby" ? setHobbies : type === "skill" ? setSkills : setCers;

    const toggleTag = (tag) => {
        if (selected.includes(tag)) {
            setSelected(selected.filter(t => t !== tag));
        } else {
            setSelected([...selected, tag]);
        }
    };

    const filteredTags = useMemo(() => {
        return TAGS[type].filter((tag) =>
            tag.toLowerCase().includes(searchKeyword.toLowerCase())
        );
    }, [type, searchKeyword]);

    const handleBackClick = () => {
        navigate("/follow");
    };

    const handleSaveClick = () => {
        navigate("/follow");
    };

    return (
        <div>
            {/* 検索バー */}
            <input
                type="text"
                placeholder="検索"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
            />

            <h2>{type === "hobby" ? "興味タグ" : type === "skill" ? "技術スタックタグ" : "資格タグ"}</h2>
            <div>
                {filteredTags.map((tag) => (
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
                <button onClick={handleBackClick}>戻る</button>
                <button onClick={handleSaveClick}>保存({selected.length}つフォロー中)</button>
            </div>
        </div>
    );
};
export default FollowTagEditPage;