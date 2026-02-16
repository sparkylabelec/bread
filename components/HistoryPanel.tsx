import React from 'react';
import { GenerationHistoryItem } from '../types';
import { Icon } from './Icon';

interface HistoryPanelProps {
  history: GenerationHistoryItem[];
  onSelectHistory: (item: GenerationHistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectHistory, onClearHistory, onDeleteHistoryItem }) => {
  return (
    <div className="hidden lg:flex flex-col w-72 border-l border-slate-200 bg-white h-full">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-slate-700">
          <Icon name="History" className="w-4 h-4" />
          <span className="font-semibold text-sm">Recent Activity</span>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-xs text-red-500 hover:text-red-600 hover:underline"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="text-center py-10 text-slate-400">
            <Icon name="History" className="w-8 h-8 mx-auto mb-2 opacity-20" />
            <p className="text-sm">No history yet.</p>
          </div>
        ) : (
          history.map((item) => (
            <div 
              key={item.id} 
              className="group relative p-3 rounded-lg border border-slate-100 bg-slate-50 hover:bg-white hover:border-indigo-200 hover:shadow-sm transition-all cursor-pointer"
              onClick={() => onSelectHistory(item)}
            >
              <h4 className="font-medium text-slate-800 text-sm truncate pr-6">{item.title}</h4>
              <p className="text-xs text-slate-500 mt-1 truncate">{new Date(item.timestamp).toLocaleDateString()} • {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteHistoryItem(item.id);
                }}
                className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="Trash2" className="w-3.5 h-3.5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HistoryPanel;
