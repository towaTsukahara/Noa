package noa.service;

import noa.dto.TagResponse;
import noa.entity.Tag;
import noa.entity.TagFollow;
import noa.entity.User;
import noa.repository.TagFollowRepository;
import noa.repository.TagRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class TagFollowService {

    private final TagFollowRepository tagFollowRepository;
    private final TagRepository tagRepository;
    private final TagService tagService;

    public TagFollowService(TagFollowRepository tagFollowRepository,
                            TagRepository tagRepository,
                            TagService tagService) {
        this.tagFollowRepository = tagFollowRepository;
        this.tagRepository = tagRepository;
        this.tagService = tagService;
    }

    // タグをフォローする（タグ名で。なければ作成。重複は冪等）
    @Transactional
    public void follow(User user, String tagName) {
        Tag tag = tagService.findOrCreate(tagName);
        if (tagFollowRepository.existsByUserIdAndTagId(user.getId(), tag.getId())) {
            return;
        }
        TagFollow tf = new TagFollow();
        tf.setUserId(user.getId());
        tf.setTagId(tag.getId());
        tagFollowRepository.save(tf);
    }

    // タグのフォロー解除（タグ名で。未フォローなら何もしない＝冪等）
    @Transactional
    public void unfollow(User user, String tagName) {
        String normalized = tagName.trim().toLowerCase();
        tagRepository.findByName(normalized).ifPresent(tag ->
            tagFollowRepository.findByUserIdAndTagId(user.getId(), tag.getId())
                    .ifPresent(tagFollowRepository::delete)
        );
    }

    // 自分がフォロー中のタグ一覧
    public List<TagResponse> getFollowingTags(User user) {
        List<TagResponse> result = new ArrayList<>();
        for (TagFollow tf : tagFollowRepository.findByUserIdOrderByIdDesc(user.getId())) {
            tagRepository.findById(tf.getTagId())
                    .ifPresent(tag -> result.add(TagResponse.from(tag)));
        }
        return result;
    }
}