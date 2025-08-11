import React, { useMemo, useState } from "react";
import Card from "../Card";
import Button from "../Button";
import {
  Plus,
  CheckCircle2,
  RefreshCcw,
  Check,
  Link as LinkIcon,
  Copy,
  Eye,
  EyeOff,
} from "lucide-react";

export default function IntegrationsSection() {
  const [connectedServices, setConnectedServices] = useState([
    { id: 101, name: "Google Analytics", status: "connected", description: "Track website lead sources" },
    { id: 102, name: "Mailchimp", status: "connected", description: "Email marketing automation" },
  ]);

  const availableIntegrations = [
    {
      id: 1,
      name: "Calendly",
      description: "Appointment booking integration",
      icon:
        "modern professional calendar scheduling application icon with clean blue and white design, minimalist business software logo on simple white background",
      category: "Scheduling",
      features: ["Online appointment booking", "Calendar sync", "Automated reminders"],
    },
    {
      id: 2,
      name: "Google Ads",
      description: "Track ad performance and lead attribution",
      icon:
        "google ads advertising platform icon with colorful design, professional marketing software logo on clean white background",
      category: "Marketing",
      features: ["Lead source tracking", "Conversion tracking", "ROI analysis"],
    },
    {
      id: 3,
      name: "Facebook Ads",
      description: "Monitor social media lead generation",
      icon:
        "facebook advertising platform icon with blue gradient design, professional social media marketing logo on white background",
      category: "Marketing",
      features: ["Social lead tracking", "Ad performance", "Audience insights"],
    },
    {
      id: 4,
      name: "Twilio",
      description: "SMS and voice communication",
      icon:
        "professional communication software icon with modern design, clean business messaging app logo with red accent on white background",
      category: "Communication",
      features: ["SMS automation", "Voice calls", "WhatsApp integration"],
    },
    {
      id: 5,
      name: "Zapier",
      description: "Connect with 3000+ apps",
      icon:
        "automation workflow software icon with orange and white design, professional business integration platform logo on clean background",
      category: "Automation",
      features: ["Workflow automation", "Data sync", "Custom triggers"],
    },
    {
      id: 6,
      name: "HubSpot",
      description: "CRM and marketing automation",
      icon:
        "professional crm software icon with orange gradient design, modern business management platform logo on white background",
      category: "CRM",
      features: ["Advanced CRM", "Lead scoring", "Marketing automation"],
    },
  ];

  const categories = ["All", "Scheduling", "Marketing", "Communication", "Automation", "CRM"];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredIntegrations = useMemo(() => {
    return selectedCategory === "All"
      ? availableIntegrations
      : availableIntegrations.filter((i) => i.category === selectedCategory);
  }, [selectedCategory]);

  const [copied, setCopied] = useState(null); // which field was copied
  const [showSecret, setShowSecret] = useState(false);

  const handleCopy = async (text, key) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied(null), 1200);
    } catch (e) {
      console.error("Copy failed", e);
      alert("Copy failed");
    }
  };

  const handleConnect = (integration) => {
    // prevent duplicates
    if (connectedServices.some((s) => s.name === integration.name)) return;
    const nextId = (connectedServices.reduce((m, s) => Math.max(m, s.id), 0) || 100) + 1;
    setConnectedServices((prev) => [
      ...prev,
      { id: nextId, name: integration.name, status: "connected", description: integration.description },
    ]);
  };

  const imgUrl = (q, name) =>
    `https://readdy.ai/api/search-image?query=${encodeURIComponent(q)}&width=40&height=40&seq=${encodeURIComponent(
      name.toLowerCase().replace(/\s+/g, "-")
    )}-integration&orientation=squarish`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Integrations</h2>
        <Button className="flex items-center">
          <Plus size={16} className="mr-2" />
          Request Integration
        </Button>
      </div>

      {/* Connected + Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Connected Services</h3>
          <div className="space-y-3">
            {connectedServices.map((service) => (
              <div
                key={service.id}
                className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-800">{service.name}</p>
                  <p className="text-xs text-gray-600">{service.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-xs text-green-700">Connected</span>
                </div>
              </div>
            ))}
            {connectedServices.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No connected services yet</p>
            )}
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Integration Health</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="text-green-600" size={24} />
              </div>
              <p className="text-sm text-gray-600">Data Sync Status</p>
              <p className="font-semibold text-green-600">Healthy</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <RefreshCcw className="text-blue-600" size={24} />
              </div>
              <p className="text-sm text-gray-600">Last Sync</p>
              <p className="font-semibold text-blue-600">2 min ago</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Integrations */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">Available Integrations</h3>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-sm cursor-pointer whitespace-nowrap ${
                  selectedCategory === category
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <div
              key={integration.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center">
                  <img
                    src={imgUrl(integration.icon, integration.name)}
                    alt={integration.name}
                    className="w-10 h-10 rounded-lg mr-3 object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">{integration.name}</h4>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {integration.category}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-3">{integration.description}</p>

              <div className="mb-4">
                <p className="text-xs text-gray-500 font-medium mb-2">Key Features:</p>
                <ul className="text-xs text-gray-600 space-y-1">
                  {integration.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      <Check className="text-green-500 mr-2" size={14} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <Button size="sm" className="w-full flex items-center justify-center" onClick={() => handleConnect(integration)}>
                <LinkIcon size={16} className="mr-2" />
                Connect
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* API Config */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-800 mb-4">API Configuration</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3">Webhook Endpoints</h4>
            <div className="space-y-3">
              <WebhookRow
                label="New Lead Webhook"
                url="https://api.leadflow.com/webhooks/leads"
                onCopy={(txt) => handleCopy(txt, "lead-webhook")}
                copied={copied === "lead-webhook"}
              />
              <WebhookRow
                label="Appointment Webhook"
                url="https://api.leadflow.com/webhooks/appointments"
                onCopy={(txt) => handleCopy(txt, "apt-webhook")}
                copied={copied === "apt-webhook"}
              />
            </div>
          </div>

          <div>
            <h4 className="font-medium text-gray-800 mb-3">API Keys</h4>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Public API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value="pk_live_xxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                    onClick={() => handleCopy("pk_live_xxxxxxxxxxxxxxxxxxxx", "pk")}
                    title="Copy"
                  >
                    {copied === "pk" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-1">Secret API Key</label>
                <div className="flex items-center space-x-2">
                  <input
                    type={showSecret ? "text" : "password"}
                    value="sk_live_xxxxxxxxxxxxxxxxxxxx"
                    readOnly
                    className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                    onClick={() => setShowSecret((s) => !s)}
                    title={showSecret ? "Hide" : "Show"}
                  >
                    {showSecret ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                  <button
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer"
                    onClick={() => handleCopy("sk_live_xxxxxxxxxxxxxxxxxxxx", "sk")}
                    title="Copy"
                  >
                    {copied === "sk" ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

/* helpers */
const WebhookRow = ({ label, url, onCopy, copied }) => (
  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
    <div>
      <p className="text-sm font-medium text-gray-800">{label}</p>
      <p className="text-xs text-gray-500 font-mono">{url}</p>
    </div>
    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded cursor-pointer" onClick={() => onCopy(url)} title="Copy">
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  </div>
);
