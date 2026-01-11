package com.bit.newsclient.news.client;

import com.bit.newsclient.news.dto.MyPage;
import com.bit.newsclient.news.dto.News;
import com.bit.newsclient.news.dto.SearchRequest;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient("publisher-api")
public interface PublisherApiClient {

    @GetMapping("/api/news")
    MyPage<News> listNewsByPage(@RequestParam Integer page, @RequestParam Integer size,
                                @RequestParam String sort);

    @PutMapping("/api/news/search")
    MyPage<News> searchNewsByPage(@RequestBody SearchRequest searchRequest, @RequestParam Integer page,
                                  @RequestParam Integer size, @RequestParam String sort);
}
