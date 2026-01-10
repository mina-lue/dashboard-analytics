package com.ivanfranchin.publisherapi.analytics;

import com.ivanfranchin.publisherapi.analytics.dto.AnalyticsStats;
import com.ivanfranchin.publisherapi.news.NewsRepository;
import com.ivanfranchin.publisherapi.news.model.News;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.elasticsearch.core.ElasticsearchOperations;
import org.springframework.data.elasticsearch.core.SearchHits;
import org.springframework.data.elasticsearch.core.query.Criteria;
import org.springframework.data.elasticsearch.core.query.CriteriaQuery;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RequiredArgsConstructor
@Service
public class AnalyticsService {

    private final NewsRepository newsRepository;
    private final ElasticsearchOperations elasticsearchOperations;

    @Cacheable(value = "analytics-stats", key = "'current'", unless = "#result == null")
    public AnalyticsStats getAnalyticsStats() {
        log.debug("Calculating analytics statistics from Elasticsearch");

        // Get total count
        long totalEvents = newsRepository.count();

        // Calculate time windows - use a simpler approach by fetching recent items and filtering
        Instant now = Instant.now();
        Instant oneHourAgo = now.minusSeconds(3600);
        Instant twentyFourHoursAgo = now.minusSeconds(86400);

        // For Elasticsearch query, we'll use range queries on datetime field
        // Elasticsearch stores dates in ISO format, so we format accordingly
        String oneHourAgoStr = oneHourAgo.toString(); // ISO-8601 format
        String twentyFourHoursAgoStr = twentyFourHoursAgo.toString();

        // Get events from last hour - use simpler approach: fetch recent items and filter
        long eventsLastHour = 0;
        long totalEventsInLast24Hours = 0;
        try {
            // Fetch up to 1000 most recent items to calculate time-based metrics
            Pageable samplePageable = PageRequest.of(0, 1000);
            List<News> sampleNews = newsRepository.findAll(samplePageable).getContent();
            
            eventsLastHour = sampleNews.stream()
                    .filter(news -> {
                        if (news.getDatetime() == null) return false;
                        try {
                            Instant newsTime = Instant.parse(news.getDatetime());
                            return newsTime.isAfter(oneHourAgo) && newsTime.isBefore(now);
                        } catch (Exception ex) {
                            log.debug("Error parsing datetime: {}", news.getDatetime());
                            return false;
                        }
                    })
                    .count();
            
            totalEventsInLast24Hours = sampleNews.stream()
                    .filter(news -> {
                        if (news.getDatetime() == null) return false;
                        try {
                            Instant newsTime = Instant.parse(news.getDatetime());
                            return newsTime.isAfter(twentyFourHoursAgo) && newsTime.isBefore(now);
                        } catch (Exception ex) {
                            log.debug("Error parsing datetime: {}", news.getDatetime());
                            return false;
                        }
                    })
                    .count();
            
            // If we got 1000 items and they're all recent, we might need to extrapolate
            if (sampleNews.size() == 1000 && totalEventsInLast24Hours == 1000) {
                // Likely hit page limit - use total count as estimate for 24h if all are recent
                News newestItem = sampleNews.get(0);
                if (newestItem.getDatetime() != null) {
                    try {
                        Instant newestTime = Instant.parse(newestItem.getDatetime());
                        if (newestTime.isAfter(twentyFourHoursAgo)) {
                            // All items are from last 24h, so use total count
                            totalEventsInLast24Hours = totalEvents;
                        }
                    } catch (Exception ignored) {}
                }
            }
        } catch (Exception e) {
            log.warn("Error calculating time-based metrics, using defaults: {}", e.getMessage());
            eventsLastHour = 0;
            totalEventsInLast24Hours = Math.min(totalEvents, 1000); // Estimate
        }

        // Calculate ingestion throughput (events per hour)
        // Based on events in last 24 hours, calculate average per hour
        double ingestionThroughput = totalEventsInLast24Hours > 0 
            ? (double) totalEventsInLast24Hours / 24.0 
            : (eventsLastHour > 0 ? eventsLastHour : 0.0);

        // Get category distribution
        // Fetch a reasonable sample to calculate categories (Elasticsearch aggregations would be better, but this works)
        Pageable pageable = PageRequest.of(0, 1000); // Get up to 1000 items for category analysis
        List<News> sampleNews = newsRepository.findAll(pageable).getContent();
        
        Map<String, Long> categoryDistribution = sampleNews.stream()
                .filter(news -> news.getCategory() != null && !news.getCategory().isEmpty())
                .collect(Collectors.groupingBy(
                        News::getCategory,
                        Collectors.counting()
                ));

        // Get unique categories count
        long uniqueCategories = categoryDistribution.keySet().size();

        log.debug("Analytics calculated - Total: {}, Last Hour: {}, Categories: {}, Throughput: {}/hour",
                totalEvents, eventsLastHour, uniqueCategories, ingestionThroughput);

        return new AnalyticsStats(
                totalEvents,
                eventsLastHour,
                uniqueCategories,
                categoryDistribution,
                Math.round(ingestionThroughput * 100.0) / 100.0, // Round to 2 decimal places
                totalEventsInLast24Hours
        );
    }
}
