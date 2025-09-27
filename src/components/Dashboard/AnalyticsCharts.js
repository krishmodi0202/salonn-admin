import React from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { getServiceStats, getStylistStats, getHourlyStats, getDailyRevenueStats } from '../../utils/dataUtils';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

const ChartCard = ({ title, children, className = '' }) => (
  <div className={`chart-card ${className}`}>
    <h3 className="chart-title">{title}</h3>
    {children}
  </div>
);

const AnalyticsCharts = ({ bookings }) => {
  const serviceStats = getServiceStats(bookings);
  const stylistStats = getStylistStats(bookings);
  const hourlyStats = getHourlyStats(bookings);
  const revenueStats = getDailyRevenueStats(bookings);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="card" style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="charts-grid mb-6">
      {/* Daily Revenue Trend */}
      <ChartCard title="Daily Revenue Trend" className="full-width">
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={revenueStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3B82F6"
              fill="#3B82F6"
              fillOpacity={0.3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Service Popularity */}
      <ChartCard title="Service Popularity">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={serviceStats}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {serviceStats.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Stylist Workload */}
      <ChartCard title="Stylist Workload">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={stylistStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="bookings" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Peak Hours */}
      <ChartCard title="Peak Hours" className="lg:col-span-2">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={hourlyStats}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="bookings"
              stroke="#F59E0B"
              strokeWidth={3}
              dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default AnalyticsCharts;
