import api from "../api";
import { extractError } from "./httpErrors";

// -------- Templates --------
export async function listTemplates() {
  try {
    const r = await api.get("api/followups/templates/");
    return r.data;
  } catch (e) {
    throw new Error(extractError(e));
  }
}
export async function createTemplate(payload) {
  try {
    const r = await api.post("api/followups/templates/", payload);
    return r.data;
  } catch (e) {
    throw new Error(extractError(e));
  }
}
export async function updateTemplate(id, payload) {
  try {
    const r = await api.patch(`api/followups/templates/${id}/`, payload);
    return r.data;
  } catch (e) {
    throw new Error(extractError(e));
  }
}
export async function deleteTemplate(id) {
  try {
    await api.delete(`api/followups/templates/${id}/`);
    return true;
  } catch (e) {
    throw new Error(extractError(e));
  }
}

// -------- Jobs --------
export async function listPendingJobs() {
  try {
    const r = await api.get("api/followups/jobs/?status=pending");
    return r.data;
  } catch (e) {
    throw new Error(extractError(e));
  }
}
export async function sendJobNow(id) {
  try {
    const r = await api.post(`api/followups/jobs/${id}/send_now/`);
    return r.data;
  } catch (e) {
    throw new Error(extractError(e));
  }
}
export async function scheduleJob(payload) {
  // payload: { lead: <uuid>, template: <id>, delay_hours?: number }
  try {
    const r = await api.post("api/followups/jobs/schedule/", payload);
    return r.data; // returns the created job
  } catch (e) {
    throw new Error(extractError(e));
  }
}
