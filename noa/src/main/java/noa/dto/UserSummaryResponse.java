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
        Map<String, List<String>> tags, // tech / hobby / cert
        boolean isFollowing,
        String nickname) {
    public static UserSummaryResponse from(
            User u, Map<String, List<String>> tags,
            boolean isFollowing, String nickname) {
        return new UserSummaryResponse(u.getHandle(), u.getBio(), tags, isFollowing, nickname);
    }
}