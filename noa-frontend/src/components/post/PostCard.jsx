function App() {
  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      {/* 上部 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "60px",
            border: "1px solid black",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "12px",
          }}
        >
          アイコン
        </div>

        <a href="#">下書きを見る</a>
      </div>

      {/* 投稿内容 */}
      <textarea
        placeholder="テキストボックス"
        style={{
          width: "100%",
          height: "400px",
          padding: "10px",
          resize: "none",
        }}
      />

      {/* 添付と投稿ボタン */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "10px",
          }}
        >
          <button>画像</button>
          <button>動画</button>
          <button>コード</button>
          <button>ファイル</button>
        </div>

        <button>投稿</button>
      </div>
    </div>
  );
}

export default App;