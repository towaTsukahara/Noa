function App() {
  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "30px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          paddingTop: "40px",
        }}
      >
        <h1>ログイン</h1>

        <p>Noaアカウントにログイン</p>

        <input
          type="text"
          placeholder="メールアドレス or 社員番号"
          style={{
            display: "block",
            width: "500px",
            height: "50px",
            margin: "30px auto",
          }}
        />

        <input
          type="password"
          placeholder="パスワード"
          style={{
            display: "block",
            width: "500px",
            height: "50px",
            margin: "30px auto",
          }}
        />

        <button
          style={{
            width: "500px",
            height: "50px",
          }}
        >
          ログイン
        </button>

        <p style={{ marginTop: "20px" }}>
          アカウントをお持ちでない方は
          <a href="#">新規登録</a>
        </p>
      </div>
    </div>
  );
}

export default App;