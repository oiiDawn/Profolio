/** Writing / shares metadata (Supabase `writing_shares`) */

export interface WritingShare {
  id: string;
  title: string;
  description: string | null;
  tag: string | null;
  type: "md" | "link";
  url: string | null;
  file_path: string | null;
  created_at: string;
  updated_at: string | null;
}
