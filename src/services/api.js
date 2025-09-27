const API_BASE_URL = 'http://localhost:5000';

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Bookings APIs
  async getAllBookings() {
    return this.request('/api/bookings');
  }

  async getBookingById(id) {
    return this.request(`/api/bookings/${id}`);
  }

  async updateBooking(id, data) {
    return this.request(`/api/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteBooking(id) {
    return this.request(`/api/bookings/${id}`, {
      method: 'DELETE',
    });
  }

  async getAvailability(date) {
    return this.request(`/api/bookings/availability/${date}`);
  }

  // System health
  async getSystemHealth() {
    return this.request('/health');
  }

  // Analytics helper methods
  async getAdminDashboardData() {
    try {
      const [bookingsResponse, healthResponse] = await Promise.all([
        this.getAllBookings(),
        this.getSystemHealth()
      ]);

      const bookings = bookingsResponse.data || [];
      const health = healthResponse;

      // Calculate metrics
      const today = new Date().toISOString().split('T')[0];
      const todayBookings = bookings.filter(b => b.date === today);
      const totalRevenue = bookings.reduce((sum, b) => sum + (b.price || 0), 0);
      const pendingCount = bookings.filter(b => b.status === 'pending').length;
      const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
      const cancelledCount = bookings.filter(b => b.status === 'cancelled').length;

      return {
        bookings,
        health,
        metrics: {
          totalBookings: bookings.length,
          todayBookings: todayBookings.length,
          totalRevenue,
          pendingCount,
          confirmedCount,
          cancelledCount
        }
      };
    } catch (error) {
      console.error('Failed to fetch admin dashboard data:', error);
      throw error;
    }
  }
}

export default new ApiService();
