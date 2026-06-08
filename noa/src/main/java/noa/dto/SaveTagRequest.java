package noa.dto;

import java.util.List;

public class SaveTagRequest {
    private Long userId;
    private List<String> tagNames;
    private String category;

    public Long getUserId() { return userId; }
    public List<String> getTagNames() { return tagNames; }
    public String getCategory() { return category; }

    public void setUserId(Long userId) { this.userId = userId; }
    public void setTagNames(List<String> tagNames) { this.tagNames = tagNames; }
    public void setCategory(String category) { this.category = category; }
}