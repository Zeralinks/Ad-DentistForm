import React, { useMemo, useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
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

import Card from "../Card";
import Button from "../Button";
import {
  listTemplates,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  listPendingJobs,
  sendJobNow,
  scheduleJob,
} from "../../services/followups";
import { fetchLeads } from "../../services/apiBlog";

const getTypeBadge = (type) =>
  type === "email" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800";

const QUAL_OPTIONS = [
  { value: "qualified", label: "Qualified" },
  { value: "nurture", label: "Nurture" },
  { value: "disqualified", label: "Disqualified" },
];

export default function FollowUpSection() {
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("templates");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleForTemplate, setScheduleForTemplate] = useState(null);

  // ---------- Queries ----------
  const { data: templates = [], isLoading: loadingTpl } = useQuery({
    queryKey: ["fu-templates"],
    queryFn: listTemplates,
    refetchInterval: 15000,
  });

  const { data: pending = [], isLoading: loadingJobs } = useQuery({
    queryKey: ["fu-pending"],
    queryFn: listPendingJobs,
    refetchInterval: 15000,
  });

  const { data: leads = [] } = useQuery({
    queryKey: ["leads", "for-schedule"],
    queryFn: fetchLeads,
    staleTime: 30_000,
  });

  // ---------- Mutations ----------
  const createTpl = useMutation({
    mutationFn: createTemplate,
    onSuccess: () => {
      toast.success("Template created");
      qc.invalidateQueries({ queryKey: ["fu-templates"] });
      setShowTemplateModal(false);
    },
    onError: (e) => toast.error(e.message),
  });

  const updateTpl = useMutation({
    mutationFn: ({ id, payload }) => updateTemplate(id, payload),
    onSuccess: () => {
      toast.success("Template updated");
      qc.invalidateQueries({ queryKey: ["fu-templates"] });
      setShowTemplateModal(false);
      setEditingTemplate(null);
    },
    onError: (e) => toast.error(e.message),
  });

  const deleteTplMut = useMutation({
    mutationFn: deleteTemplate,
    onSuccess: () => {
      toast.success("Template deleted");
      qc.invalidateQueries({ queryKey: ["fu-templates"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const sendJobNowMut = useMutation({
    mutationFn: sendJobNow,
    onSuccess: () => {
      toast.success("Sent");
      qc.invalidateQueries({ queryKey: ["fu-pending"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const scheduleJobMut = useMutation({
    mutationFn: scheduleJob,
    onSuccess: (job) => {
      toast.success("Scheduled");
      qc.invalidateQueries({ queryKey: ["fu-pending"] });
      setShowScheduleModal(false);
      setScheduleForTemplate(null);
    },
    onError: (e) => toast.error(e.message),
  });

    // ---------- Template Form State ----------
  const [form, setForm] = useState({
    name: "", type: "email", subject: "", content: "",
    delay_minutes: 0, trigger_on: "nurture", active: true
  });



  useEffect(() => {
    if (!showTemplateModal) return;
    if (editingTemplate) {
      setForm({
        name: editingTemplate.name || "",
        type: editingTemplate.channel || "email",
        subject: editingTemplate.subject || "",
        content: editingTemplate.content || "",
        delay_minutes: editingTemplate.delay_minutes ?? 0,
        trigger_on: editingTemplate.trigger_on || "nurture",
        active: !!editingTemplate.active,
      });
    } else {
      setForm({
        name: "",
        type: "email",
        subject: "",
        content: "",
        delay_minutes: 0,
        trigger_on: "nurture",
        active: true,
      });
    }
  }, [editingTemplate, showTemplateModal]);

  const openCreateModal = () => {
    setEditingTemplate(null);
    setShowTemplateModal(true);
  };
  const openEditModal = (tpl) => {
    setEditingTemplate(tpl);
    setShowTemplateModal(true);
  };

  const submitTemplate = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.content.trim()) {
      toast.error("Name and content are required.");
      return;
    }
    const payload = {
      name: form.name.trim(),
      channel: form.type,
      subject: form.type === "email" ? form.subject.trim() : "",
      content: form.content.trim(),
      delay_minutes: Number(form.delay_minutes || 0),
      trigger_on: form.trigger_on,
      active: !!form.active,
    };
    if (editingTemplate) {
      updateTpl.mutate({ id: editingTemplate.id, payload });
    } else {
      createTpl.mutate(payload);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this template?")) {
      deleteTplMut.mutate(id);
    }
  };

  const openScheduleForTemplate = (tpl) => {
    setScheduleForTemplate(tpl);
    setShowScheduleModal(true);
  };

  // ---------- Derived ----------
  const pendingCount = pending.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Follow-up Management</h2>
        <div className="flex items-center gap-2">
          <Button onClick={openCreateModal} className="flex items-center">
            <Plus size={16} className="mr-2" />
            Create Template
          </Button>
        </div>
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
              : `Pending Follow-ups (${pendingCount})`}
          </button>
        ))}
      </div>

      {/* Templates */}
      {activeTab === "templates" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loadingTpl && (
            <Card><div className="p-6 text-sm text-gray-500">Loading templates…</div></Card>
          )}

          {!loadingTpl && templates.length === 0 && (
            <Card><div className="p-6 text-sm text-gray-500">No templates yet.</div></Card>
          )}

          {templates.map((template) => (
            <Card key={template.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-gray-800">{template.name}</h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadge(template.channel)}`}>
                      {template.channel.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                      {template.trigger_on}
                    </span>
                    <span className="text-xs text-gray-500">
                      {template.delay_minutes === 0 ? "Immediate" : `${template.delay_minutes}m delay`}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        template.active ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {template.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-1">
                  <button
                    onClick={() => openEditModal(template)}
                    className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer w-7 h-7 flex items-center justify-center"
                    title="Edit"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(template.id)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer w-7 h-7 flex items-center justify-center"
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
                <Button size="sm" variant="outline" className="flex-1" onClick={() => openScheduleForTemplate(template)}>
                  <Send size={14} className="mr-1" />
                  Send / Schedule
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={() => {
                    setScheduleForTemplate(template);
                    setShowScheduleModal(true);
                  }}
                >
                  <Timer size={14} className="mr-1" />
                  Quick Schedule
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Automation (simple toggles placeholder) */}
      {activeTab === "automation" && <AutomationCards />}

      {/* Pending */}
      {activeTab === "pending" && (
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Pending Follow-ups</h3>
          {loadingJobs && <div className="p-4 text-sm text-gray-500">Loading…</div>}
          {!loadingJobs && pending.length === 0 && (
            <div className="p-4 text-sm text-gray-500">Nothing pending.</div>
          )}
          <div className="space-y-4">
            {pending.map((job) => (
              <div
                key={job.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-800">{job.lead_name}</h4>
                  <p className="text-sm text-gray-600">{job.email}</p>
                  <p className="text-xs text-gray-500">
                    Scheduled {new Date(job.scheduled_for).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => sendJobNowMut.mutate(job.id)}>
                    <Send size={14} className="mr-1" />
                    Send Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create/Edit Template Modal */}
      {showTemplateModal && (
        <Modal onClose={() => setShowTemplateModal(false)} title={editingTemplate ? "Edit Template" : "Create Template"}>
          <form className="space-y-4" onSubmit={submitTemplate}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Template Name">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </Field>

              <Field label="Trigger on">
                <select
                  value={form.trigger_on}
                  onChange={(e) => setForm((f) => ({ ...f, trigger_on: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  {QUAL_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </Field>

              <Field label="Type">
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </Field>

              <Field label="Delay (minutes)">
                <input
                  type="number"
                  min="0"
                  value={form.delay_minutes}
                  onChange={(e) => setForm((f) => ({ ...f, delay_minutes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </Field>

              {form.type === "email" && (
                <Field label="Subject (Email)">
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </Field>
              )}

              <Field label="Active">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.active}
                    onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                  />
                  <span className="text-sm text-gray-700">Enabled</span>
                </label>
              </Field>
            </div>

            <Field label="Message Content">
              <textarea
                rows={5}
                value={form.content}
                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Use variables like {{first_name}}, {{service}}, {{status}}, {{score}}"
                required
              />
            </Field>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" type="button" onClick={() => setShowTemplateModal(false)}>
                Cancel
              </Button>
              <Button type="submit">
                {editingTemplate ? "Save Changes" : "Create Template"}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {/* Send/Schedule Modal */}
      {showScheduleModal && scheduleForTemplate && (
        <ScheduleModal
          template={scheduleForTemplate}
          leads={leads}
          onClose={() => { setShowScheduleModal(false); setScheduleForTemplate(null); }}
          onSchedule={({ leadId, delayMinutes, sendNow }) => {
            // Create a job, then optionally send immediately
            scheduleJobMut.mutate(
              { lead: leadId, template: scheduleForTemplate.id, delay_minutes: Number(delayMinutes || 0) },
              {
                onSuccess: async (job) => {
                  if (sendNow) {
                    await sendJobNowMut.mutateAsync(job.id);
                  }
                  qc.invalidateQueries({ queryKey: ["fu-pending"] });
                  setShowScheduleModal(false);
                  setScheduleForTemplate(null);
                }
              }
            );
          }}
        />
      )}
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

const Field = ({ label, children }) => (
  <label className="block">
    <span className="block text-sm font-medium text-gray-700 mb-1">{label}</span>
    {children}
  </label>
);

const Modal = ({ title, onClose, children }) => (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        <button
          className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-600"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>
      {children}
    </div>
  </div>
);

const ScheduleModal = ({ template, leads, onClose, onSchedule }) => {
  const [leadId, setLeadId] = useState(leads?.[0]?.id || "");
  const [delay, setDelay] = useState(0);
  const [sendNow, setSendNow] = useState(true);

  useEffect(() => {
    setLeadId(leads?.[0]?.id || "");
  }, [leads]);

  return (
    <Modal title={`Send "${template.name}"`} onClose={onClose}>
      <div className="space-y-4">
        <Field label="Lead">
          <select
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-8"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name || `${l.firstName || ""} ${l.lastName || ""}`.trim()} — {l.email}
              </option>
            ))}
          </select>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Delay (hours)">
            <input
              type="number"
              min="0"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </Field>
          <Field label="Send immediately after scheduling">
            <label className="inline-flex items-center gap-2 h-[42px]">
              <input type="checkbox" checked={sendNow} onChange={(e) => setSendNow(e.target.checked)} />
              <span className="text-sm text-gray-700">Send now</span>
            </label>
          </Field>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          <Button
            onClick={() => {
              if (!leadId) return toast.error("Pick a lead");
              onSchedule({ leadId, delayHours: delay, sendNow });
            }}
          >
            {sendNow ? "Schedule & Send" : "Schedule"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

/* Placeholder Automation card (non-blocking) */
const AutomationCards = () => {
  const [rules, setRules] = useState({ welcome: true, followup: false, reminders: true });
  const Toggle = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full relative cursor-pointer ${value ? "bg-green-500" : "bg-gray-300"}`}
    >
      <div className={`w-4 h-4 bg-white rounded-full absolute top-1 transition-all ${value ? "right-1" : "left-1"}`} />
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Automation Rules</h3>
        <div className="space-y-4">
          <AutoRow
            title="New Lead Welcome Sequence"
            desc="Automatically send welcome email to new leads"
            active={rules.welcome}
            onToggle={() => setRules((r) => ({ ...r, welcome: !r.welcome }))}
            Toggle={Toggle}
          />
          <AutoRow
            title="Follow-up Reminder"
            desc="Send reminder 24 hours after initial contact"
            active={rules.followup}
            onToggle={() => setRules((r) => ({ ...r, followup: !r.followup }))}
            Toggle={Toggle}
          />
          <AutoRow
            title="Appointment Reminders"
            desc="SMS reminder 24 hours before appointment"
            active={rules.reminders}
            onToggle={() => setRules((r) => ({ ...r, reminders: !r.reminders }))}
            Toggle={Toggle}
          />
        </div>
        <Button className="w-full mt-4" variant="outline">
          <Plus size={16} className="mr-2" />
          Create New Rule
        </Button>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Automation Stats</h3>
        <div className="space-y-4">
          <StatRow label="Emails Sent Today" value={<span className="text-blue-600 font-semibold">23</span>} />
          <StatRow label="SMS Sent Today" value={<span className="text-green-600 font-semibold">8</span>} />
          <StatRow label="Open Rate" value={<span className="text-purple-600 font-semibold">68%</span>} />
          <StatRow label="Response Rate" value={<span className="text-orange-600 font-semibold">24%</span>} />
        </div>
        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Pro Tip</h4>
          <p className="text-sm text-blue-700">
            Personalized follow-ups get higher replies. Use <code>{'{{first_name}}'}</code> and <code>{'{{service}}'}</code> in templates.
          </p>

        </div>
      </Card>
    </div>
  );
};

const AutoRow = ({ title, desc, active, onToggle, Toggle }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
    <div>
      <h4 className="font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
    <div className="flex items-center space-x-2">
      <span className={`text-sm font-medium ${active ? "text-green-600" : "text-gray-600"}`}>
        {active ? "Active" : "Inactive"}
      </span>
      <Toggle value={active} onChange={onToggle} />
    </div>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex justify-between items-center">
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-lg">{value}</span>
  </div>
);
