export interface CodeReviewSummary {
  id: string;
  title: string;
  language: string;
  overallScore: number | null;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export interface ReviewIssue {
  severity: "critical" | "major" | "minor" | "info";
  category: string;
  line?: number;
  title: string;
  description: string;
  suggestion: string;
}

export interface ReviewFeedback {
  summary: string;
  overallScore: number;
  issues: ReviewIssue[];
  strengths: string[];
  improvements: string[];
  optimizedCode: string;
}

export interface CodeReview extends CodeReviewSummary {
  code: string;
  reviewFeedback: ReviewFeedback | null;
  optimizedCode: string | null;
  updatedAt: string;
}
