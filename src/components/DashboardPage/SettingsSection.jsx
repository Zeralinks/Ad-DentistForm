import React, { useState } from "react";
import Card from "../Card";
import Button from "../Button";
import { MapPin, Phone, Mail, Globe, Save } from "lucide-react";

export default function SettingsSection() {
  const [businessInfo, setBusinessInfo] = useState({
    businessName: "Bright Smile Dental Clinic",
    email: "info@brightsmile.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, Suite 100",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    website: "www.brightsmile.com",
    description:
      "Full-service dental clinic providing comprehensive oral healthcare services for the whole family.",
  });

  const [businessHours, setBusinessHours] = useState({
    monday: { open: "09:00", close: "17:00", closed: false },
    tuesday: { open: "09:00", close: "17:00", closed: false },
    wednesday: { open: "09:00", close: "17:00", closed: false },
    thursday: { open: "09:00", close: "17:00", closed: false },
    friday: { open: "09:00", close: "17:00", closed: false },
    saturday: { open: "09:00", close: "13:00", closed: false },
    sunday: { open: "09:00", close: "17:00", closed: true },
  });

  const [activeTab, setActiveTab] = useState("business");

  const handleBusinessInfoChange = (field, value) => {
    setBusinessInfo((prev) => ({ ...prev, [field]: value }));
  };

  const handleBusinessHoursChange = (day, field, value) => {
    setBusinessHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const dayNames = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  };

  const handleSave = () => {
    // Hook this to your API later
    console.log("Saving settings...", { businessInfo, businessHours });
    alert("Saved! (mock)");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Settings</h2>
      </div>

      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1 w-fit">
        <button
          onClick={() => setActiveTab("business")}
          className={`px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === "business"
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Business Information
        </button>
        <button
          onClick={() => setActiveTab("hours")}
          className={`px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === "hours"
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Business Hours
        </button>
        <button
          onClick={() => setActiveTab("preferences")}
          className={`px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap transition-colors ${
            activeTab === "preferences"
              ? "bg-white shadow-sm text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Preferences
        </button>
      </div>

      {activeTab === "business" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Name
                </label>
                <input
                  type="text"
                  value={businessInfo.businessName}
                  onChange={(e) => handleBusinessInfoChange("businessName", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={businessInfo.email}
                  onChange={(e) => handleBusinessInfoChange("email", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={businessInfo.phone}
                  onChange={(e) => handleBusinessInfoChange("phone", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                <input
                  type="url"
                  value={businessInfo.website}
                  onChange={(e) => handleBusinessInfoChange("website", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Description
                </label>
                <textarea
                  value={businessInfo.description}
                  onChange={(e) => handleBusinessInfoChange("description", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  maxLength={500}
                />
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={businessInfo.address}
                  onChange={(e) => handleBusinessInfoChange("address", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input
                    type="text"
                    value={businessInfo.city}
                    onChange={(e) => handleBusinessInfoChange("city", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                  <input
                    type="text"
                    value={businessInfo.state}
                    onChange={(e) => handleBusinessInfoChange("state", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                <input
                  type="text"
                  value={businessInfo.zipCode}
                  onChange={(e) => handleBusinessInfoChange("zipCode", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3">Preview</h4>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-semibold text-gray-800">{businessInfo.businessName}</h5>
                  <p className="text-sm text-gray-600 mt-1">{businessInfo.description}</p>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      {businessInfo.address}, {businessInfo.city}, {businessInfo.state} {businessInfo.zipCode}
                    </div>
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2" />
                      {businessInfo.phone}
                    </div>
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2" />
                      {businessInfo.email}
                    </div>
                    <div className="flex items-center">
                      <Globe size={16} className="mr-2" />
                      {businessInfo.website}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "hours" && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Business Hours</h3>
          <div className="space-y-4">
            {Object.entries(businessHours).map(([day, hours]) => (
              <div
                key={day}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-24">
                    <span className="font-medium text-gray-800">{dayNames[day]}</span>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={hours.closed}
                      onChange={(e) => handleBusinessHoursChange(day, "closed", e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Closed</span>
                  </label>
                </div>

                {!hours.closed ? (
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours.open}
                        onChange={(e) => handleBusinessHoursChange(day, "open", e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={hours.close}
                        onChange={(e) => handleBusinessHoursChange(day, "close", e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ) : (
                  <span className="text-gray-400 italic">Closed</span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-800 mb-3">Hours Preview</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(businessHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="text-sm font-medium text-gray-700">{dayNames[day]}</span>
                  <span className="text-sm text-gray-600">
                    {hours.closed ? "Closed" : `${hours.open} - ${hours.close}`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}

      {activeTab === "preferences" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h3>
            <div className="space-y-4">
              <PreferenceRow
                title="New Lead Notifications"
                subtitle="Get notified when new leads are received"
                defaultChecked
              />
              <PreferenceRow
                title="Appointment Reminders"
                subtitle="Send automatic appointment reminders"
                defaultChecked
              />
              <PreferenceRow
                title="Follow-up Automation"
                subtitle="Automatically send follow-up messages"
              />
            </div>
          </Card>

          <Card>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">System Preferences</h3>
            <div className="space-y-4">
              <SelectRow label="Time Zone" options={["Eastern Time (ET)", "Central Time (CT)", "Mountain Time (MT)", "Pacific Time (PT)"]} />
              <SelectRow label="Date Format" options={["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"]} />
              <SelectRow label="Default Dashboard View" options={["Dashboard Overview", "Leads", "Appointments"]} />
            </div>
          </Card>
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button variant="outline" type="button">
          Cancel
        </Button>
        <Button type="button" onClick={handleSave} className="flex items-center">
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}

const PreferenceRow = ({ title, subtitle, defaultChecked = false }) => (
  <div className="flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" defaultChecked={defaultChecked} />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

const SelectRow = ({ label, options = [] }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8">
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  </div>
);
