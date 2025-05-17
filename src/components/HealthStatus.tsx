import { useEffect, useState } from "react";
import type { HealthStatus } from "../api/health";
import { getHealthStatus } from "../api/health";

const HealthStatus = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const data = await getHealthStatus();
        setHealth(data);
        setError(null);
      } catch {
        setError("상태 확인 실패");
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 30000); // 30초마다 갱신

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return <div className="health-status error">{error}</div>;
  }

  if (!health) {
    return <div className="health-status loading">상태 확인 중...</div>;
  }

  const getStatusClass = (status: string | undefined) => {
    if (!status) return "loading";
    return status.toLowerCase();
  };

  const getStatusText = (status: string | undefined) => {
    if (!status) return "확인 중";
    switch (status.toLowerCase()) {
      case "up":
        return "정상";
      case "degraded":
        return "성능 저하";
      case "down":
        return "비정상";
      default:
        return status;
    }
  };

  const getAverageResponseTime = (services: { responseTime: string }[]) => {
    if (!services.length) return "0ms";
    const total = services.reduce((acc, service) => {
      const time = parseInt(service.responseTime);
      return acc + (isNaN(time) ? 0 : time);
    }, 0);
    return `${Math.round(total / services.length)}ms`;
  };

  const getServiceStatusClass = (services: { status: string }[]) => {
    if (!services.length) return "loading";
    const allUp = services.every(
      (service) => service.status.toLowerCase() === "up"
    );
    const allDown = services.every(
      (service) => service.status.toLowerCase() === "down"
    );
    if (allUp) return "healthy";
    if (allDown) return "unhealthy";
    return "degraded";
  };

  const getServiceTooltip = (
    services: { name: string; status: string; responseTime: string }[]
  ) => {
    return services
      .map(
        (service) =>
          `${service.name}: ${getStatusText(service.status)} (${
            service.responseTime
          })`
      )
      .join("\n");
  };

  const getActiveCount = (services: { status: string }[]) => {
    return services.filter((service) => service.status.toLowerCase() === "up")
      .length;
  };

  return (
    <div className="health-status">
      <span className={`status-indicator ${getStatusClass(health.status)}`}>
        API 서버: {getStatusText(health.status)}
      </span>
      <span
        className={`status-indicator ${getServiceStatusClass(
          health.services.workers
        )}`}
        title={getServiceTooltip(health.services.workers)}
      >
        워커 ({getActiveCount(health.services.workers)}/
        {health.services.workers.length}):{" "}
        {getStatusText(health.services.workers[0]?.status)}
        <span className="response-time">
          {getAverageResponseTime(health.services.workers)}
        </span>
      </span>
      <span
        className={`status-indicator ${getServiceStatusClass(
          health.services.collectors
        )}`}
        title={getServiceTooltip(health.services.collectors)}
      >
        수집기 ({getActiveCount(health.services.collectors)}/
        {health.services.collectors.length}):{" "}
        {getStatusText(health.services.collectors[0]?.status)}
        <span className="response-time">
          {getAverageResponseTime(health.services.collectors)}
        </span>
      </span>
    </div>
  );
};

export default HealthStatus;
