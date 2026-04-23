package com.smartcampus.repository;

import com.smartcampus.model.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends MongoRepository<Booking, String> {
    List<Booking> findByUserId(String userId);
    List<Booking> findByResourceId(String resourceId);
    List<Booking> findByResourceIdAndStatusNotAndStartTimeLessThanAndEndTimeGreaterThan(
        String resourceId, String status,
        LocalDateTime endTime, LocalDateTime startTime
    );
}