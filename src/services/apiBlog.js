import api from "../api"

export async function login(data) {
    try{
        const response = await api.post("token/", data)
        return response.data

    }
    catch(err){
        if (err.status===401){
            throw new Error("Invalid Credentials")
        }

        throw new Error(err)

    }
}

// GET /api/leads/
export async function fetchLeads() {
  try {
    const response = await api.get("api/leads/");
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) throw new Error("Unauthorized");
    throw new Error(err.response?.data?.detail || err.message || "Failed to fetch leads");
  }
}

// PATCH /api/leads/:id/
export async function updateLead(id, data) {
  try {
    const response = await api.patch(`api/leads/${id}/`, data);
    return response.data;
  } catch (err) {
    if (err.response?.status === 401) throw new Error("Unauthorized");
    throw new Error(err.response?.data || err.message || "Failed to update lead");
  }
}