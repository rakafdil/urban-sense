import { reportApiService } from "@/app/services/report.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportApiService.reports.createReport,
    onSuccess: () => {
      // Refresh list laporan secara otomatis setelah kirim
      queryClient.invalidateQueries({ queryKey: ["reports", "me"] });
    },
  });
}