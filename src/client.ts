import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.WISEFLOW_BASE_URL ?? "https://europe-api.wiseflow.net/v1";
const API_KEY = process.env.WISEFLOW_API_KEY ?? "";
const LICENSE_ID = process.env.WISEFLOW_LICENSE_ID ?? "";

export const wiseflowClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-api-key": API_KEY,
    "x-wiseflow-license-id": LICENSE_ID,
  },
});

export async function wfGet<T>(path: string): Promise<T> {
  const response = await wiseflowClient.get<T>(path);
  return response.data;
}

export async function wfPost<TReturn, TBody extends object>(
  path: string,
  body: TBody,
): Promise<TReturn> {
  const response = await wiseflowClient.post<TReturn>(path, body);
  return response.data;
}
