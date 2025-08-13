import React, { useMemo, useState } from "react";
import Card from "../Card";
import Button from "../Button";
import { appointmentsData as initialAppointments } from "../../data/leads";
import {
  Plus,
  Check,
  Edit3,
  X,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Plug,
} from "lucide-react";

const AppointmentsSection = () => {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [viewMode, setViewMode] = useState("list");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Form state for booking
  const [form, setForm] = useState({
    patientName: "",
    service: "Teeth Cleaning",
    date: selectedDate,
    time: "10:00",
    duration: "30 minutes",
    notes: "",
  });

  const getStatusColor = (status) => {
    const colors = {
      confirmed: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      cancelled: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const updateAppointmentStatus = (appointmentId, newStatus) => {
    setAppointments((prev) =>
      prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: newStatus } : apt))
    );
  };


  const todayStr = new Date().toISOString().split("T")[0];
  const todayAppointments = appointments.filter((apt) => apt.date === todayStr);

  // Calendar days
  const calendarDays = useMemo(() => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // back to Sunday

    const days = [];
    const cur = new Date(startDate);

    for (let i = 0; i < 42; i++) {
      const dateStr = cur.toISOString().split("T")[0];
      days.push({
        date: new Date(cur),
        dateStr,
        isCurrentMonth: cur.getMonth() === month,
        appointments: appointments.filter((apt) => apt.date === dateStr),
        isToday: dateStr === todayStr,
      });
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  }, [appointments, selectedDate, todayStr]);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
  ];
  const currentMonth = new Date(selectedDate);

  // New booking submit
  const submitBooking = (e) => {
    e.preventDefault();
    const nextId = (appointments.reduce((m, a) => Math.max(m, a.id), 0) || 0) + 1;

    const newApt = {
      id: nextId,
      leadId: null,
      patientName: form.patientName || "Unnamed",
      service: form.service,
      date: form.date,
      time: formatTimeDisplay(form.time), // store as "10:00 AM" style
      duration: form.duration,
      status: "pending",
      notes: form.notes,
    };

    setAppointments((prev) => [newApt, ...prev]);
    setShowBookingModal(false);
    setForm({
      patientName: "",
      service: "Teeth Cleaning",
      date: selectedDate,
      time: "10:00",
      duration: "30 minutes",
      notes: "",
    });
  };

  function formatTimeDisplay(time24) {
    // time24 = "14:30" -> "2:30 PM"
    if (!time24) return "10:00 AM";
    const [hh, mm] = time24.split(":").map(Number);
    const suffix = hh >= 12 ? "PM" : "AM";
    const hour12 = ((hh + 11) % 12) + 1;
    return `${hour12}:${String(mm).padStart(2, "0")} ${suffix}`;
    }

  // Sort appointments in list view by date then time
  const sortedAppointments = useMemo(() => {
    return [...appointments].sort((a, b) => {
      if (a.date < b.date) return -1;
      if (a.date > b.date) return 1;
      // naive time compare (assumes "10:00 AM" style)
      return (a.time || "").localeCompare(b.time || "");
    });
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Appointment Management</h2>
        <div className="flex items-center space-x-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded text-sm cursor-pointer whitespace-nowrap ${
                viewMode === "list" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              List View
            </button>
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1 rounded text-sm cursor-pointer whitespace-nowrap ${
                viewMode === "calendar" ? "bg-white shadow-sm" : "text-gray-600"
              }`}
            >
              Calendar View
            </button>
          </div>
          <Button onClick={() => setShowBookingModal(true)} className="flex items-center">
            <Plus size={16} className="mr-2" />
            Book Appointment
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main column */}
        <div className="lg:col-span-2">
          {viewMode === "list" ? (
            <Card>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Appointments</h3>
              <div className="space-y-4">
                {sortedAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{appointment.patientName}</h4>
                            <p className="text-sm text-gray-600">{appointment.service}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium text-gray-800">
                              {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                            </p>
                            <p className="text-sm text-gray-600">{appointment.duration}</p>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="text-sm text-gray-500 mt-2">{appointment.notes}</p>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 ml-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            appointment.status
                          )}`}
                        >
                          {appointment.status}
                        </span>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, "confirmed")}
                            className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                            title="Confirm"
                          >
                            <Check size={16} />
                          </button>
                          <button
                            className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                            title="Cancel"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {sortedAppointments.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-6">No appointments.</p>
                )}
              </div>
            </Card>
          ) : (
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Calendar View</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => {
                      const prev = new Date(selectedDate);
                      prev.setMonth(prev.getMonth() - 1);
                      setSelectedDate(prev.toISOString().split("T")[0]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    title="Previous month"
                  >
                    <ArrowLeft size={16} />
                  </button>
                  <h4 className="text-lg font-semibold text-gray-800 min-w-48 text-center">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </h4>
                  <button
                    onClick={() => {
                      const next = new Date(selectedDate);
                      next.setMonth(next.getMonth() + 1);
                      setSelectedDate(next.toISOString().split("T")[0]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded cursor-pointer"
                    title="Next month"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    className={`h-24 p-1 border border-gray-100 cursor-pointer hover:bg-gray-50 ${
                      !day.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""
                    } ${day.isToday ? "bg-blue-50 border-blue-200" : ""}`}
                  >
                    <div className="text-sm font-medium mb-1">{day.date.getDate()}</div>
                    <div className="space-y-1">
                      {day.appointments.slice(0, 2).map((apt, aptIndex) => (
                        <div
                          key={aptIndex}
                          className={`text-xs p-1 rounded truncate ${getStatusColor(apt.status)} cursor-pointer`}
                          title={`${apt.time} - ${apt.patientName} (${apt.service})`}
                        >
                          {apt.time} {apt.patientName}
                        </div>
                      ))}
                      {day.appointments.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{day.appointments.length - 2} more
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center space-x-4 text-xs">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-100 border border-green-200 rounded mr-2"></div>
                  <span>Confirmed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
                  <span>Pending</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-100 border border-red-200 rounded mr-2"></div>
                  <span>Cancelled</span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Today&apos;s Schedule</h3>
            <div className="space-y-3">
              {todayAppointments.length > 0 ? (
                todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">{apt.time}</p>
                      <p className="text-xs text-gray-600">{apt.patientName}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(apt.status)}`}>
                      {apt.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">No appointments today</p>
              )}
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Integration</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded mr-3 bg-white border flex items-center justify-center">
                    <CalendarDays size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Calendly</p>
                    <p className="text-xs text-gray-600">Not connected</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded mr-3 bg-white border flex items-center justify-center">
                    <Plug size={16} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">Acuity Scheduling</p>
                    <p className="text-xs text-gray-600">Not connected</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">Connect</Button>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Today&apos;s Appointments</span>
                <span className="text-sm font-semibold">{todayAppointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">All Appointments</span>
                <span className="text-sm font-semibold">{appointments.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Confirmed</span>
                <span className="text-sm font-semibold text-green-600">
                  {appointments.filter((apt) => apt.status === "confirmed").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Pending</span>
                <span className="text-sm font-semibold text-yellow-600">
                  {appointments.filter((apt) => apt.status === "pending").length}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Booking modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Book New Appointment</h3>
            <form className="space-y-4" onSubmit={submitBooking}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Patient Name</label>
                <input
                  type="text"
                  value={form.patientName}
                  onChange={(e) => setForm((f) => ({ ...f, patientName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <select
                  value={form.service}
                  onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option>Teeth Cleaning</option>
                  <option>Dental Implant</option>
                  <option>Root Canal</option>
                  <option>Orthodontics</option>
                  <option>Cosmetic Dentistry</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <input
                  type="text"
                  value={form.duration}
                  onChange={(e) => setForm((f) => ({ ...f, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. 30 minutes"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Additional notes..."
                  maxLength={500}
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Book Appointment
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppointmentsSection;
