import { useQuery } from "@tanstack/react-query";
import api from "../services/api";

export function useBranches() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["branches"],
    queryFn: () => api.get("/branches").then((r) => r.data),
    staleTime: 1000 * 30, // refresh every 30 seconds
    refetchInterval: 1000 * 30,
    refetchOnWindowFocus: true,
  });

  return {
    branches: data?.data || [],
    isLoading,
    error,
  };
}
