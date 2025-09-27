import React from 'react';
import { Calendar, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../utils/dataUtils';

const MetricCard = ({ title, value, icon: Icon, colorClass }) => {
  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-info">
        <h3>{title}</h3>
        <p>{value}</p>
      </div>
      <div className={`metric-icon ${colorClass}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const MetricsCards = ({ metrics, health }) => {
  const cards = [
    {
      title: 'Total Bookings',
      value: metrics.totalBookings,
      icon: Calendar,
      colorClass: 'blue'
    },
    {
      title: "Today's Bookings",
      value: metrics.todayBookings,
      icon: Clock,
      colorClass: 'green'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      colorClass: 'yellow'
    },
    {
      title: 'Pending Bookings',
      value: metrics.pendingCount,
      icon: AlertCircle,
      colorClass: 'red'
    },
    {
      title: 'Confirmed Bookings',
      value: metrics.confirmedCount,
      icon: CheckCircle,
      colorClass: 'green'
    },
    {
      title: 'Cancelled Bookings',
      value: metrics.cancelledCount,
      icon: XCircle,
      colorClass: 'gray'
    }
  ];

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Dashboard Overview</h2>
        <div className="system-status">
          <div className={`status-dot ${health?.status === 'ok' ? 'online' : 'offline'}`}></div>
          <span className="status-text">
            System {health?.status === 'ok' ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>
      
      <div className="metrics-grid">
        {cards.map((card, index) => (
          <MetricCard key={index} {...card} />
        ))}
      </div>
    </div>
  );
};

export default MetricsCards;
