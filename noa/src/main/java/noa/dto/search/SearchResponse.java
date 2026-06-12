package noa.dto.search;

import java.util.List;

import noa.dto.PostResponse;

public record SearchResponse(
    List<PostResponse> posts,
    List<SearchTagResponse> tags,
    boolean hasMorePosts
) {
    
}
