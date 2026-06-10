package noa.service;

import noa.entity.Follow;
import noa.entity.User;
import noa.repository.FollowRepository;
import noa.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

// ニックネーム辞書を作る専用サービス（依存を浅く保ち、循環依存を避ける）
@Service
public class NicknameService {

    private final FollowRepository followRepository;
    private final UserRepository userRepository;

    public NicknameService(FollowRepository followRepository, UserRepository userRepository) {
        this.followRepository = followRepository;
        this.userRepository = userRepository;
    }

    // viewer が付けている「相手handle → nickname」辞書を一括取得
    public Map<String, String> nicknameMapOf(User viewer) {
        Map<String, String> map = new HashMap<>();
        for (Follow f : followRepository.findByFollowerId(viewer.getId())) {
            if (f.getNickname() != null) {
                userRepository.findById(f.getFolloweeId())
                        .ifPresent(u -> map.put(u.getHandle(), f.getNickname()));
            }
        }
        return map;
    }
}