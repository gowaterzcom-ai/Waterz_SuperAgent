import { apiClient } from "./apiClient";
import paths from "./paths";

export const superagentAPI = {
  getReferralLink: async (): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.post(paths.referralLink, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAllAgents: async (): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get(paths.getAllAgents, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  getAgentById: async (id: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get(`${paths.getAgent}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },

  removeAgentById: async (id: string): Promise<any> => {
    const token = localStorage.getItem("token");
    const response = await apiClient.get(`${paths.removeAgent}/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },

  getBookings: async (filterParams: { status?: string; agent?: string } = {}): Promise<any> => {
    const token = localStorage.getItem("token");
    
    const response = await apiClient.post(paths.getBookings, {
        ...filterParams
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },

  getEarnings: async ( agentWise: string ) : Promise<any> => {
    const token = localStorage.getItem("token");
    
    const response = await apiClient.post(paths.superagentEarnings, {
      agentWise
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
  },
};