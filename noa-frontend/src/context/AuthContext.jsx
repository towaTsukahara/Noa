import { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);     // 現在のユーザー（未ログインは null）
  const [loading, setLoading] = useState(true); // 起動時の復元中フラグ

  // 起動時に /me を叩いて、セッションが生きていればログイン状態を復元
  useEffect(() => {
    api("/me")
      .then((u) => setUser(u))
      .catch(() => setUser(null)) // 401 などは未ログイン扱い
      .finally(() => setLoading(false));
  }, []);

  // ログイン：成功したらユーザーを保持
  const login = async (email, password) => {
    const u = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setUser(u);
    return u;
  };

  // ログアウト：サーバのセッションを破棄して状態をクリア
  const logout = async () => {
    try {
      await api("/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// 各画面から使うためのフック
export function useAuth() {
  return useContext(AuthContext);
}