import useSWR from "swr";
import { fetcher } from "./useFetcher";

export default function useStats() {
  const { data, error, isLoading } = useSWR(
    "/transactions/stats",
    fetcher,
    {
      refreshInterval: 5000, // every 5 seconds
    }
  );

  return {
    stats: data,
    isLoading,
    isError: error,
  };
}