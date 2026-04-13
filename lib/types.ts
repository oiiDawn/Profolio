/** Learning tracker: project-level status */
export type ProjectStatus = "in_progress" | "completed" | "paused";

/** Learning tracker: chapter-level status */
export type ChapterStatus = "not_started" | "in_progress" | "completed";

export interface LearningProject {
  id: string;
  title: string;
  description: string;
  tag: string;
  status: ProjectStatus;
  created_at: string;
}

export interface LearningChapter {
  id: string;
  project_id: string;
  title: string;
  status: ChapterStatus;
  share_id: string | null;
  share_url: string | null;
  created_at: string;
}

export interface LearningProjectWithChapters extends LearningProject {
  chapters: LearningChapter[];
  /** 0–100 from completed chapters / total chapters */
  progressPercent: number;
}
