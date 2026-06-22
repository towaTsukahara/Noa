package noa.repository;

import noa.entity.ViewLog;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ViewLogRepository extends JpaRepository<ViewLog, Long> {
    // 記録するだけなので、今は保存(save)のみ。集計用クエリはフェーズ2で追加。
}