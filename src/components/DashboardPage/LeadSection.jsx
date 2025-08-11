import React, { useMemo, useState } from "react";
import { CheckCircle2, Send, Calendar, Search as SearchIcon, Plus } from "lucide-react";
import Card from "../Card";
import Button from "../Button";
import { leadsData as initialLeads } from "../../data/leads";

const LeadsSection = () => {
  const [leads, setLeads] = useState(initialLeads);
  const [filterStatus, setFilterStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Google Ads",
    service: "",
    notes: "",
  });

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-800",
      contacted: "bg-yellow-100 text-yellow-800",
      "follow-up": "bg-orange-100 text-orange-800",
      booked: "bg-green-100 text-green-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getQualificationColor = (qualification) =>
    qualification === "qualified" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800";

  const updateLeadStatus = (leadId, newStatus) => {
    setLeads((prev) =>
      prev.map((l) =>
        l.id === leadId ? { ...l, status: newStatus, lastContact: new Date().toISOString() } : l
      )
    );
  };

  const updateLeadQualification = (leadId, qualification) => {
    setLeads((prev) => prev.map((l) => (l.id === leadId ? { ...l, qualification } : l)));
  };

  const filteredLeads = useMemo(() => {
    const q = query.trim().toLowerCase();
    return leads.filter((lead) => {
      const statusOk = filterStatus === "all" || lead.status === filterStatus;
      if (!q) return statusOk;
      const haystack = [
        lead.name,
        lead.email,
        lead.phone,
        lead.source,
        lead.service,
        lead.notes,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return statusOk && haystack.includes(q);
    });
  }, [leads, filterStatus, query]);

  const resetForm = () =>
    setForm({ name: "", email: "", phone: "", source: "Google Ads", service: "", notes: "" });

  const handleAddLead = (e) => {
    e.preventDefault();
    const nextId = (leads.reduce((m, l) => Math.max(m, l.id), 0) || 0) + 1;
    const newLead = {
      id: nextId,
      name: form.name || "Unnamed",
      email: form.email || "",
      phone: form.phone || "",
      source: form.source,
      status: "new",
      qualification: "unqualified",
      service: form.service || "General",
      notes: form.notes || "",
      createdAt: new Date().toISOString(),
      lastContact: null,
    };
    setLeads((prev) => [newLead, ...prev]);
    resetForm();
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Lead Management</h2>
        <Button onClick={() => setShowAddModal(true)} className="flex items-center">
          <Plus size={16} className="mr-2" />
          Add New Lead
        </Button>
      </div>

      <Card>
        {/* Filters + Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "new", "contacted", "follow-up", "booked"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap ${
                  filterStatus === status
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status === "all"
                  ? "All Leads"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search leads..."
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Lead Info</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Source</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Qualification</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div>
                      <p className="font-medium text-gray-800">{lead.name}</p>
                      <p className="text-sm text-gray-500">
                        Added {new Date(lead.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-sm">
                      <p className="text-gray-800">{lead.email}</p>
                      <p className="text-gray-600">{lead.phone}</p>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{lead.source}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span className="text-sm text-gray-700">{lead.service}</span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        lead.status
                      )}`}
                    >
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getQualificationColor(
                        lead.qualification
                      )}`}
                    >
                      {lead.qualification}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => updateLeadQualification(lead.id, "qualified")}
                        className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                        title="Mark Qualified"
                      >
                        <CheckCircle2 size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLeadStatus(lead.id, "contacted")}
                        className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                        title="Send Follow-up"
                      >
                        <Send size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateLeadStatus(lead.id, "booked")}
                        className="p-1 text-purple-600 hover:bg-purple-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                        title="Schedule Appointment"
                      >
                        <Calendar size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                    No leads match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add lead modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Lead</h3>
            <form className="space-y-4" onSubmit={handleAddLead}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter lead name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
                <select
                  value={form.source}
                  onChange={(e) => setForm((f) => ({ ...f, source: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option>Google Ads</option>
                  <option>Facebook</option>
                  <option>Website</option>
                  <option>Referral</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
                <input
                  type="text"
                  value={form.service}
                  onChange={(e) => setForm((f) => ({ ...f, service: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Teeth Cleaning"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Optional notes"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    resetForm();
                    setShowAddModal(false);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  Add Lead
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsSection;
