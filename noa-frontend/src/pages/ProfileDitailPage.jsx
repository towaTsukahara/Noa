import { useState, useEffect } from "react";

export default function OtherProfilePage() {
  // 本来はURLやAPIから取得
  const targetUserId = "user001";

  const [nickname, setNickname] = useState("");

  useEffect(() => {
    const savedName = localStorage.getItem(
      `nickname_${targetUserId}`
    );

    if (savedName) {
      setNickname(savedName);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem(
      `nickname_${targetUserId}`,
      nickname
    );

    alert("保存しました");
  };

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      {/* ヘッダー画像 */}
      <div
        style={{
          height: "180px",
          background: "#ddd",
          borderRadius: "8px",
        }}
      />

      {/* アイコン */}
      <div
        style={{
          width: "100px",
          height: "100px",
          background: "#bbb",
          borderRadius: "50%",
          margin: "-50px auto 20px",
          border: "4px solid white",
        }}
      />

      {/* ニックネーム編集 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          value={nickname}
          placeholder="この人の呼び名"
          onChange={(e) =>
            setNickname(e.target.value)
          }
          style={{
            padding: "8px",
            border: "1px solid #ccc",
          }}
        />

        <button
          onClick={handleSave}
          style={{
            padding: "8px 16px",
            cursor: "pointer",
          }}
        >
          保存
        </button>
      </div>

      {/* 統計 */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "40px",
          marginBottom: "30px",
        }}
      >
        <div>
          <div>投稿</div>
          <strong>12</strong>
        </div>

        <div>
          <div>いいね</div>
          <strong>20</strong>
        </div>
      </div>

      {/* 自己紹介 */}
      <section style={{ marginBottom: "20px" }}>
        <h3>自己紹介</h3>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            minHeight: "80px",
          }}
        >
          自己紹介文
        </div>
      </section>

      {/* 興味タグ */}
      <section style={{ marginBottom: "20px" }}>
        <h3>興味タグ</h3>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
          }}
        >
          #映画 #カフェ #旅行
        </div>
      </section>

      {/* 技術タグ */}
      <section style={{ marginBottom: "20px" }}>
        <h3>技術スタック</h3>

        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
          }}
        >
          #React #JavaScript
        </div>
      </section>

      {/* 投稿一覧 */}
      <h3>投稿</h3>

      {[1, 2].map((post) => (
        <div
          key={post}
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            marginBottom: "12px",
          }}
        >
          <div
            style={{
              fontWeight: "bold",
              marginBottom: "8px",
            }}
          >
            {nickname || "未設定"}
          </div>

          <div>投稿内容</div>

          <div
            style={{
              marginTop: "10px",
              color: "#666",
            }}
          >
            ♡ 12
          </div>
        </div>
      ))}
    </div>
  );
}