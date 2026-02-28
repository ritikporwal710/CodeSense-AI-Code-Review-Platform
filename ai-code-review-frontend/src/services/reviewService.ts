import api from "@/lib/api";
import type { CodeReview, CodeReviewSummary } from "@/types/review";

export const submitCodeReview = async (data: {
  title: string;
  language: string;
  code: string;
}): Promise<CodeReview> => {
  const response = await api.post("/api/reviews", data);
  return response.data.review;
};

export const getMyReviews = async (): Promise<CodeReviewSummary[]> => {
  const response = await api.get("/api/reviews");
  return response.data.reviews;
};

export const getReviewById = async (id: string): Promise<CodeReview> => {
  const response = await api.get(`/api/reviews/${id}`);
  return response.data.review;
};
