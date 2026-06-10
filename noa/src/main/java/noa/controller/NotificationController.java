package noa.controller;

import noa.dto.NotificationResponse;
import noa.security.CustomUserDetails;
import noa.service.NotificationService;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping("/me/notifications")
    public List<NotificationResponse> list(@AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        return notificationService.getMyNotifications(principal.getUser());
    }

    @GetMapping("/me/notifications/unread-count")
    public Map<String, Long> unreadCount(@AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        return Map.of("count", notificationService.getUnreadCount(principal.getUser()));
    }

    @PostMapping("/me/notifications/read")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void readAll(@AuthenticationPrincipal CustomUserDetails principal) {
        requireLogin(principal);
        notificationService.markAllRead(principal.getUser());
    }

    private void requireLogin(CustomUserDetails principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "ログインが必要です");
        }
    }
}