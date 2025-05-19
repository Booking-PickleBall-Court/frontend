import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Court APIs
export const courtAPI = {
    getAllCourts: () => api.get('/courts'),
    getCourtById: (id) => api.get(`/courts/${id}`),
    getAvailableCourts: () => api.get('/courts/available'),
    getCourtsByOwner: (ownerId) => api.get(`/courts/owner/${ownerId}`),
    getCourtsByMaxPrice: (maxPrice) => api.get('/courts/search', { params: { maxPrice } }),

    // Search Courts With Filters
    searchCourts: ({
        minPrice,
        maxPrice,
        address,
        courtType,
        status,
        date,
        page = 0,
        size = 9,
    }) => {
        const params = {
            page,
            size,
        };

        // Only add non-empty parameters
        if (minPrice) params.minPrice = minPrice;
        if (maxPrice) params.maxPrice = maxPrice;
        if (address) params.address = address;
        if (courtType) params.courtType = courtType;
        if (status) params.status = status;
        if (date) params.date = date;

        return api.get('/courts/filter', { params });
    },

    createCourt: (data) => api.post('/courts', data),
    updateCourt: (id, data) => api.put(`/courts/${id}`, data),
    deleteCourt: (id) => api.delete(`/courts/${id}`),
};

// Court Slot APIs
export const courtSlotAPI = {
  getAllCourtSlots: () => api.get('/court-slots'),
  getCourtSlot: (id) => api.get(`/court-slots/${id}`),
  getCourtSlotsByCourt: (courtId) => api.get(`/court-slots/court/${courtId}`),
  getAvailableCourtSlots: () => api.get('/court-slots/available'),
  createCourtSlot: (data) => api.post('/court-slots', data),
  updateCourtSlot: (id, data) => api.put(`/court-slots/${id}`, data),
  deleteCourtSlot: (id) => api.delete(`/court-slots/${id}`),
  createRecurringCourtSlots: (data) => api.post('/court-slots/recurring', data),
};

// Booking APIs
export const bookingAPI = {
  getAllBookings: () => api.get('/bookings'),
  getBooking: (id) => api.get(`/bookings/${id}`),
  getUserBookings: () => api.get('/bookings/user'),
  getBookingsByCourtSlot: (courtSlotId) => api.get(`/bookings/court-slot/${courtSlotId}`),
  createBooking: (data) => api.post('/bookings', data),
  updateBookingStatus: (id, status) => api.put(`/bookings/${id}/status`, null, { params: { status } }),
  updatePaymentStatus: (id, paymentStatus) => api.put(`/bookings/${id}/payment-status`, null, { params: { paymentStatus } }),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  checkCourtSlotAvailability: (courtSlotId) => api.get(`/bookings/court-slot/${courtSlotId}/availability`),
};

// Payment APIs
export const paymentAPI = {
  createPaymentIntent: (bookingId) => api.post(`/payments/create-payment-intent/${bookingId}`),
  confirmPayment: (paymentIntentId) => api.post(`/payments/confirm/${paymentIntentId}`),
  refundPayment: (paymentIntentId) => api.post(`/payments/refund/${paymentIntentId}`),
  createCheckoutSession: (data) => api.post('/payments/create-checkout-session', data),
};

export default api; 