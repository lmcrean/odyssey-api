/**
 * Health response model shared between API and frontend
 * This interface matches the C# HealthResponse model in the API
 */
export interface HealthResponse {
  message: string;
  version: string;
  timestamp: string;
}