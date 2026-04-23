export type HttpMethod = "GET" | "POST" | "PATCH" | "DELETE";

export type ApiSection = "utilities" | "crud";

export type ApiEndpoint = {
  id: string;
  section: ApiSection;
  title: string;
  method: HttpMethod;
  path: string;
  description: string;
  requestExample?: Record<string, unknown>;
  responseExample: Record<string, unknown> | Record<string, unknown>[];
};