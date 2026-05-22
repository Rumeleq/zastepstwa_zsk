import { useQuery } from "@tanstack/react-query"
import { getReplacements } from "../services"

export function useGlobalData() {
  return useQuery({
    queryKey: ["globalData"],
    queryFn: getReplacements,
    refetchInterval: 60000,
    staleTime: 60000,
  })
}
