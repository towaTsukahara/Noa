import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./LoginPage.css";
import noaLogo from "../../public/icons/noa-logo.png";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(null);
    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      setError("メールアドレスまたはパスワードが違います");
    }
  };

  return (
    <div className="auth">
      <div className="auth-card">
        <h1 className="auth-logo">
          <img src={noaLogo} alt="Noa" />
        </h1>
        <p className="auth-sub">Noaアカウントにログイン</p>

        <input
          className="field auth-input"
          type="text"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="field auth-input"
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="auth-error">{error}</p>}

        <button className="btn auth-submit" onClick={handleLogin}>
          ログイン
        </button>

        <p className="auth-foot">
          アカウントをお持ちでない方は <Link to="/register">新規登録</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;