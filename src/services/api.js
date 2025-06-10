import axios from "axios";

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Clear invalid token
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Redirect to login page
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getCurrentUser: () => api.get("/auth/me"),
};

export const courtAPI = {
  getAllCourts: () => api.get("/courts"),
  getCourtById: (id) => api.get(`/courts/${id}`),
  getAvailableCourts: () => api.get("/courts/available"),
  getCourtsByOwner: (ownerId) => api.get(`/courts/owner/${ownerId}`),
  getCourtsByMaxPrice: (maxPrice) =>
    api.get("/courts/search", { params: { maxPrice } }),

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

    return api.get("/courts/filter", { params });
  },

  createCourt: (data) => api.post("/courts", data),
  updateCourt: (id, data) => api.put(`/courts/${id}`, data),
  deleteCourt: (id) => api.delete(`/courts/${id}`),
  getOwnerRevenue: (ownerId) => api.get(`/courts/owner/${ownerId}/revenue`),
  getMonthlyRevenueByCourt: (courtId) => api.get(`/courts/${courtId}/monthly-revenue`),
  getTopCustomersByOwner: (ownerId) => api.get(`/courts/owner/${ownerId}/top-customers`),
};

export const bookingAPI = {
  getAllBookings: () => api.get("/bookings"),
  getBooking: (id) => api.get(`/bookings/${id}`),
  getUserBookings: () => api.get("/bookings/user"),
  createBooking: (data) => api.post("/bookings", data),
  updateBookingStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, null, { params: { status } }),
  updatePaymentStatus: (id, paymentStatus) =>
    api.put(`/bookings/${id}/payment-status`, null, {
      params: { paymentStatus },
    }),
  deleteBooking: (id) => api.delete(`/bookings/${id}`),
  getBookedSlots: (courtId, date) =>
    api.get(`/bookings/slots`, { params: { courtId, date } }),
  getOwnerBookings: (ownerId) => api.get(`/bookings/owner/${ownerId}`),
};

export const paymentAPI = {
  createPaymentIntent: (bookingId) =>
    api.post(`/payments/create-payment-intent/${bookingId}`),
  confirmPayment: (paymentIntentId) =>
    api.post(`/payments/confirm/${paymentIntentId}`),
  refundPayment: (paymentIntentId) =>
    api.post(`/payments/refund/${paymentIntentId}`),
  createCheckoutSession: (data) =>
    api.post("/payments/create-checkout-session", data),
};

export const adminAPI = {
  getAllUsers: () => api.get("/admin/users"),
  getUsersByRole: (role) => api.get(`/admin/users/role/${role}`),
  updateUserStatus: (userId, status) => api.put(`/admin/users/${userId}/status`, null, { params: { status } }),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, null, { params: { role } }),
};

export default api;
