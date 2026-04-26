import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getMyParticipations,
  getMyProfile,
  updateNickname,
  updatePassword,
} from "@/api/users";

export const myPageQueryKeys = {
  all: ["mypage"] as const,
  profile: () => [...myPageQueryKeys.all, "profile"] as const,
  participations: () => [...myPageQueryKeys.all, "participations"] as const,
};

export function useMyProfile() {
  return useQuery({
    queryKey: myPageQueryKeys.profile(),
    queryFn: getMyProfile,
  });
}

export function useMyParticipations() {
  return useQuery({
    queryKey: myPageQueryKeys.participations(),
    queryFn: getMyParticipations,
  });
}

export function useUpdateNickname() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateNickname,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: myPageQueryKeys.profile() });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: updatePassword,
  });
}
