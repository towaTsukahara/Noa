package noa.dto;

import noa.entity.User;
import java.util.List;
import java.util.Map;

/**
 * ユーザーの公開ビュー（完全秘匿）。
 * 氏名・役職・年齢・社員番号・メールは含めない（F-105 の核）。
 */
public record UserSummaryResponse(
    String handle,
    String bio,
    Map<String, List<String>> tags,   // tech / hobby / cert
    boolean isFollowing,
    String nickname
) {
    public static UserSummaryResponse from(User u, boolean isFollowing, String nickname) {
        // TODO(F-104): 興味タグ(user_tags)が未実装のため現状は空。
        //              プロフィール実装後に user_tags から tech/hobby/cert を詰める。
        Map<String, List<String>> tags = Map.of(
            "tech", List.of(),
            "hobby", List.of(),
            "cert", List.of()
        );
        return new UserSummaryResponse(u.getHandle(), u.getBio(), tags, isFollowing, nickname);
    }
}