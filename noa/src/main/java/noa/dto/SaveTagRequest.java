package noa.dto;

import java.util.List;

public class SaveTagRequest {
    private Long userId;
    private List<Long> tagIds;
    private String category;

    public Long getUserId() {
        return userId;
    }

    public List<Long> getTagIds() {
        return tagIds;
    }

    public String getCategory() {
        return category;
    }
}