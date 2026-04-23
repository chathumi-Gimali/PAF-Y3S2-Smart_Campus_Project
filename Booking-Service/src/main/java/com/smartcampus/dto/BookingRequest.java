package com.smartcampus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BookingRequest {
    @NotBlank(message = "Resource ID is required")
    private String resourceId;
    @NotBlank(message = "Purpose is required")
    private String purpose;
    private int expectedAttendees;
    @NotNull(message = "Start time is required")
    private LocalDateTime startTime;
    @NotNull(message = "End time is required")
    private LocalDateTime endTime;
}