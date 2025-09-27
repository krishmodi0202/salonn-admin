import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Calendar,
  Phone,
  Mail,
  User
} from 'lucide-react';
import { formatDate, formatTime, getStatusColor, searchBookings } from '../../utils/dataUtils';

const BookingsTable = ({ bookings, onUpdateBooking, onDeleteBooking, onViewBooking }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [stylistFilter, setStylistFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Get unique values for filters
  const uniqueServices = [...new Set(bookings.map(b => b.service))];
  const uniqueStylists = [...new Set(bookings.map(b => b.stylist))];

  // Filter and sort bookings
  const filteredBookings = useMemo(() => {
    let filtered = searchBookings(bookings, searchTerm);

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(b => b.service === serviceFilter);
    }
    if (stylistFilter !== 'all') {
      filtered = filtered.filter(b => b.stylist === stylistFilter);
    }

    // Sort bookings
    filtered.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      if (sortField === 'customer') {
        aValue = a.customer?.name || '';
        bValue = b.customer?.name || '';
      }

      if (sortField === 'date' || sortField === 'createdAt') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [bookings, searchTerm, statusFilter, serviceFilter, stylistFilter, sortField, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBookings = filteredBookings.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await onUpdateBooking(bookingId, { status: newStatus });
    } catch (error) {
      console.error('Failed to update booking status:', error);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortField !== field) return <ChevronUp className="w-4 h-4 opacity-30" />;
    return sortDirection === 'asc' ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  return (
    <div className="table-container">
      <div className="table-header">
        <div className="table-controls">
          <h2 className="card-title">Bookings Management</h2>
          
          {/* Search and Filters */}
          <div className="table-controls-row">
            {/* Search */}
            <div className="search-input">
              <Search className="search-icon w-4 h-4" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>

            {/* Service Filter */}
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Services</option>
              {uniqueServices.map(service => (
                <option key={service} value={service}>
                  {service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' ')}
                </option>
              ))}
            </select>

            {/* Stylist Filter */}
            <select
              value={stylistFilter}
              onChange={(e) => setStylistFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Stylists</option>
              {uniqueStylists.map(stylist => (
                <option key={stylist} value={stylist}>
                  {stylist.charAt(0).toUpperCase() + stylist.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={{overflowX: 'auto'}}>
        <table className="data-table">
          <thead>
            <tr>
              <th
                onClick={() => handleSort('bookingId')}
              >
                <div className="sort-header">
                  <span>Booking ID</span>
                  <SortIcon field="bookingId" />
                </div>
              </th>
              <th onClick={() => handleSort('customer')}>
                <div className="sort-header">
                  <span>Customer</span>
                  <SortIcon field="customer" />
                </div>
              </th>
              <th onClick={() => handleSort('date')}>
                <div className="sort-header">
                  <span>Date & Time</span>
                  <SortIcon field="date" />
                </div>
              </th>
              <th onClick={() => handleSort('service')}>
                <div className="sort-header">
                  <span>Service</span>
                  <SortIcon field="service" />
                </div>
              </th>
              <th onClick={() => handleSort('stylist')}>
                <div className="sort-header">
                  <span>Stylist</span>
                  <SortIcon field="stylist" />
                </div>
              </th>
              <th onClick={() => handleSort('status')}>
                <div className="sort-header">
                  <span>Status</span>
                  <SortIcon field="status" />
                </div>
              </th>
              <th onClick={() => handleSort('price')}>
                <div className="sort-header">
                  <span>Price</span>
                  <SortIcon field="price" />
                </div>
              </th>
              <th>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedBookings.map((booking) => (
              <tr key={booking._id}>
                <td className="font-medium">
                  {booking.bookingId}
                </td>
                <td>
                  <div className="customer-info">
                    <div className="customer-avatar">
                      <User className="w-5 h-5" />
                    </div>
                    <div className="customer-details">
                      <h4>{booking.customer?.name}</h4>
                      <p>
                        <Phone className="w-3 h-3" />
                        <span>{booking.customer?.phone}</span>
                      </p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(booking.date)}</span>
                  </div>
                  <div className="text-sm" style={{color: '#6b7280'}}>
                    {formatTime(booking.time)}
                  </div>
                </td>
                <td>
                  {booking.service?.charAt(0).toUpperCase() + booking.service?.slice(1).replace('-', ' ')}
                </td>
                <td>
                  {booking.stylist?.charAt(0).toUpperCase() + booking.stylist?.slice(1)}
                </td>
                <td>
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                </td>
                <td>
                  ${booking.price}
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      onClick={() => onViewBooking(booking)}
                      className="action-btn view"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'confirmed')}
                          className="action-btn confirm"
                          title="Confirm Booking"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(booking._id, 'cancelled')}
                          className="action-btn cancel"
                          title="Cancel Booking"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    <button
                      onClick={() => onDeleteBooking(booking._id)}
                      className="action-btn delete"
                      title="Delete Booking"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <div className="pagination-info">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredBookings.length)} of {filteredBookings.length} results
          </div>
          <div className="pagination-controls">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingsTable;
