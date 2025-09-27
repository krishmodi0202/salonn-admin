import React, { useState } from 'react';
import { X, Calendar, Clock, User, Phone, Mail, MessageSquare, DollarSign, Scissors } from 'lucide-react';
import { formatDate, formatTime, getStatusColor } from '../../utils/dataUtils';

const BookingDetailModal = ({ booking, isOpen, onClose, onUpdateBooking }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: booking?.status || '',
    price: booking?.price || '',
    notes: booking?.notes || ''
  });

  if (!isOpen || !booking) return null;

  const handleSave = async () => {
    try {
      await onUpdateBooking(booking._id, editData);
      setIsEditing(false);
      onClose();
    } catch (error) {
      console.error('Failed to update booking:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      status: booking.status || '',
      price: booking.price || '',
      notes: booking.notes || ''
    });
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">Booking Details</h2>
          <button
            onClick={onClose}
            className="modal-close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="modal-body">
          {/* Booking ID and Status */}
          <div className="modal-section">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">#{booking.bookingId}</h3>
                <p className="text-sm" style={{color: '#6b7280'}}>
                  Created on {formatDate(booking.createdAt)}
                </p>
              </div>
              <div>
                {isEditing ? (
                  <select
                    value={editData.status}
                    onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    className="filter-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                ) : (
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div className="modal-section">
            <div className="section-content">
              <div className="section-header">
                <User className="w-4 h-4" />
                <h4 className="section-title">Customer Information</h4>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <p>{booking.customer?.name}</p>
                </div>
                <div className="info-item">
                  <label className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Phone
                  </label>
                  <p>{booking.customer?.phone}</p>
                </div>
                <div className="info-item">
                  <label className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Email
                  </label>
                  <p>{booking.customer?.email}</p>
                </div>
                <div className="info-item">
                  <label className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    WhatsApp
                  </label>
                  <p>{booking.customer?.whatsapp}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="modal-section">
            <div className="section-content" style={{backgroundColor: '#eff6ff'}}>
              <div className="section-header">
                <Calendar className="w-4 h-4" />
                <h4 className="section-title">Appointment Details</h4>
              </div>
              <div className="info-grid">
                <div className="info-item">
                  <label>Date</label>
                  <p>{formatDate(booking.date)}</p>
                </div>
                <div className="info-item">
                  <label className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Time
                  </label>
                  <p>{formatTime(booking.time)}</p>
                </div>
                <div className="info-item">
                  <label className="flex items-center gap-1">
                    <Scissors className="w-3 h-3" />
                    Service
                  </label>
                  <p>
                    {booking.service?.charAt(0).toUpperCase() + booking.service?.slice(1).replace('-', ' ')}
                  </p>
                </div>
                <div className="info-item">
                  <label>Stylist</label>
                  <p>
                    {booking.stylist?.charAt(0).toUpperCase() + booking.stylist?.slice(1)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Price and Notes */}
          <div className="modal-section">
            <div className="info-grid">
              <div className="info-item">
                <label className="flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Price
                </label>
                {isEditing ? (
                  <input
                    type="number"
                    value={editData.price}
                    onChange={(e) => setEditData({ ...editData, price: e.target.value })}
                  />
                ) : (
                  <p className="text-lg font-semibold" style={{color: '#10b981'}}>${booking.price}</p>
                )}
              </div>
              <div className="info-item">
                <label>Notes</label>
                {isEditing ? (
                  <textarea
                    value={editData.notes}
                    onChange={(e) => setEditData({ ...editData, notes: e.target.value })}
                    rows={3}
                    placeholder="Add notes..."
                  />
                ) : (
                  <p style={{backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.25rem'}}>
                    {booking.notes || 'No notes added'}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="modal-section">
            <div className="section-content" style={{backgroundColor: '#fffbeb'}}>
              <h4 className="section-title mb-3">Quick Actions</h4>
              <div className="quick-actions">
                <a
                  href={`tel:${booking.customer?.phone}`}
                  className="quick-action"
                >
                  <Phone className="w-4 h-4" />
                  Call Customer
                </a>
                <a
                  href={`mailto:${booking.customer?.email}`}
                  className="quick-action"
                >
                  <Mail className="w-4 h-4" />
                  Send Email
                </a>
                <a
                  href={`https://wa.me/${booking.customer?.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-action"
                >
                  <MessageSquare className="w-4 h-4" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <div className="text-sm" style={{color: '#6b7280'}}>
            Last updated: {formatDate(booking.updatedAt)}
          </div>
          <div className="flex items-center gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="btn btn-primary"
                >
                  Save Changes
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary"
              >
                Edit Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailModal;
