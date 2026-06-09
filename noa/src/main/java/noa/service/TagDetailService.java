package noa.service;

import noa.dto.PostResponse;
import noa.dto.TagDetailResponse;
import noa.entity.Post;
import noa.entity.Tag;
import noa.entity.User;
import noa.repository.LikeRepository;
import noa.repository.PostRepository;
import noa.repository.TagFollowRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagDetailService {

    private final TagService tagService;
    private final PostRepository postRepository;
    private final TagFollowRepository tagFollowRepository;
    private final LikeRepository likeRepository;

    public TagDetailService(
            TagService tagService,
            PostRepository postRepository,
            TagFollowRepository tagFollowRepository,
            LikeRepository likeRepository) {
        this.tagService = tagService;
        this.postRepository = postRepository;
        this.tagFollowRepository = tagFollowRepository;
        this.likeRepository = likeRepository;
    }

    public TagDetailResponse getTag(User user, Long tagId) {

        Tag tag = tagService.findById(tagId);

        boolean followed = tagFollowRepository.existsByUserIdAndTagId(user.getId(), tagId);

        List<PostResponse> posts = postRepository.findByTagId(tagId)
                .stream()
                .map(post -> {

                    long likeCount = likeRepository.countByPostId(post.getId());

                    boolean likedByMe = likeRepository.existsByUserIdAndPostId(
                            user.getId(),
                            post.getId());

                    long replyCount = postRepository.countReplies(post.getId());

                    return PostResponse.from(
                            post,
                            likeCount,
                            likedByMe,
                            replyCount);
                })
                .toList();

        return new TagDetailResponse(
                tag.getId(),
                tag.getName(),
                followed,
                posts);
    }
}
