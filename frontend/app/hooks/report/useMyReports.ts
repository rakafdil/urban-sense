import { reportApiService } from "@/app/services/report.service";
import { useQuery } from "@tanstack/react-query";

export function useMyReports() {
  return useQuery({
    queryKey: ["reports", "me"],
    queryFn: reportApiService.reports.getMyReports,
  });
}