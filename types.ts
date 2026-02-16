export enum TemplateId {
  BLOG_POST = 'blog_post',
  SOCIAL_MEDIA = 'social_media',
  EMAIL_DRAFT = 'email_draft',
  SUMMARIZER = 'summarizer',
  REWRITE = 'rewrite',
  CREATIVE_STORY = 'creative_story'
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select';
  placeholder?: string;
  options?: string[]; // For select type
  defaultValue?: string;
}

export interface WritingTemplate {
  id: TemplateId;
  name: string;
  description: string;
  icon: string; // Lucide icon name
  fields: TemplateField[];
  systemInstruction: string;
}

export interface GenerationHistoryItem {
  id: string;
  templateId: TemplateId;
  title: string;
  content: string;
  timestamp: number;
}

export interface GenerateContentParams {
  template: WritingTemplate;
  formData: Record<string, string>;
  modelName: string;
}