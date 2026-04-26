import type { EventStatus } from "@/types/event";

export interface CreateAdminEventRequest {
  image: File | null;
  title: string;
  productName: string;
  winnerLimit: number;
  startAt: string;
  endAt: string;
}

export interface AdminEventResult {
  eventId: number;
  eventName: string;
  productName: string;
  winnerLimit: number;
  winnerCount: number;
  participantCount: number;
  startAt: string;
  endAt: string;
  status: EventStatus;
}

export interface AdminParticipation {
  participantId: number;
  userId: number;
  nickname: string;
  email?: string;
  rank: number;
  result: "WIN" | "LOSE";
  participatedAt: string;
}
