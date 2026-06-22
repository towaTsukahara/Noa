package noa.dto;

import java.util.List;
import java.util.Map;

import noa.entity.User;

public record UserResponse(
    String handle,
    String employeeNo,
    String email,
    String role,
    String status,
    boolean emailVerified,
    String bio,
    Map<String, List<String>> tags,
    long postCount,
    long likeCount,
    long likedPostCount //いいねした数
) {

    public static UserResponse from(User u) {
        return from(u, Map.of("tech", List.of(), "hobby", List.of(), "cert", List.of()), 0, 0, 0);
    }
    
    // User エンティティから詰め替える
    public static UserResponse from(User u, Map<String, List<String>> tags, long postCount, long likeCount, long likedPostCount) {
        return new UserResponse(
            u.getHandle(), u.getEmployeeNo(), u.getEmail(),
            u.getRole(), u.getStatus(),
            u.isEmailVerified(), u.getBio(), tags,
            postCount, likeCount, likedPostCount
        );
    }
}