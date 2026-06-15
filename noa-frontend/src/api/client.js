// src/api/client.js

// APIエラーを表すクラス（status と サーバーからのメッセージを持つ）
export class ApiError extends Error {
  constructor(status, message, body) {
    super(message);
    this.name = "ApiError";
    this.status = status;   // HTTPステータス（409, 404, 500...）
    this.body = body;       // サーバーが返したエラー内容
  }
}

export async function api(path, options = {}) {
  let res;
  try {
    res = await fetch(`/api/v1${path}`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      ...options,
    });
  } catch (networkError) {
    // ネットワーク障害（サーバーに繋がらない等）→ これは本物の問題
    console.error("ネットワークエラー:", path, networkError);
    throw new ApiError(0, "サーバーに接続できませんでした", null);
  }

  if (!res.ok) {
    // エラーレスポンスの中身を読む（JSONならパース、ダメならテキスト）
    const text = await res.text();
    let body = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }

    // サーバーエラー(5xx)は本物の障害なのでコンソールに出す。
    // 業務エラー(4xx)は想定内なので、静かに投げる（呼び出し側で処理）。
    if (res.status >= 500) {
      console.error("サーバーエラー:", path, res.status, body);
    }

    const message = (body && body.message) ? body.message : `API error: ${res.status}`;
    throw new ApiError(res.status, message, body);
  }

  // 成功。中身が無いレスポンス（204 や 空ボディ）は null
  if (res.status === 204) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}