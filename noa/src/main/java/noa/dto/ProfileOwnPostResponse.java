package noa.dto;

import noa.entity.ProfileOwnPost;

public record ProfileOwnPostResponse(
    Long id,
    Long authorId,
    Long parentId,
    String body,
    String createdAt
) {

    public static ProfileOwnPostResponse from(ProfileOwnPost pop) {
        return new ProfileOwnPostResponse(
            pop.getId(), pop.getAuthorId(), pop.getParentId(), pop.getBody(), 
            pop.getCreatedAt() == null ? null : pop.getCreatedAt().toString()
        );
    }
}
