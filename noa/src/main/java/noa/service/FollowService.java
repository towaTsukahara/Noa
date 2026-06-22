package noa.service;

import noa.dto.UserSummaryResponse;
import noa.entity.Follow;
import noa.entity.User;
import noa.repository.FollowRepository;
import noa.repository.UserRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class FollowService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;
    private final ProfileService profileService;

    public FollowService(FollowRepository followRepository, UserRepository userRepository,
            ProfileService profileService) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
        this.profileService = profileService;
    }

    // フォローする（自己フォローは400・重複は冪等）
    @Transactional
    public void follow(User follower, String targetHandle) {
        User target = findActiveUser(targetHandle);
        if (target.getId().equals(follower.getId())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "自分自身はフォローできません");
        }
        if (followRepository.existsByFollowerIdAndFolloweeId(follower.getId(), target.getId())) {
            return;
        }
        Follow follow = new Follow();
        follow.setFollowerId(follower.getId());
        follow.setFolloweeId(target.getId());
        followRepository.save(follow);
    }

    // フォロー解除（未フォローなら何もしない＝冪等）
    @Transactional
    public void unfollow(User follower, String targetHandle) {
        User target = findActiveUser(targetHandle);
        followRepository.findByFollowerIdAndFolloweeId(follower.getId(), target.getId())
                .ifPresent(followRepository::delete);
    }

    // 自分がフォロー中のユーザー一覧（カーソルページング）
    public Map<String, Object> getFollowing(User viewer, Long cursor, int limit) {
        Pageable pageable = PageRequest.of(0, limit);
        List<Follow> follows = (cursor == null)
                ? followRepository.findFollowingFirst(viewer.getId(), pageable)
                : followRepository.findFollowingAfter(viewer.getId(), cursor, pageable);

        // フォロー順を保ったまま相手ユーザーを解決
        List<UserSummaryResponse> items = new ArrayList<>();
        for (Follow f : follows) {
            userRepository.findById(f.getFolloweeId()).ifPresent(u -> items.add(UserSummaryResponse.from(
                    u,
                    profileService.tagsOf(u),
                    true, // フォロー中一覧なので必ず true
                    f.getNickname())));
        }

        Long nextCursor = (follows.size() == limit && !follows.isEmpty())
                ? follows.get(follows.size() - 1).getId()
                : null;

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("items", items);
        result.put("nextCursor", nextCursor);
        return result;
    }

    private User findActiveUser(String handle) {
        return userRepository.findByHandle(handle)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "ユーザーが見つかりません"));
    }

    // TODO(F-104): タグ取得が実装されたらこのヘルパーは不要になる
    private Map<String, List<String>> emptyTags() {
        Map<String, List<String>> tags = new LinkedHashMap<>();
        tags.put("tech", List.of());
        tags.put("hobby", List.of());
        tags.put("cert", List.of());
        return tags;
    }

    // ニックネームを設定/変更する（フォローしている相手のみ）
    @Transactional
    public void setNickname(User follower, String targetHandle, String nickname) {
        User target = findActiveUser(targetHandle);
        Follow follow = followRepository.findByFollowerIdAndFolloweeId(follower.getId(), target.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST, "フォローしている相手にのみニックネームを設定できます"));

        // 空文字・空白だけなら削除扱い（nullに）
        String trimmed = (nickname == null) ? null : nickname.trim();
        follow.setNickname((trimmed == null || trimmed.isEmpty()) ? null : trimmed);
        followRepository.save(follow);
    }

    // ニックネームを削除する（nullに戻す）
    @Transactional
    public void clearNickname(User follower, String targetHandle) {
        User target = findActiveUser(targetHandle);
        followRepository.findByFollowerIdAndFolloweeId(follower.getId(), target.getId())
                .ifPresent(follow -> {
                    follow.setNickname(null);
                    followRepository.save(follow);
                });
    }
}