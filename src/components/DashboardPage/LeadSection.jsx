// src/components/DashboardPage/LeadsSection.jsx
import React, { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CheckCircle2, Search as SearchIcon, Info, RefreshCcw, Tag } from "lucide-react";

import Card from "../Card";
import Button from "../Button";
import { fetchLeads, updateLead } from "../../services/apiBlog";

const qualColor = (q) => ({
  qualified: "bg-green-100 text-green-800",
  nurture: "bg-yellow-100 text-yellow-800",
  disqualified: "bg-red-100 text-red-800",
}[q] || "bg-gray-100 text-gray-800");

export default function LeadsSection() {
  const qc = useQueryClient();
  const [query, setQuery] = useState("");
  const [filterQ, setFilterQ] = useState("all");

  const { data: leads = [], isLoading, isFetching } = useQuery({
    queryKey: ["leads"],
    queryFn: fetchLeads,
    refetchInterval: 10000, // poll every 10s so new leads appear
  });

  const patchLead = useMutation({
    mutationFn: ({ id, data }) => updateLead(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Updated");
    },
    onError: (e) => toast.error(e.message || "Update failed"),
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (leads || []).filter((l) => {
      const statusOk = filterQ === "all" || l.qualification_status === filterQ;
      if (!q) return statusOk;
      const hay = [
        l.firstName, l.lastName, l.email, l.phone,
        l.insurance, l.situation, l.urgency, l.notes,
      ].filter(Boolean).join(" ").toLowerCase();
      return statusOk && hay.includes(q);
    });
  }, [leads, filterQ, query]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Lead Management</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => qc.invalidateQueries({ queryKey: ["leads"] })}
            className="flex items-center"
          >
            <RefreshCcw size={16} className={isFetching ? "animate-spin mr-2" : "mr-2"} />
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        {/* Filters + Search */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-wrap gap-2">
            {["all", "qualified", "nurture", "disqualified"].map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilterQ(k)}
                className={`px-4 py-2 rounded-lg text-sm cursor-pointer whitespace-nowrap ${
                  filterQ === k ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {k === "all" ? "All" : k.charAt(0).toUpperCase() + k.slice(1)}
              </button>
            ))}
          </div>

          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2" size={16} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, email, phone, notes…"
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Lead</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Insurance</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Urgency</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Qualification</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                    Loading…
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                    No leads match your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((l) => (
                  <tr key={l.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-medium text-gray-800">
                          {l.firstName} {l.lastName}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added {new Date(l.submitted_at).toLocaleString()}
                        </p>
                        {l.situation && (
                          <p className="text-xs text-gray-500 mt-1">Need: {l.situation}</p>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4 text-sm">
                      <p className="text-gray-800">{l.email}</p>
                      <p className="text-gray-600">{l.phone}</p>
                    </td>

                    <td className="py-4 px-4 text-sm">
                      <span className="text-gray-700">{l.insurance || "-"}</span>
                    </td>

                    <td className="py-4 px-4 text-sm">
                      <span className="text-gray-700">{l.urgency || "-"}</span>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${qualColor(l.qualification_status)}`}>
                          {l.qualification_status}
                        </span>
                        <span className="text-xs text-gray-600">Score: {l.qualification_score}</span>
                        {Array.isArray(l.qualification_reasons) && l.qualification_reasons.length > 0 && (
                          <span
                            title={l.qualification_reasons.join(", ")}
                            className="inline-flex items-center text-gray-500"
                          >
                            <Info size={14} className="ml-1" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        {/* Example: add a quick tag */}
                        <button
                          type="button"
                          title="Add tag 'reviewed'"
                          onClick={() =>
                            patchLead.mutate({
                              id: l.id,
                              data: { tags: [...new Set([...(l.tags || []), "reviewed"])] },
                            })
                          }
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer w-7 h-7 flex items-center justify-center"
                        >
                          <Tag size={16} />
                        </button>

                        {/* Example: note it (appends) */}
                        <button
                          type="button"
                          title="Mark reviewed"
                          onClick={() =>
                            patchLead.mutate({
                              id: l.id,
                              data: { notes: (l.notes || "") + (l.notes ? " | " : "") + "Reviewed" },
                            })
                          }
                          className="p-1 text-green-600 hover:bg-green-50 rounded cursor-pointer w-7 h-7 flex items-center justify-center"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
