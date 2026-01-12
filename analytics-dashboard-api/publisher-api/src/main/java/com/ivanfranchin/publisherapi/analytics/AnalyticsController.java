package com.bit.publisherapi.analytics;

import com.bit.publisherapi.analytics.dto.AnalyticsStats;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequiredArgsConstructor
@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @Operation(description = "Get real-time analytics statistics including throughput, event counts, and category distribution. Results are cached in Redis for 30 seconds.")
    @GetMapping("/stats")
    public ResponseEntity<AnalyticsStats> getAnalyticsStats() {
        AnalyticsStats stats = analyticsService.getAnalyticsStats();
        return ResponseEntity.ok(stats);
    }
}
