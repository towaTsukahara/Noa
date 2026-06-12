package noa.repository;

import noa.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {

    // 重複通報チェック（1人1対象1回）
    boolean existsByReporterIdAndTargetTypeAndTargetId(Long reporterId, String targetType, Long targetId);

    // 状態でフィルタして新しい順（管理者一覧用）
    List<Report> findByStatusOrderByIdDesc(String status);

    // 全件を新しい順（状態問わず見る用）
    List<Report> findAllByOrderByIdDesc();
}