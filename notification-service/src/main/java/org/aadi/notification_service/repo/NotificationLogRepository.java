package org.aadi.notification_service.repo;

import org.aadi.notification_service.domain.NotificationLog;
import org.aadi.notification_service.domain.NotificationType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface NotificationLogRepository extends JpaRepository<NotificationLog, UUID> {

    boolean existsByOrderIdAndType(UUID orderId, NotificationType type);
}
