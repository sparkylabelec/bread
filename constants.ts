import { TemplateId, WritingTemplate } from './types';

export const GEMINI_FLASH_MODEL = 'gemini-3-flash-preview';
export const GEMINI_PRO_MODEL = 'gemini-3-pro-preview';

export const TEMPLATES: WritingTemplate[] = [
  {
    id: TemplateId.BLOG_POST,
    name: 'Blog Post',
    description: 'Generate SEO-friendly blog articles.',
    icon: 'PenTool',
    systemInstruction: 'You are an expert SEO blog writer. Create engaging, well-structured, and informative blog posts.',
    fields: [
      { id: 'topic', label: 'Topic/Title', type: 'text', placeholder: 'e.g., The Future of AI in Healthcare' },
      { id: 'keywords', label: 'Keywords (comma separated)', type: 'text', placeholder: 'AI, Health, Tech' },
      { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Inspirational', 'Humorous'], defaultValue: 'Professional' },
      { id: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., Tech enthusiasts, Doctors' },
    ]
  },
  {
    id: TemplateId.SOCIAL_MEDIA,
    name: 'Social Media Post',
    description: 'Catchy captions for Instagram, LinkedIn, or Twitter.',
    icon: 'Share2',
    systemInstruction: 'You are a social media manager. innovative, catchy, and viral-worthy captions with appropriate hashtags.',
    fields: [
      { id: 'topic', label: 'What is the post about?', type: 'textarea', placeholder: 'Describe the image or content...' },
      { id: 'platform', label: 'Platform', type: 'select', options: ['LinkedIn', 'Twitter (X)', 'Instagram', 'Facebook'], defaultValue: 'LinkedIn' },
      { id: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Funny', 'Excited', 'Thought-provoking'], defaultValue: 'Professional' },
    ]
  },
  {
    id: TemplateId.EMAIL_DRAFT,
    name: 'Cold Email',
    description: 'Professional emails that get responses.',
    icon: 'Mail',
    systemInstruction: 'You are a top-tier copywriter specializing in email marketing and professional communication.',
    fields: [
      { id: 'recipient', label: 'Recipient Name/Role', type: 'text', placeholder: 'e.g., Hiring Manager' },
      { id: 'goal', label: 'Goal of Email', type: 'text', placeholder: 'e.g., Schedule a meeting' },
      { id: 'key_points', label: 'Key Points to Cover', type: 'textarea', placeholder: 'List main value propositions...' },
    ]
  },
  {
    id: TemplateId.SUMMARIZER,
    name: 'Summarizer',
    description: 'Condense long text into key bullet points.',
    icon: 'FileText',
    systemInstruction: 'You are a precise editor. Summarize the provided text into clear, concise bullet points.',
    fields: [
      { id: 'content', label: 'Content to Summarize', type: 'textarea', placeholder: 'Paste text here...' },
      { id: 'length', label: 'Summary Length', type: 'select', options: ['Short (1-2 sentences)', 'Medium (Bullet points)', 'Detailed'], defaultValue: 'Medium (Bullet points)' },
    ]
  },
  {
    id: TemplateId.REWRITE,
    name: 'Content Improver',
    description: 'Rewrite text to be more engaging or clear.',
    icon: 'RefreshCw',
    systemInstruction: 'You are a professional editor. Rewrite the text to improve clarity, flow, and engagement while maintaining the original meaning.',
    fields: [
      { id: 'content', label: 'Original Content', type: 'textarea', placeholder: 'Paste text here...' },
      { id: 'improvement_type', label: 'Improvement Goal', type: 'select', options: ['Fix Grammar', 'Make it Punchy', 'Simplify', 'Expand'], defaultValue: 'Fix Grammar' },
    ]
  },
  {
    id: TemplateId.CREATIVE_STORY,
    name: 'Creative Story',
    description: 'Generate creative fiction or narratives.',
    icon: 'BookOpen',
    systemInstruction: 'You are a creative novelist. Write compelling stories with vivid imagery and strong character development.',
    fields: [
      { id: 'prompt', label: 'Story Premise', type: 'textarea', placeholder: 'A robot discovers it has emotions...' },
      { id: 'genre', label: 'Genre', type: 'select', options: ['Sci-Fi', 'Fantasy', 'Mystery', 'Romance'], defaultValue: 'Sci-Fi' },
    ]
  }
];
