"use client";

import { WargaDashboard } from "@/components/WargaDashboard";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Opsional: hindari fetch ulang saat pindah tab
      retry: 1, // Jika API mati, coba ulang 1x lalu tampilkan fallback
    },
  },
});

export default function DashboardPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <WargaDashboard />
    </QueryClientProvider>
  );
}