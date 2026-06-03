import { useNavigate } from "react-router-dom";

function ProfileEditPage() {
    const navigate = useNavigate();

    const bio = "フロントエンジニアです。";
    const skillTags = ["React", "JavaScript", "HTML", "CSS",];
    const hobbyTags = ["ゲーム", "読書", "旅行",];
    const certTags = ["基本情報技術者", "応用情報技術者"];

    const handleTagSkillEditClick = () => {
        navigate("/tags/skilledit");
    };
    const handleTagHobbyEditClick = () => {
        navigate("/tags/hobbyedit");
    };
    const handleTagCertEditClick = () => {
        navigate("/tags/certedit");
    };

    const handleCancelClick = () => {
        navigate("/profile");
    };

    const handleSaveClick = () => {
        navigate("/profile");
    };

    return (
        <div>
            <h1>プロフィール編集</h1>

            <div>
                <h3>自己紹介</h3>
                <textarea defaultValue={bio} />
            </div>

            <div>
                <h3>技術タグ</h3>
                {skillTags.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}
                <button onClick={handleTagSkillEditClick}>さらに表示</button>
            </div>

            <div>
                <h3>興味タグ</h3>
                {hobbyTags.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}

                <button onClick={handleTagHobbyEditClick}>さらに表示</button>
            </div>

            <div>
                <h3>資格タグ</h3>
                {certTags.map((tag) => (
                    <div key={tag}>{tag}</div>
                ))}

                <button onClick={handleTagCertEditClick}>さらに表示</button>
            </div>

            <div>
                <button onClick={handleCancelClick}>キャンセル</button>
                <button onClick={handleSaveClick}>保存</button>
            </div>
        </div>
    );
}

export default ProfileEditPage;