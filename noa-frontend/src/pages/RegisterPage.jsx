import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  // アカウント登録で入力するのは「社員番号・メール・パスワード」の3つだけ。
  // （アイコン・自己紹介・タグなどはプロフィール設定=F-104の領域。ここでは扱わない）
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
      //    プロフィール設定API(/me/profile)はログイン必須のため、ここでログインしておく
      await login(email, password);

      // 3) プロフィール設定画面へ遷移
      //    TODO: 遷移先パスは F-104(プロフィール)担当と要調整。現状は /profile/edit。
      navigate("/profile/edit");
    } catch (e) {
      // 登録APIのエラー（例: 409=重複、400=バリデーション違反）をまとめて表示
      // TODO: サーバのエラーメッセージを使った詳細な出し分けは追って改善
      setError("登録できませんでした。入力内容を確認してください（メールは @skywill.jp、パスワードは半角英数字8文字以上）。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "30px" }}>
      <div style={{ maxWidth: "500px", margin: "0 auto", paddingTop: "40px" }}>
        <h1 style={{ textAlign: "center" }}>新規登録</h1>
        <p style={{ textAlign: "center" }}>Noaのアカウントを作成します</p>

        {/* 社員番号 */}
        <label style={{ display: "block", marginTop: "20px" }}>
          社員番号
          <input
            type="text"
            value={employeeNo}
            onChange={(e) => setEmployeeNo(e.target.value)}
            placeholder="例: A2001"
            style={{ display: "block", width: "100%", height: "44px", marginTop: "6px" }}
          />
        </label>

        {/* メールアドレス */}
        <label style={{ display: "block", marginTop: "16px" }}>
          メールアドレス（@skywill.jp）
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="例: yourname@skywill.jp"
            style={{ display: "block", width: "100%", height: "44px", marginTop: "6px" }}
          />
        </label>

        {/* パスワード */}
        <label style={{ display: "block", marginTop: "16px" }}>
          パスワード（半角英数字8文字以上）
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="********"
            style={{ display: "block", width: "100%", height: "44px", marginTop: "6px" }}
          />
        </label>

        {error && <p style={{ color: "red", marginTop: "16px" }}>{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{ width: "100%", height: "48px", marginTop: "24px", cursor: "pointer" }}
        >
          {submitting ? "登録中..." : "登録する"}
        </button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          すでにアカウントをお持ちの方は <Link to="/login">ログイン</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;