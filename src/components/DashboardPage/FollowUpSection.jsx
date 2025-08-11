import React, { useMemo, useState, useEffect } from "react";
import Card from "../Card";
import Button from "../Button";
import { followUpTemplates as initialTemplates, leadsData } from "../../data/leads";
import {
  Plus,
  Edit3,
  Trash2,
  Send,
  Timer,
  Mail,
  Phone,
  MessageSquareText,
} from "lucide-react";

const FollowUpSection = () => {
  const [templates, setTemplates] = useState(initialTemplates);
  const [activeTab, setActiveTab] = useState("templates");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // form state for create/edit
  const [form, setForm] = useState({
    name: "",
    type: "email", // 'email' | 'sms'
    subject: "",
    content: "",
    delay: 0, // hours
  });

  useEffect(() => {
    if (selectedTemplate) {
      setForm({
        name: selectedTemplate.name || "",
        type: selectedTemplate.type || "email",
        subject: selectedTemplate.subject || "",
        content: selectedTemplate.content || "",
        delay: selectedTemplate.delay ?? 0,
      });
    } else {
      setForm({ name: "", type: "email", subject: "", content: "", delay: 0 });
    }
  }, [selectedTemplate, showTemplateModal]);

  const pendingFollowUps = useMemo(
    () => leadsData.filter((lead) => lead.status === "follow-up"),
    []
  );

  const getTemplateTypeColor = (type) =>
    type === "email" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";

  const openCreateModal = () => {
    setSelectedTemplate(null);
    setShowTemplateModal(true);
  };

  const openEditModal = (tpl) => {
    setSelectedTemplate(tpl);
    setShowTemplateModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this template?")) {
      setTemplates((prev) => prev.filter((t) => t.id !== id));
    }
  };

  const handleSubmitTemplate = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) return;

    if (selectedTemplate) {
      // update
      setTemplates((prev) =>
        prev.map((t) =>
          t.id === selectedTemplate.id
            ? {
                ...t,
                name: form.name.trim(),
                type: form.type,
                subject: form.type === "email" ? form.subject.trim() : "",
                content: form.content.trim(),
                delay: Number(form.delay) || 0,
              }
            : t
        )
      );
    } else {
      // create
      const nextId = (templates.reduce((m, t) => Math.max(m, t.id), 0) || 0) + 1;
      setTemplates((prev) => [
        {
          id: nextId,
          name: form.name.trim(),
          type: form.type,
          subject: form.type === "email" ? form.subject.trim() : "",
          content: form.content.trim(),
          delay: Number(form.delay) || 0,
        },
        ...prev,
      ]);
    }
    setShowTemplateModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Follow-up Management</h2>
        <Button onClick={openCreateModal} className="flex items-center">
          <Plus size={16} className="mr-2" />
          Create Template
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {["templates", "automation", "pending"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap ${
              activeTab === tab ? "bg-white shadow-sm" : "text-gray-600"
            }`}
          >
            {tab === "templates"
              ? "Templates"
              : tab === "automation"
              ? "Automation"
              : "Pending Follow-ups"}
          </button>
        ))}
      </div>

      {/* Templates */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  <div className="flex items-center space-x-2 mt-1">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getTemplateTypeColor(
                        template.type
                      )}`}
                    >
                      {template.type.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.delay === 0 ? "Immediate" : `${template.delay}h delay`}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditModal(template)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer w-6 h-6 flex items-center justify-center"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {template.subject ? (
                <div className="mb-2">
                  <p className="text-xs text-gray-600 font-medium">Subject:</p>
                  <p className="text-sm text-gray-800">{template.subject}</p>
                </div>
              ) : null}

              <div className="mb-4">
                <p className="text-xs text-gray-600 font-medium">Content:</p>
                <p className="text-sm text-gray-700 line-clamp-3">{template.content}</p>
              </div>

              <div className="flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1">
                  <Send size={14} className="mr-1" />
                  Send Now
                </Button>
                <Button size="sm" className="flex-1">
                  <Timer size={14} className="mr-1" />
                  Schedule
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Automation (dummy toggles for now) */}
      {activeTab === "automation" && <AutomationCards />}

      {/* Pending */}
      {activeTab === "pending" && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Follow-ups</h3>
          <div className="space-y-4">
            {pendingFollowUps.map((lead) => (
              <div
                key={lead.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{lead.name}</h4>
                      <p className="text-sm text-gray-600">
                        {lead.email} • {lead.phone}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Service: {lead.service}</span>
                    <span>Source: {lead.source}</span>
                    <span>
                      Last Contact:{" "}
                      {lead.lastContact
                        ? new Date(lead.lastContact).toLocaleDateString()
                        : "Never"}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    <Mail size={14} className="mr-1" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline">
                    <Phone size={14} className="mr-1" />
                    Call
                  </Button>
                  <Button size="sm">
                    <MessageSquareText size={14} className="mr-1" />
                    SMS
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create/Edit Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {selectedTemplate ? "Edit Template" : "Create Follow-up Template"}
            </h3>
            <form className="space-y-4" onSubmit={handleSubmitTemplate}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Template Name
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter template name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
              {form.type === "email" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject (Email only)
                  </label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter email subject"
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message Content
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter your message..."
                  maxLength={500}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Delay (hours)
                </label>
                <input
                  type="number"
                  value={form.delay}
                  onChange={(e) => setForm((f) => ({ ...f, delay: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowTemplateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1">
                  {selectedTemplate ? "Save Changes" : "Create Template"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// simple automation toggles (placeholder logic)
const AutomationCards = () => {
  const [rules, setRules] = useState({
    welcome: true,
    followup: false,
    reminders: true,
  });

  const Toggle = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative cursor-pointer ${
        value ? "bg-green-500" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${
          value ? "right-1" : "left-1"
        }`}
      />
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Automation Rules</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">New Lead Welcome Sequence</h4>
              <p className="text-sm text-gray-600">
                Automatically send welcome email to new leads
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${rules.welcome ? "text-green-600" : "text-gray-600"}`}>
                {rules.welcome ? "Active" : "Inactive"}
              </span>
              <Toggle value={rules.welcome} onChange={() => setRules((r) => ({ ...r, welcome: !r.welcome }))} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Follow-up Reminder</h4>
              <p className="text-sm text-gray-600">Send reminder 24 hours after initial contact</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${rules.followup ? "text-green-600" : "text-gray-600"}`}>
                {rules.followup ? "Active" : "Inactive"}
              </span>
              <Toggle value={rules.followup} onChange={() => setRules((r) => ({ ...r, followup: !r.followup }))} />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Appointment Reminders</h4>
              <p className="text-sm text-gray-600">SMS reminder 24 hours before appointment</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className={`text-sm font-medium ${rules.reminders ? "text-green-600" : "text-gray-600"}`}>
                {rules.reminders ? "Active" : "Inactive"}
              </span>
              <Toggle value={rules.reminders} onChange={() => setRules((r) => ({ ...r, reminders: !r.reminders }))} />
            </div>
          </div>
        </div>

        <Button className="w-full mt-4" variant="outline">
          <Plus size={16} className="mr-2" />
          Create New Rule
        </Button>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Automation Stats</h3>
        <div className="space-y-4">
          <Row label="Emails Sent Today" value={<span className="text-blue-600 font-semibold">23</span>} />
          <Row label="SMS Sent Today" value={<span className="text-green-600 font-semibold">8</span>} />
          <Row label="Open Rate" value={<span className="text-purple-600 font-semibold">68%</span>} />
          <Row label="Response Rate" value={<span className="text-orange-600 font-semibold">24%</span>} />
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Pro Tip</h4>
          <p className="text-sm text-blue-700">
            Personalized follow-ups have 3× higher response rates. Use lead names and specific service
            mentions in your templates.
          </p>
        </div>
      </Card>
    </div>
  );
};

const Row = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-lg">{value}</span>
  </div>
);

export default FollowUpSection;
