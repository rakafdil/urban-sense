import { useQuery } from "@tanstack/react-query";
import { userApiService } from "../services/user.service";

export function useUserMe() {
  return useQuery({
    queryKey: ["user", "me"],
    queryFn: userApiService.user.getMe,
  });
}