import apiClient from "./client";

interface ServiceStatus {
  name: string;
  status: string;
  responseTime: string;
}

export interface HealthStatus {
  status: string;
  timestamp: string;
  services: {
    workers: ServiceStatus[];
    collectors: ServiceStatus[];
  };
}

export const getHealthStatus = async (): Promise<HealthStatus> => {
  try {
    const response = await apiClient.get("/health");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch health status:", error);
    throw error;
  }
};
