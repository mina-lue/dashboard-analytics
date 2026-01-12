package com.bit.producerapi.news;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Slf4j
@RequiredArgsConstructor
@Service
public class DataGeneratorService {

    private final NewsEventEmitter newsEventEmitter;
    private final Random random = new Random();

    private final List<String> categories = List.of("Technology", "Sports", "Finance", "Health", "Entertainment");
    private final List<String> titles = List.of(
            "New breakthrough in AI research",
            "Local team wins championship",
            "Stock market reaches all-time high",
            "New study on the benefits of sleep",
            "Hollywood star announces new project",
            "SpaceX launches new satellite",
            "Green energy initiative launched",
            "Cybersecurity threats on the rise",
            "Olympic games set to begin",
            "Innovative tech gadget unveiled"
    );

    @Scheduled(fixedRate = 5000) // Generate news every 5 seconds
    public void generateNews() {
        String title = titles.get(random.nextInt(titles.size()));
        String category = categories.get(random.nextInt(categories.size()));
        String text = "This is a generated news article about " + title.toLowerCase() + " in the " + category.toLowerCase() + " sector.";
        
        News news = new News(
                UUID.randomUUID().toString(),
                title + " [" + category + "]",
                text,
                Instant.now().toString()
        );

        log.info("Generating realistic news: {}", news.title());
        newsEventEmitter.newsCreated(news);
    }
}
