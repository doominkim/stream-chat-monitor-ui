import React, { useEffect, useState } from "react";
import { getHealthStatus } from "../api/health";
import type { HealthStatus } from "../api/health";

const HealthStatusComponent: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<
    "workers" | "collectors" | null
  >(null);

  useEffect(() => {
    const fetchHealthStatus = async () => {
      try {
        const status = await getHealthStatus();
        setHealthStatus(status);
        setError(null);
      } catch {
        setError("상태를 불러오는데 실패했습니다.");
      }
    };

    fetchHealthStatus();
    const interval = setInterval(fetchHealthStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusClass = (status: string) => {
    if (!status) return "loading";
    return status.toLowerCase();
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "up":
        return "●";
      case "down":
        return "○";
      case "degraded":
        return "◐";
      default:
        return "◌";
    }
  };

  const getServiceStatusClass = (services: { status: string }[]) => {
    if (!services?.length) return "loading";
    if (services.every((s) => s.status === "up")) return "healthy";
    if (services.every((s) => s.status === "down")) return "unhealthy";
    return "degraded";
  };

  const getResponseTimeRange = (services: { responseTime: number }[]) => {
    if (!services?.length) return null;
    const times = services.map((s) => s.responseTime || 0).filter((t) => t > 0);
    if (times.length === 0) return null;

    const min = Math.min(...times);
    const max = Math.max(...times);
    const isDelayed = max >= 5000;
    return min === max
      ? isDelayed
        ? "지연"
        : `${min}`
      : isDelayed
      ? "지연"
      : `${min}-${max}`;
  };

  const getServiceStatusIcon = (services: { status: string }[]) => {
    if (!services?.length) return "◌";
    if (services.every((s) => s.status === "up")) return "●";
    if (services.every((s) => s.status === "down")) return "○";
    return "◐";
  };

  const getActiveCount = (services: { status: string }[]) => {
    if (!services?.length) return 0;
    return services.filter((s) => s.status === "up").length;
  };

  if (error) {
    return <div className="status-indicator error">{error}</div>;
  }

  if (!healthStatus) {
    return <div className="status-indicator loading">상태 확인 중...</div>;
  }

  const workersStatus = getServiceStatusClass(healthStatus.services.workers);
  const collectorsStatus = getServiceStatusClass(
    healthStatus.services.collectors
  );
  const serverStatus = getStatusClass(healthStatus.status);

  return (
    <>
      <div className="health-status">
        <div className={`status-indicator ${serverStatus}`}>
          {getStatusIcon(healthStatus.status)} API 서버
        </div>
        <div
          className={`status-indicator ${workersStatus}`}
          onClick={() => setSelectedService("workers")}
        >
          {getServiceStatusIcon(healthStatus.services.workers)} 워커 (
          {getActiveCount(healthStatus.services.workers)}/
          {healthStatus.services.workers.length})
          {getResponseTimeRange(healthStatus.services.workers) && (
            <span className="response-time">
              {getResponseTimeRange(healthStatus.services.workers)}
            </span>
          )}
        </div>
        <div
          className={`status-indicator ${collectorsStatus}`}
          onClick={() => setSelectedService("collectors")}
        >
          {getServiceStatusIcon(healthStatus.services.collectors)} 수집기 (
          {getActiveCount(healthStatus.services.collectors)}/
          {healthStatus.services.collectors.length})
          {getResponseTimeRange(healthStatus.services.collectors) && (
            <span className="response-time">
              {getResponseTimeRange(healthStatus.services.collectors)}
            </span>
          )}
        </div>
      </div>

      {selectedService && (
        <>
          <div
            className="status-modal-overlay"
            onClick={() => setSelectedService(null)}
          />
          <div className="status-modal">
            <div className="status-modal-header">
              <h3 className="status-modal-title">
                {selectedService === "workers" ? "워커 상태" : "수집기 상태"}
              </h3>
              <button
                className="status-modal-close"
                onClick={() => setSelectedService(null)}
              >
                ×
              </button>
            </div>
            <div className="status-modal-content">
              {healthStatus.services[selectedService].map((service) => (
                <div key={service.name} className="status-detail-item">
                  <span className="status-detail-name">{service.name}</span>
                  <span
                    className={`status-detail-value ${
                      service.status === "up" ? "healthy" : "unhealthy"
                    }`}
                  >
                    {getStatusIcon(service.status)}
                    {` (${
                      service.responseTime >= 5000
                        ? "지연"
                        : service.responseTime || 0
                    })`}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HealthStatusComponent;
