import React from 'react';
import { 
  PenTool, 
  Share2, 
  Mail, 
  FileText, 
  RefreshCw, 
  BookOpen, 
  Layout, 
  ChevronRight, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  History,
  Trash2,
  Menu,
  X
} from 'lucide-react';

export const Icons = {
  PenTool, 
  Share2, 
  Mail, 
  FileText, 
  RefreshCw, 
  BookOpen, 
  Layout, 
  ChevronRight, 
  Loader2, 
  Copy, 
  Check, 
  Sparkles,
  History,
  Trash2,
  Menu,
  X
};

export type IconName = keyof typeof Icons;

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: string;
}

export const Icon: React.FC<IconProps> = ({ name, ...props }) => {
  const LucideIcon = Icons[name as IconName] || Icons.Layout;
  return <LucideIcon {...props} />;
};
