package noa.repository;

import noa.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // 自分宛の通知を新しい順
    List<Notification> findByRecipientIdOrderByIdDesc(Long recipientId);

    // 未読件数
    long countByRecipientIdAndIsReadFalse(Long recipientId);

    // 自分宛の未読を全部既読にする
    @Modifying
    @Query("update Notification n set n.isRead = true where n.recipientId = :recipientId and n.isRead = false")
    void markAllRead(@Param("recipientId") Long recipientId);
}