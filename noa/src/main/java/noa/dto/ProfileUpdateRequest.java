package noa.dto;

import jakarta.validation.constraints.Size;
import java.util.List;

public record ProfileUpdateRequest(
    String employee_no,
    String email,
    @Size(max = 200, message = "自己紹介は200字以内です")
    String bio,
    List<String> techTags,
    List<String> hobbyTags,
    List<String> certTags
    ) {

}
