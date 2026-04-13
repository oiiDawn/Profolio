import { createSupabaseServerClient } from "@/lib/supabase";
import type {
  LearningChapter,
  LearningProject,
  LearningProjectWithChapters,
  ProjectStatus,
  ChapterStatus,
} from "@/lib/types";

const VALID_PROJECT_STATUS: readonly ProjectStatus[] = [
  "in_progress",
  "completed",
  "paused",
];

const VALID_CHAPTER_STATUS: readonly ChapterStatus[] = [
  "not_started",
  "in_progress",
  "completed",
];

function isProjectStatus(v: string): v is ProjectStatus {
  return (VALID_PROJECT_STATUS as readonly string[]).includes(v);
}

function isChapterStatus(v: string): v is ChapterStatus {
  return (VALID_CHAPTER_STATUS as readonly string[]).includes(v);
}

function progressFromChapters(chapters: LearningChapter[]): number {
  if (chapters.length === 0) return 0;
  const done = chapters.filter((c) => c.status === "completed").length;
  return Math.round((done / chapters.length) * 100);
}

/**
 * Fetches learning projects and chapters from Supabase, ordered by `created_at`.
 * Returns an empty array when Supabase is not configured or the query fails.
 */
export async function getLearningProjects(): Promise<
  LearningProjectWithChapters[]
> {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  const { data: projectsRaw, error: projectsError } = await supabase
    .from("learning_projects")
    .select("*")
    .order("created_at", { ascending: true });

  if (projectsError || !projectsRaw) {
    if (process.env.NODE_ENV === "development") {
      console.error("[learning] learning_projects:", projectsError?.message);
    }
    return [];
  }

  const { data: chaptersRaw, error: chaptersError } = await supabase
    .from("learning_chapters")
    .select("*")
    .order("created_at", { ascending: true });

  if (chaptersError || !chaptersRaw) {
    if (process.env.NODE_ENV === "development") {
      console.error("[learning] learning_chapters:", chaptersError?.message);
    }
    return [];
  }

  const projects: LearningProject[] = projectsRaw.map((row) => ({
    id: row.id as string,
    title: String(row.title ?? ""),
    description: String(row.description ?? ""),
    tag: String(row.tag ?? ""),
    status: isProjectStatus(String(row.status))
      ? (row.status as ProjectStatus)
      : "in_progress",
    created_at: String(row.created_at ?? ""),
  }));

  const chapters: LearningChapter[] = chaptersRaw.map((row) => ({
    id: row.id as string,
    project_id: row.project_id as string,
    title: String(row.title ?? ""),
    status: isChapterStatus(String(row.status))
      ? (row.status as ChapterStatus)
      : "not_started",
    share_id:
      row.share_id === null || row.share_id === undefined
        ? null
        : String(row.share_id),
    share_url:
      row.share_url === null || row.share_url === undefined
        ? null
        : String(row.share_url),
    created_at: String(row.created_at ?? ""),
  }));

  const byProject = new Map<string, LearningChapter[]>();
  for (const ch of chapters) {
    const list = byProject.get(ch.project_id) ?? [];
    list.push(ch);
    byProject.set(ch.project_id, list);
  }

  return projects.map((p) => {
    const list = byProject.get(p.id) ?? [];
    return {
      ...p,
      chapters: list,
      progressPercent: progressFromChapters(list),
    };
  });
}
