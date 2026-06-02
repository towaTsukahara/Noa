import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    try {
      const user = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      console.log("ログイン成功:", user);
      navigate("/"); // タイムラインへ
    } catch (e) {
      setError("メールアドレスまたはパスワードが違います");
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "30px" }}>
      <div style={{ textAlign: "center", paddingTop: "40px" }}>
        <h1>ログイン</h1>
        <p>Noaアカウントにログイン</p>

        <input
          type="text"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ display: "block", width: "500px", height: "50px", margin: "30px auto" }}
        />
        <input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ display: "block", width: "500px", height: "50px", margin: "30px auto" }}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button onClick={handleLogin} style={{ width: "500px", height: "50px" }}>
          ログイン
        </button>

        <p style={{ marginTop: "20px" }}>
          アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;