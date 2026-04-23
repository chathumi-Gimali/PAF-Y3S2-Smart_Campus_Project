package com.smartcampus.service;

import com.smartcampus.dto.BookingRequest;
import com.smartcampus.model.Booking;
import com.smartcampus.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

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
        return bookingRepository.save(booking);
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
        return bookingRepository.save(booking);
    }

    public Booking rejectBooking(String id, String reason) {
        Booking booking = getBookingById(id);
        if (!booking.getStatus().equals("PENDING"))
            throw new RuntimeException("Only PENDING bookings can be rejected");
        booking.setStatus("REJECTED");
        booking.setRejectionReason(reason);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(String id, String userId) {
        Booking booking = getBookingById(id);
        if (!booking.getUserId().equals(userId))
            throw new RuntimeException("You can only cancel your own bookings");
        if (!booking.getStatus().equals("APPROVED"))
            throw new RuntimeException("Only APPROVED bookings can be cancelled");
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public void deleteBooking(String id) {
        bookingRepository.deleteById(id);
    }
}