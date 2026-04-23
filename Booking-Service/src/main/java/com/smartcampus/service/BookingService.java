package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.model.Booking;
import com.smartcampus.repository.BookingRepository;
import com.smartcampus.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private NotificationService notificationService;

    public Booking createBooking(String userId, BookingRequest req) {
        List<Booking> conflicts = bookingRepository
            .findByResourceIdAndStatusNotAndStartTimeLessThanAndEndTimeGreaterThan(
                req.getResourceId(), "CANCELLED",
                req.getEndTime(), req.getStartTime()
            );
        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Resource is already booked for this time slot!");
        }
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setResourceId(req.getResourceId());
        booking.setPurpose(req.getPurpose());
        booking.setExpectedAttendees(req.getExpectedAttendees());
        booking.setStartTime(req.getStartTime());
        booking.setEndTime(req.getEndTime());

        Booking saved = bookingRepository.save(booking);

        // Notify user that booking was created
        notificationService.createNotification(
            userId,
            "Booking Submitted 📅",
            "Your booking for " + req.getResourceId() + " is pending approval.",
            "BOOKING_PENDING"
        );

        return saved;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public List<Booking> getMyBookings(String userId) {
        return bookingRepository.findByUserId(userId);
    }

    public Booking getBookingById(String id) {
        return bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));
    }

    public Booking approveBooking(String id) {
        Booking booking = getBookingById(id);
        if (!booking.getStatus().equals("PENDING"))
            throw new RuntimeException("Only PENDING bookings can be approved");
        booking.setStatus("APPROVED");
        Booking saved = bookingRepository.save(booking);

        // Notify user
        notificationService.createNotification(
            booking.getUserId(),
            "Booking Approved ✅",
            "Your booking for " + booking.getResourceId() + " has been approved!",
            "BOOKING_APPROVED"
        );

        return saved;
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = getBookingById(id);
        if (!booking.getStatus().equals("PENDING"))
            throw new RuntimeException("Only PENDING bookings can be rejected");
        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        Booking saved = bookingRepository.save(booking);

        // Notify user
        notificationService.createNotification(
            booking.getUserId(),
            "Booking Rejected ❌",
            "Your booking for " + booking.getResourceId() + " was rejected. Reason: " + reason,
            "BOOKING_REJECTED"
        );

        return saved;
    }

    public Booking cancelBooking(String id, String userId) {
        Booking booking = getBookingById(id);
        if (!booking.getUserId().equals(userId))
            throw new RuntimeException("You can only cancel your own bookings");
        if (!booking.getStatus().equals("APPROVED"))
            throw new RuntimeException("Only APPROVED bookings can be cancelled");
        booking.setStatus("CANCELLED");
        Booking saved = bookingRepository.save(booking);

        // Notify user
        notificationService.createNotification(
            userId,
            "Booking Cancelled 🚫",
            "Your booking for " + booking.getResourceId() + " has been cancelled.",
            "BOOKING_CANCELLED"
        );

        return saved;
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}