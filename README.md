# Noa（社内SNS）

役職・見た目・閲覧の圧から解放された、社外秘も話せる社内向けSNS。

- バックエンド：Spring Boot 3 / Java 17 / PostgreSQL 16 / Flyway（`noa/`）
- フロントエンド：React（Vite）/ JavaScript（`noa-frontend/`）
- 構成：モノレポ（1リポジトリにバック・フロント同梱）

---

## 必要な環境

| ツール | バージョン目安 |
|---|---|
| JDK | 17（Temurin 等） |
| Node.js | 18 以上（推奨 20+） |
| PostgreSQL | 16 |
| Git | 2.x |

ビルドツールは Maven（`noa/mvnw` 同梱のため別途インストール不要）。

---

## ディレクトリ構成

```
Project Noa/
├── noa/              # バックエンド（Spring Boot）
├── noa-frontend/     # フロントエンド（React + Vite）
└── README.md
```

---

## セットアップ手順

### 1. リポジトリを取得

```bash
git clone <このリポジトリのURL>
cd "Project Noa"
```

### 2. データベースを用意（初回のみ）

PostgreSQL に管理者で入り、専用ロールとDBを作成する。

```bash
psql -U postgres
```

```sql
CREATE ROLE noa WITH LOGIN PASSWORD 'チームで決めた開発用パスワード';
CREATE DATABASE noa OWNER noa;
GRANT ALL PRIVILEGES ON DATABASE noa TO noa;
\q
```

> もし起動時に「permission denied for schema public」が出たら、`psql -U postgres -d noa` で入って `GRANT ALL ON SCHEMA public TO noa;` を実行。

### 3. バックエンドの設定（初回のみ）

`application.properties` は秘密情報を含むため Git 管理外。見本をコピーして各自の値を入れる。

```bash
cp noa/src/main/resources/application.properties.example noa/src/main/resources/application.properties
```

コピーした `application.properties` の `spring.datasource.password` を、手順2で決めたパスワードに書き換える。

### 4. バックエンドを起動（:8080）

```bash
cd noa
./mvnw spring-boot:run
```

- 初回起動時に Flyway が `src/main/resources/db/migration/` の V1〜V10（スキーマ）と V100（開発用ダミーデータ）を自動投入する。
- `Started NoaApplication ...` が出れば成功。
- 疎通確認：ブラウザで `http://localhost:8080/api/v1/ping` → `{"status":"ok","service":"noa"}`

### 5. フロントエンドを起動（:5173）

別ターミナルで：

```bash
cd noa-frontend
npm install        # 初回のみ
npm run dev
```

- `http://localhost:5173/` を開く。
- フロントの `/api` へのリクエストは Vite プロキシ経由でバック（:8080）へ転送される（`vite.config.js`）。

### 6. 動作確認

`http://localhost:5173/` のタイムラインにモック投稿が表示されれば、バック・フロントの疎通までOK。

---

## 開発用データ

- ダミーユーザー：`Noa-001`〜`Noa-006`（`Noa-001` のみ ADMIN）
- 全ユーザー共通の開発用パスワード：`password1`（※開発段階のため平文。本番ではハッシュ化）
- 投稿・返信・いいね・フォロー・タグフォロー・通知まで投入済み

---

## 開発のお約束

- **スキーマ変更は Flyway で**：適用済みのマイグレーションは編集せず、必ず新しい `V◯◯__*.sql` を追加する。
- **秘密情報をコミットしない**：`application.properties` や `.env` は Git 管理外（`.gitignore` 済み）。
- **認証は現在開発用に緩めている**：`SecurityConfig` で全許可。F-102 でセッション認証を本実装する際に締める。
- ブランチ運用・PR・issue 管理はチームの取り決めに従う。

---

## 技術ドキュメント

設計概要書・ER図・API仕様書・機能一覧・スケジュールは別途共有。API仕様は起動後に Swagger UI（`http://localhost:8080/swagger-ui.html`）でも確認できる（springdoc 追加後）。