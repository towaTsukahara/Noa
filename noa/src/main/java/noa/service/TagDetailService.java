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
import java.util.Map;

@Service
public class TagDetailService {

    private final TagService tagService;
    private final PostRepository postRepository;
    private final TagFollowRepository tagFollowRepository;
    private final LikeRepository likeRepository;
    private final NicknameService nicknameService;

    public TagDetailService(
            TagService tagService,
            PostRepository postRepository,
            TagFollowRepository tagFollowRepository,
            LikeRepository likeRepository,
            NicknameService nicknameService) {
        this.tagService = tagService;
        this.postRepository = postRepository;
        this.tagFollowRepository = tagFollowRepository;
        this.likeRepository = likeRepository;
        this.nicknameService = nicknameService;
    }

    public TagDetailResponse getTag(User user, Long tagId) {

        Tag tag = tagService.findById(tagId);

        boolean followed = tagFollowRepository.existsByUserIdAndTagId(user.getId(), tagId);

        // viewer が付けたニックネーム辞書（handle → nickname）を1回だけ取得
        Map<String, String> nickMap = nicknameService.nicknameMapOf(user);

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
                            replyCount,
                            nickMap.get(post.getAuthor().getHandle()));
                })
                .toList();

        return new TagDetailResponse(
                tag.getId(),
                tag.getName(),
                followed,
                posts);
    }
}
