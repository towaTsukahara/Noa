package noa.dto;

import jakarta.validation.constraints.*;

public record RegisterRequest(
    @NotBlank String employeeNo,
    @NotBlank @Email @Pattern(regexp = ".+@skywill\\.jp$", message = "社内メール(@skywill.jp)のみ登録できます")
    String email,
    @NotBlank @Pattern(regexp = "^[a-zA-Z0-9]{8,}$", message = "パスワードは半角英数字8文字以上です")
    String password
) {}