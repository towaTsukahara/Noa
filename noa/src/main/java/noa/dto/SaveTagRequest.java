package noa.dto;

import java.util.List;

import jakarta.validation.constraints.Size;

public class SaveTagRequest {

    private Long userId;

    @Size(max = 30, message = "タグ名は30文字以内で入力してください")
    private List<@Size(max = 30, message = "タグ名は30文字以内で入力してください") String> tagNames;

    private String category;

    public Long getUserId() {
        return userId;
    }

    public List<String> getTagNames() {
        return tagNames;
    }

    public String getCategory() {
        return category;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setTagNames(List<String> tagNames) {
        this.tagNames = tagNames;
    }

    public void setCategory(String category) {
        this.category = category;
    }
}