package noa.dto;

// ニックネーム設定リクエスト（PUT /users/{handle}/nickname）
public class NicknameRequest {
    private String nickname;

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }
}