package com.smartcampus.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {
    @Id
    private String id;
    private String userId;
    private String resourceId;
    private String purpose;
    private int expectedAttendees;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status = "PENDING";
    private String rejectionReason;
    private LocalDateTime createdAt = LocalDateTime.now();
}