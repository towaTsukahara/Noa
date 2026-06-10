package noa.dto;

import noa.entity.Tag;

public record TagSummaryResponse(
        Long id,
        String name) {
    public static TagSummaryResponse from(Tag tag) {
        return new TagSummaryResponse(
                tag.getId(),
                tag.getName());
    }
}
