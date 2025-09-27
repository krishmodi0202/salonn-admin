# Barber Shop Admin Panel

A comprehensive admin panel for managing barber shop bookings with real-time analytics and booking management capabilities.

## 🚀 Features

### Dashboard Overview
- **Real-time Metrics**: Total bookings, today's bookings, revenue, pending/confirmed/cancelled counts
- **System Health**: Backend connection status monitoring
- **Auto-refresh**: Data updates every 30 seconds

### Analytics & Charts
- **Daily Revenue Trend**: Area chart showing revenue over time
- **Service Popularity**: Pie chart of most booked services
- **Stylist Workload**: Bar chart showing bookings per stylist
- **Peak Hours**: Line chart showing busiest booking times

### Booking Management
- **Comprehensive Table**: Sortable columns with search and filtering
- **Status Management**: Quick approve/cancel pending bookings
- **Detailed View**: Full booking information modal
- **Customer Actions**: Direct call, email, and WhatsApp links
- **Bulk Operations**: Export to CSV functionality

### Search & Filter Options
- **Search**: By customer name, phone, email, or booking ID
- **Filters**: Status, service type, stylist, date range
- **Sorting**: All columns with ascending/descending order
- **Pagination**: Efficient handling of large booking lists

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- Your barber shop backend running on `http://localhost:5000`

### Installation

1. **Install Dependencies**
   ```bash
   npm install
   
   # Install Tailwind CSS for styling
   npm install -D tailwindcss postcss autoprefixer
   ```

2. **Configure Backend URL**
   - Update `src/services/api.js` if your backend runs on a different port
   - Default: `http://localhost:5000`

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Access Admin Panel**
   - Open `http://localhost:3000` in your browser
   - The admin panel will automatically connect to your backend

## 📊 API Endpoints Used

The admin panel connects to these backend endpoints:

- `GET /api/bookings` - Fetch all bookings
- `GET /api/bookings/:id` - Get single booking details
- `PUT /api/bookings/:id` - Update booking (status, price, notes)
- `DELETE /api/bookings/:id` - Delete booking
- `GET /api/bookings/availability/:date` - Check daily availability
- `GET /health` - System health check

## 🎯 Key Components

### MetricsCards
- Displays key performance indicators
- Real-time system status
- Color-coded metrics with icons

### AnalyticsCharts
- Interactive charts using Recharts library
- Revenue trends and service analytics
- Responsive design for all screen sizes

### BookingsTable
- Advanced table with sorting and filtering
- Inline status updates
- Pagination for performance
- Quick action buttons

### BookingDetailModal
- Complete booking information
- Edit booking details
- Customer contact actions
- Status management

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:
```
REACT_APP_API_URL=http://localhost:5000
REACT_APP_REFRESH_INTERVAL=30000
```

### Customization
- **Colors**: Update `tailwind.config.js` for brand colors
- **Refresh Rate**: Modify auto-refresh interval in `AdminDashboard.js`
- **Table Pagination**: Adjust `itemsPerPage` in `BookingsTable.js`

## 📱 Responsive Design

The admin panel is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile phones

## 🚨 Error Handling

- **Connection Errors**: Graceful fallback with retry options
- **Loading States**: Smooth loading indicators
- **Data Validation**: Input validation and error messages
- **Offline Support**: Cached data when backend is unavailable

## 📈 Performance Features

- **Lazy Loading**: Components load on demand
- **Data Caching**: Reduces API calls
- **Optimized Rendering**: React best practices
- **Efficient Filtering**: Client-side search and sort

## 🔒 Security Considerations

- **Input Sanitization**: All user inputs are validated
- **API Error Handling**: Secure error messages
- **CORS Configuration**: Proper cross-origin setup
- **Data Privacy**: No sensitive data in logs

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Intuitive Navigation**: Easy-to-use controls
- **Visual Feedback**: Loading states and success messages
- **Accessibility**: Keyboard navigation and screen reader support

## 📞 Support

For issues or questions:
1. Check the browser console for error messages
2. Verify backend is running on the correct port
3. Ensure all API endpoints are accessible
4. Check network connectivity

## 🔄 Updates

The admin panel automatically:
- Refreshes data every 30 seconds
- Shows real-time system status
- Updates metrics without page reload
- Maintains user's current view state

---

**Built with React, Recharts, Lucide Icons, and Tailwind CSS**
