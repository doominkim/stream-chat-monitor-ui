import apiClient from "./client";

export interface ServiceStatus {
  name: string;
  status: string;
  responseTime: number;
}

export interface HealthStatus {
  status: string;
  services: {
    workers: ServiceStatus[];
    collectors: ServiceStatus[];
  };
}

export const getHealthStatus = async (): Promise<HealthStatus> => {
  const response = await apiClient.get("/health");
  return response.data;
};
