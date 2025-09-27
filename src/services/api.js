// Get API base URL from environment variables with fallback
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';
const API_FALLBACK_URL = process.env.REACT_APP_API_FALLBACK_URL || 'https://salonn-backend.onrender.com';

class ApiService {
  async request(endpoint, options = {}) {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Try primary API URL first
    try {
      const primaryUrl = `${API_BASE_URL}${endpoint}`;
      console.log(`Attempting API request to: ${primaryUrl}`);
      
      const response = await fetch(primaryUrl, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (primaryError) {
      console.warn('Primary API failed, trying fallback:', primaryError.message);
      
      // Try fallback API URL if primary fails
      try {
        const fallbackUrl = `${API_FALLBACK_URL}${endpoint}`;
        console.log(`Attempting fallback API request to: ${fallbackUrl}`);
        
        const response = await fetch(fallbackUrl, config);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
      } catch (fallbackError) {
        console.error('Both primary and fallback API requests failed:', {
          primary: primaryError.message,
          fallback: fallbackError.message
        });
        throw new Error(`API request failed. Primary: ${primaryError.message}, Fallback: ${fallbackError.message}`);
      }
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
