package noa.controller;

import noa.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.OffsetDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    // ResponseStatusException（Noaが意図的に投げるエラー）を統一形式に整える
    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatus(
            ResponseStatusException ex, HttpServletRequest req) {
        // ex.getReason() に、投げるときの第2引数（「すでに通報済みです」等）が入っている
        String message = (ex.getReason() != null) ? ex.getReason() : "エラーが発生しました";
        ErrorResponse body = new ErrorResponse(
                ex.getStatusCode().value(),
                message,
                req.getRequestURI(),
                OffsetDateTime.now());
        return ResponseEntity.status(ex.getStatusCode()).body(body);
    }

    // 想定外の例外（バグ等）。詳細はサーバーログにだけ出し、クライアントには汎用メッセージ
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(
            Exception ex, HttpServletRequest req) {
        // サーバー側のログには本当の原因を出す（開発者が気づける）
        ex.printStackTrace();
        ErrorResponse body = new ErrorResponse(
                500,
                "サーバーでエラーが発生しました",   // クライアントには内部情報を見せない
                req.getRequestURI(),
                OffsetDateTime.now());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }
}