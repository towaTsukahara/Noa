package noa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record PostCreateRequest(
    @NotBlank(message = "本文を入力してください")
    @Size(max = 1000, message = "本文は1000文字以内です")
    String body
) {}