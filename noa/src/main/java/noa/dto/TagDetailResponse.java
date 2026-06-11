package noa.dto;

import java.util.List;

public record TagDetailResponse(
    Long id,
    String name,
    boolean followed,
    List<PostResponse> posts
) {

}
