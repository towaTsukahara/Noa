package noa.dto;

import noa.entity.User;

public record UserResponse(
    String handle,
    String employeeNo,
    String email,
    String role,
    String status,
    boolean emailVerified,
    String bio
) {
    // User エンティティから詰め替える
    public static UserResponse from(User u) {
        return new UserResponse(
            u.getHandle(), u.getEmployeeNo(), u.getEmail(),
            u.getRole(), u.getStatus(), u.isEmailVerified(), u.getBio()
        );
    }
}