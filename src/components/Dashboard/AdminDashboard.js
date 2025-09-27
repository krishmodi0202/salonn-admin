import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Plus } from 'lucide-react';
import MetricsCards from './MetricsCards';
import AnalyticsCharts from './AnalyticsCharts';
import BookingsTable from '../Bookings/BookingsTable';
import BookingDetailModal from '../Bookings/BookingDetailModal';
import ApiService from '../../services/api';

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    bookings: [],
    health: null,
    metrics: {
      totalBookings: 0,
      todayBookings: 0,
      totalRevenue: 0,
      pendingCount: 0,
      confirmedCount: 0,
      cancelledCount: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ApiService.getAdminDashboardData();
      setDashboardData(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError('Failed to fetch dashboard data. Please check your backend connection.');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  // Handle booking updates
  const handleUpdateBooking = async (bookingId, updateData) => {
    try {
      await ApiService.updateBooking(bookingId, updateData);
      await fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Failed to update booking:', error);
      throw error;
    }
  };

  // Handle booking deletion
  const handleDeleteBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await ApiService.deleteBooking(bookingId);
        await fetchDashboardData(); // Refresh data
      } catch (error) {
        console.error('Failed to delete booking:', error);
        alert('Failed to delete booking. Please try again.');
      }
    }
  };

  // Handle view booking
  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  // Export data to CSV
  const handleExportData = () => {
    const csvData = dashboardData.bookings.map(booking => ({
      'Booking ID': booking.bookingId,
      'Customer Name': booking.customer?.name,
      'Phone': booking.customer?.phone,
      'Email': booking.customer?.email,
      'Date': booking.date,
      'Time': booking.time,
      'Service': booking.service,
      'Stylist': booking.stylist,
      'Status': booking.status,
      'Price': booking.price,
      'Notes': booking.notes || '',
      'Created At': booking.createdAt
    }));

    const csvContent = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading && dashboardData.bookings.length === 0) {
    return (
      <div className="admin-container">
        <div className="loading-container" style={{minHeight: '100vh'}}>
          <div className="loading-spinner"></div>
          <p className="loading-text">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error && dashboardData.bookings.length === 0) {
    return (
      <div className="admin-container">
        <div className="error-container" style={{minHeight: '100vh'}}>
          <div className="error-banner">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="btn btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div>
            <h1 className="admin-title">Barber Shop Admin</h1>
            <p className="admin-subtitle">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          <div className="header-actions">
            <button
              onClick={handleExportData}
              className="btn btn-secondary"
            >
              <Download className="w-4 h-4" />
              Export CSV
            </button>
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="btn btn-primary"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'loading-spinner' : ''}`} style={{width: '1rem', height: '1rem'}} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        {/* Error Banner */}
        {error && (
          <div className="warning-banner">
            <h3>Warning</h3>
            <p>{error}</p>
          </div>
        )}

        {/* Metrics Cards */}
        <MetricsCards metrics={dashboardData.metrics} health={dashboardData.health} />

        {/* Analytics Charts */}
        <AnalyticsCharts bookings={dashboardData.bookings} />

        {/* Bookings Table */}
        <BookingsTable
          bookings={dashboardData.bookings}
          onUpdateBooking={handleUpdateBooking}
          onDeleteBooking={handleDeleteBooking}
          onViewBooking={handleViewBooking}
        />

        {/* Booking Detail Modal */}
        <BookingDetailModal
          booking={selectedBooking}
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedBooking(null);
          }}
          onUpdateBooking={handleUpdateBooking}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
