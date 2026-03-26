import useSWR from "swr";
import { fetcher } from "./useFetcher";

export default function useTransactions() {
  const { data, error, isLoading } = useSWR(
    "/transactions",
    fetcher,
    {
      refreshInterval: 5000,
    }
  );

  return {
    transactions: data?.transactions || [],
    isLoading,
    isError: error,
  };
}