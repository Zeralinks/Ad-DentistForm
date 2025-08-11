import React from "react";
import Card from "../Card";
import { leadsData, appointmentsData } from "../../data/leads";
import {
  Users,
  UserPlus,
  CheckCircle2,
  CalendarCheck2,
  LineChart,
  Mail,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Calendar,
  Send,
} from "lucide-react";

export default function DashboardOverview() {
  const today = new Date();
  const thisWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const lastWeek = new Date(today.getTime() - 14 * 24 * 60 * 60 * 1000);

  // Basic stats
  const stats = {
    totalLeads: leadsData.length,
    newLeads: leadsData.filter((lead) => lead.status === "new").length,
    qualifiedLeads: leadsData.filter((lead) => lead.qualification === "qualified").length,
    bookedAppointments: appointmentsData.filter((apt) => apt.status === "confirmed").length,
  };

  // Performance metrics
  const thisWeekLeads = leadsData.filter((lead) => new Date(lead.createdAt) >= thisWeek).length;
  const lastWeekLeads = leadsData.filter(
    (lead) => new Date(lead.createdAt) >= lastWeek && new Date(lead.createdAt) < thisWeek
  ).length;

  const weeklyGrowth = lastWeekLeads > 0 ? ((thisWeekLeads - lastWeekLeads) / lastWeekLeads) * 100 : 0;
  const conversionRate = stats.totalLeads > 0 ? (stats.bookedAppointments / stats.totalLeads) * 100 : 0;
  const pendingFollowUps = leadsData.filter((lead) => lead.status === "follow-up").length;

  const mainStatCards = [
    { title: "Total Leads", value: stats.totalLeads, icon: <Users size={18} />, color: "blue" },
    { title: "New Leads", value: stats.newLeads, icon: <UserPlus size={18} />, color: "green" },
    { title: "Qualified Leads", value: stats.qualifiedLeads, icon: <CheckCircle2 size={18} />, color: "purple" },
    { title: "Booked Appointments", value: stats.bookedAppointments, icon: <CalendarCheck2 size={18} />, color: "orange" },
  ];

  const performanceMetrics = [
    {
      title: "Conversion Rate",
      value: `${conversionRate.toFixed(1)}%`,
      icon: <LineChart size={18} />,
      trend: conversionRate > 15 ? "up" : "down",
    },
    {
      title: "Pending Follow-ups",
      value: pendingFollowUps,
      icon: <Mail size={18} />,
      trend: pendingFollowUps < 5 ? "up" : "down",
    },
    {
      title: "Weekly Growth",
      value: `${weeklyGrowth > 0 ? "+" : ""}${weeklyGrowth.toFixed(1)}%`,
      icon: <TrendingUp size={18} />,
      trend: weeklyGrowth > 0 ? "up" : "down",
    },
  ];

  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    green: "bg-green-50 text-green-600 border-green-100",
    orange: "bg-orange-50 text-orange-600 border-orange-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
  };

  // Sample daily data for chart
  const dailyData = [
    { day: "Mon", leads: 5, appointments: 2 },
    { day: "Tue", leads: 8, appointments: 3 },
    { day: "Wed", leads: 6, appointments: 4 },
    { day: "Thu", leads: 12, appointments: 5 },
    { day: "Fri", leads: 9, appointments: 3 },
    { day: "Sat", leads: 4, appointments: 2 },
    { day: "Sun", leads: 3, appointments: 1 },
  ];

  const maxValue = Math.max(...dailyData.map((d) => Math.max(d.leads, d.appointments))) || 1;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 text-sm bg-blue-50 text-blue-600 rounded-lg cursor-pointer whitespace-nowrap">
            Today
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap">
            This Week
          </button>
          <button className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer whitespace-nowrap">
            This Month
          </button>
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {mainStatCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div
                className={`w-12 h-12 rounded-lg ${colorMap[stat.color] || ""} flex items-center justify-center border`}
              >
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {performanceMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  {metric.icon}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">{metric.title}</p>
                  <p className="text-xl font-bold text-gray-800">{metric.value}</p>
                </div>
              </div>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  metric.trend === "up" ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {metric.trend === "up" ? (
                  <ArrowUpRight size={14} className="text-green-600" />
                ) : (
                  <ArrowDownRight size={14} className="text-red-600" />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Performance (simple bars) */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Daily Performance</h3>
          <div className="h-64">
            <div className="flex items-end justify-between h-48 mb-4">
              {dailyData.map((data, index) => (
                <div key={index} className="flex flex-col items-center space-y-2 flex-1">
                  <div className="flex items-end space-x-1 h-32">
                    <div
                      className="bg-blue-500 rounded-t"
                      style={{
                        width: "8px",
                        height: `${(data.leads / maxValue) * 100}px`,
                        minHeight: "4px",
                      }}
                      title={`${data.leads} leads`}
                    />
                    <div
                      className="bg-green-500 rounded-t"
                      style={{
                        width: "8px",
                        height: `${(data.appointments / maxValue) * 100}px`,
                        minHeight: "4px",
                      }}
                      title={`${data.appointments} appointments`}
                    />
                  </div>
                  <span className="text-xs text-gray-600">{data.day}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center space-x-6">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2" />
                <span className="text-sm text-gray-600">Leads</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded mr-2" />
                <span className="text-sm text-gray-600">Appointments</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Weekly Trends */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Trends</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">Lead Generation</p>
                <p className="text-xs text-gray-600">This week vs last week</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-blue-600">{thisWeekLeads}</p>
                <p
                  className={`text-xs flex items-center ${
                    weeklyGrowth >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {weeklyGrowth >= 0 ? (
                    <ArrowUpRight size={14} className="mr-1" />
                  ) : (
                    <ArrowDownRight size={14} className="mr-1" />
                  )}
                  {Math.abs(weeklyGrowth).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">Qualification Rate</p>
                <p className="text-xs text-gray-600">Qualified / Total leads</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {stats.totalLeads > 0
                    ? ((stats.qualifiedLeads / stats.totalLeads) * 100).toFixed(1)
                    : "0.0"}
                  %
                </p>
                <p className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight size={14} className="mr-1" />
                  2.3%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-800">Booking Rate</p>
                <p className="text-xs text-gray-600">Bookings / Qualified leads</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-purple-600">
                  {stats.qualifiedLeads > 0
                    ? ((stats.bookedAppointments / stats.qualifiedLeads) * 100).toFixed(1)
                    : "0.0"}
                  %
                </p>
                <p className="text-xs text-purple-600 flex items-center">
                  <ArrowUpRight size={14} className="mr-1" />
                  1.8%
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Bottom cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3" />
              <span className="text-gray-600">New lead: Sarah Johnson</span>
              <span className="text-gray-400 ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-3" />
              <span className="text-gray-600">Appointment booked: David Wilson</span>
              <span className="text-gray-400 ml-auto">4 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <div className="w-2 h-2 bg-orange-500 rounded-full mr-3" />
              <span className="text-gray-600">Follow-up sent: Emily Rodriguez</span>
              <span className="text-gray-400 ml-auto">6 hours ago</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Lead Sources</h3>
          <div className="space-y-3">
            {[
              ["Google Ads", "35%"],
              ["Website", "28%"],
              ["Referrals", "22%"],
              ["Facebook", "15%"],
            ].map(([label, val]) => (
              <div key={label} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm font-semibold text-gray-800">{val}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center">
              <Plus size={16} className="mr-2" />
              Add New Lead
            </button>
            <button className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center">
              <Calendar size={16} className="mr-2" />
              Schedule Appointment
            </button>
            <button className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer whitespace-nowrap flex items-center justify-center">
              <Send size={16} className="mr-2" />
              Send Follow-up
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
