import { format, parseISO, isToday, startOfWeek, endOfWeek } from 'date-fns';

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
};

export const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  try {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return format(date, 'h:mm a');
  } catch {
    return timeString;
  }
};

export const getServiceStats = (bookings) => {
  const serviceCount = bookings.reduce((acc, booking) => {
    const service = booking.service || 'Unknown';
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(serviceCount).map(([service, count]) => ({
    name: service.charAt(0).toUpperCase() + service.slice(1).replace('-', ' '),
    value: count
  }));
};

export const getStylistStats = (bookings) => {
  const stylistCount = bookings.reduce((acc, booking) => {
    const stylist = booking.stylist || 'Any';
    acc[stylist] = (acc[stylist] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(stylistCount).map(([stylist, count]) => ({
    name: stylist.charAt(0).toUpperCase() + stylist.slice(1),
    bookings: count
  }));
};

export const getHourlyStats = (bookings) => {
  const hourlyCount = bookings.reduce((acc, booking) => {
    const hour = booking.time ? booking.time.split(':')[0] : '00';
    const hourLabel = `${hour}:00`;
    acc[hourLabel] = (acc[hourLabel] || 0) + 1;
    return acc;
  }, {});

  // Fill in missing hours for better visualization
  const hours = [];
  for (let i = 9; i <= 18; i++) {
    const hourLabel = `${i.toString().padStart(2, '0')}:00`;
    hours.push({
      time: hourLabel,
      bookings: hourlyCount[hourLabel] || 0
    });
  }

  return hours;
};

export const getDailyRevenueStats = (bookings) => {
  const dailyRevenue = bookings.reduce((acc, booking) => {
    const date = booking.date;
    acc[date] = (acc[date] || 0) + (booking.price || 0);
    return acc;
  }, {});

  return Object.entries(dailyRevenue)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, revenue]) => ({
      date: formatDate(date),
      revenue
    }));
};

export const filterBookingsByDateRange = (bookings, startDate, endDate) => {
  return bookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    return bookingDate >= startDate && bookingDate <= endDate;
  });
};

export const searchBookings = (bookings, searchTerm) => {
  if (!searchTerm) return bookings;
  
  const term = searchTerm.toLowerCase();
  return bookings.filter(booking => 
    booking.customer?.name?.toLowerCase().includes(term) ||
    booking.customer?.phone?.includes(term) ||
    booking.customer?.email?.toLowerCase().includes(term) ||
    booking.bookingId?.toLowerCase().includes(term) ||
    booking.service?.toLowerCase().includes(term) ||
    booking.stylist?.toLowerCase().includes(term)
  );
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getTodayBookings = (bookings) => {
  return bookings.filter(booking => isToday(parseISO(booking.date)));
};

export const getThisWeekBookings = (bookings) => {
  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);
  
  return bookings.filter(booking => {
    const bookingDate = parseISO(booking.date);
    return bookingDate >= weekStart && bookingDate <= weekEnd;
  });
};
