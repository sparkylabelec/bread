import React from 'react';
import { TEMPLATES } from '../constants';
import { WritingTemplate } from '../types';
import { Icon } from './Icon';

interface TemplateSelectorProps {
  selectedTemplate: WritingTemplate;
  onSelect: (template: WritingTemplate) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ selectedTemplate, onSelect, isOpen, onCloseMobile }) => {
  return (
    <div className={`
      fixed inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out
      md:translate-x-0 md:static md:block
      ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    `}>
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <Icon name="Sparkles" className="w-6 h-6" />
            <span className="font-bold text-xl tracking-tight text-slate-900">InkFlow</span>
          </div>
          <button onClick={onCloseMobile} className="md:hidden text-slate-400 hover:text-slate-600">
             <Icon name="X" className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 pl-2">Templates</h3>
          </div>
          <nav className="px-2 space-y-1">
            {TEMPLATES.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelect(template);
                  onCloseMobile();
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors
                  ${selectedTemplate.id === template.id 
                    ? 'bg-indigo-50 text-indigo-700' 
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}
                `}
              >
                <Icon name={template.icon} className={`w-5 h-5 ${selectedTemplate.id === template.id ? 'text-indigo-600' : 'text-slate-400'}`} />
                <div className="flex flex-col items-start text-left">
                    <span>{template.name}</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50">
           <p className="text-xs text-slate-400 text-center">Powered by Google Gemini</p>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;
