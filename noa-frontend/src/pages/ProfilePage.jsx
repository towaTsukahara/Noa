function ProfilePage() {
    const profile = {
        name: "20260027",
        icon: "https://via.placeholder.com/150",
        bio: "フロントエンドエンジニアです。",
        techTags: ["React", "JavaScript", "HTML", "CSS"],
        hobbyTags: ["ゲーム", "読書", "旅行"],
    };

    return (
    <div>
      <div>
        <img
          src={profile.icon}
          alt="プロフィール画像"
        />

        <div>{profile.name}</div>
      </div>

      <div>
        <div>{profile.bio}</div>

        <div>
          <h3>技術タグ</h3>

          {profile.techTags.map((tag) => (
            <div key={tag}>{tag}</div>
          ))}
        </div>

        <div>
          <h3>趣味タグ</h3>

          {profile.hobbyTags.map((tag) => (
            <div key={tag}>{tag}</div>
          ))}
        </div>

        <button>プロフィールを編集</button>
      </div>
    </div>
  );
}

export default ProfilePage;