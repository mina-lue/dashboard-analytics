package com.ivanfranchin.publisherapi.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsStats {
    private Long totalEvents;
    private Long eventsLastHour;
    private Long uniqueCategories;
    private Map<String, Long> categoryDistribution;
    private Double ingestionThroughput; // events per hour
    private Long totalEventsInLast24Hours;
}
