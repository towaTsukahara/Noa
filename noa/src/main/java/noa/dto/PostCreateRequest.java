package noa.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record PostCreateRequest(
    @NotBlank(message = "本文を入力してください")
    @Size(max = 1000, message = "本文は1000文字以内です")
    String body,

    // タグ名のリスト（任意。null や空でもOK）。例: ["React", "質問"]
    List<String> tags
) {}