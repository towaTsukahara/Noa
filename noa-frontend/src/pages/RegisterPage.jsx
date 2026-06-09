import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import "./RegisterPage.css";

function RegisterPage() {
  // アカウント登録で入力するのは「社員番号・メール・パスワード」の3つだけ。
  const [employeeNo, setEmployeeNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      // 1) 登録（社員番号・メール・パスワード）
      await api("/auth/register", {
        method: "POST",
        body: JSON.stringify({ employeeNo, email, password }),
      });

      // 2) 登録成功後そのままログイン状態にする（F-101: 登録=即有効）
      await login(email, password);

      // 3) プロフィール設定画面へ遷移
      navigate("/profile/edit");
    } catch (e) {
      setError("登録できませんでした。入力内容を確認してください（メールは @skywill.jp、パスワードは半角英数字8文字以上）。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth-card auth-card-wide">
        <h1 className="auth-logo">N<span>o</span>a</h1>
        <p className="auth-sub">Noaのアカウントを作成します</p>

        {/* 社員番号 */}
        <label className="auth-label">
          <span className="auth-label-text">社員番号</span>
          <input
            className="field"
            type="text"
            value={employeeNo}
            onChange={(e) => setEmployeeNo(e.target.value)}
            placeholder="例: A2001"
          />
        </label>

        {/* メールアドレス */}
        <label className="auth-label">
          <span className="auth-label-text">メールアドレス（@skywill.jp）</span>
          <input
            className="field"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: yourname@skywill.jp"
          />
        </label>

        {/* パスワード */}
        <label className="auth-label">
          <span className="auth-label-text">パスワード（半角英数字8文字以上）</span>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
          />
        </label>

        {error && <p className="auth-error">{error}</p>}

        <button className="btn auth-submit" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "登録中..." : "登録する"}
        </button>

        <p className="auth-foot">
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;
