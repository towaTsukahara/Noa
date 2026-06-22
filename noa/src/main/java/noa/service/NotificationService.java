package noa.service;

import noa.dto.NotificationResponse;
import noa.entity.Notification;
import noa.entity.Post;
import noa.entity.User;
import noa.repository.NotificationRepository;
import noa.repository.PostRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final PostRepository postRepository;

    public NotificationService(NotificationRepository notificationRepository,
                               PostRepository postRepository) {
        this.notificationRepository = notificationRepository;
        this.postRepository = postRepository;
    }

    // 通知を1件作る（いいね・コメント時に呼ぶ）。自分の投稿への自分の操作は作らない。
    @Transactional
    public void create(Long recipientId, Long actorId, Long postId, String type) {
        if (recipientId.equals(actorId)) return; // 自分の操作は通知しない
        Notification n = new Notification();
        n.setRecipientId(recipientId);
        n.setActorId(actorId);
        n.setPostId(postId);
        n.setType(type);
        notificationRepository.save(n);
    }

    // 自分宛の通知一覧（「誰が」は出さず、種別・対象投稿・既読のみ）
    public List<NotificationResponse> getMyNotifications(User viewer) {
        List<NotificationResponse> result = new ArrayList<>();
        for (Notification n : notificationRepository.findByRecipientIdOrderByIdDesc(viewer.getId())) {
            // 対象投稿の本文（冒頭表示用）。通知自体は残すが、削除済み投稿の本文は見せない。
            String postBody = postRepository.findById(n.getPostId())
                    .filter(p -> !p.isDeleted())   // 論理削除された投稿は除外
                    .map(Post::getBody)
                    .orElse("(削除された投稿)");
            result.add(new NotificationResponse(
                    n.getId(),
                    n.getType(),
                    n.getPostId(),
                    postBody,
                    n.isRead(),
                    n.getCreatedAt()
            ));
        }
        return result;
    }

    public long getUnreadCount(User viewer) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(viewer.getId());
    }

    @Transactional
    public void markAllRead(User viewer) {
        notificationRepository.markAllRead(viewer.getId());
    }
}