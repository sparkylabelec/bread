import React, { useState, useEffect } from 'react';
import TemplateSelector from './components/TemplateSelector';
import HistoryPanel from './components/HistoryPanel';
import { TEMPLATES, GEMINI_FLASH_MODEL, GEMINI_PRO_MODEL } from './constants';
import { WritingTemplate, GenerationHistoryItem } from './types';
import { streamGeneratedContent } from './services/geminiService';
import { Icon } from './components/Icon';

const App: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState<WritingTemplate>(TEMPLATES[0]);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [history, setHistory] = useState<GenerationHistoryItem[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedModel, setSelectedModel] = useState<string>(GEMINI_FLASH_MODEL);
  const [error, setError] = useState<string | null>(null);

  // Initialize form data when template changes
  useEffect(() => {
    const initialData: Record<string, string> = {};
    selectedTemplate.fields.forEach(field => {
      initialData[field.id] = field.defaultValue || '';
    });
    setFormData(initialData);
    setGeneratedContent('');
    setError(null);
  }, [selectedTemplate]);

  // Load history from local storage
  useEffect(() => {
    const savedHistory = localStorage.getItem('inkflow_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('inkflow_history', JSON.stringify(history));
  }, [history]);

  const handleInputChange = (id: string, value: string) => {
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedContent('');
    setError(null);

    try {
      const fullContent = await streamGeneratedContent(
        {
          template: selectedTemplate,
          formData,
          modelName: selectedModel
        },
        (chunk) => {
            setGeneratedContent(chunk);
        }
      );

      // Add to history after completion
      const newItem: GenerationHistoryItem = {
        id: crypto.randomUUID(),
        templateId: selectedTemplate.id,
        title: formData[Object.keys(formData)[0]] || selectedTemplate.name, // Use first field as title
        content: fullContent,
        timestamp: Date.now()
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (err: any) {
        console.error(err);
      setError(err.message || "Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (generatedContent) {
      await navigator.clipboard.writeText(generatedContent);
      // Optional: Show toast
    }
  };

  const loadHistoryItem = (item: GenerationHistoryItem) => {
    const template = TEMPLATES.find(t => t.id === item.templateId);
    if (template) {
      setSelectedTemplate(template);
      setGeneratedContent(item.content);
      // We don't restore exact form data because we don't save it, but we restore the view
    }
  };

  const deleteHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  const clearHistory = () => setHistory([]);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Mobile Sidebar Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Left Sidebar */}
      <TemplateSelector 
        selectedTemplate={selectedTemplate} 
        onSelect={setSelectedTemplate}
        isOpen={isSidebarOpen}
        onCloseMobile={() => setIsSidebarOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* Header (Mobile only mainly) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-md md:hidden"
            >
              <Icon name="Menu" className="w-6 h-6" />
            </button>
            <div>
               <h1 className="text-lg font-semibold text-slate-800">{selectedTemplate.name}</h1>
               <p className="hidden sm:block text-xs text-slate-500">{selectedTemplate.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 hidden sm:inline">Model:</span>
              <select 
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs sm:text-sm rounded-md focus:ring-indigo-500 focus:border-indigo-500 block p-1.5"
              >
                  <option value={GEMINI_FLASH_MODEL}>Flash (Fast)</option>
                  <option value={GEMINI_PRO_MODEL}>Pro (Smart)</option>
              </select>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          
          {/* Input Form Section */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="max-w-3xl mx-auto space-y-6">
              
              <form onSubmit={handleGenerate} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-5">
                {selectedTemplate.fields.map((field) => (
                  <div key={field.id}>
                    <label htmlFor={field.id} className="block text-sm font-medium text-slate-700 mb-1">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        id={field.id}
                        required
                        rows={5}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    ) : field.type === 'select' ? (
                      <select
                        id={field.id}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm bg-white"
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      >
                         {field.options?.map(opt => (
                           <option key={opt} value={opt}>{opt}</option>
                         ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        id={field.id}
                        required
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                        placeholder={field.placeholder}
                        value={formData[field.id] || ''}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                {error && (
                  <div className="p-3 bg-red-50 text-red-600 text-sm rounded-md border border-red-100">
                    {error}
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isGenerating}
                    className={`
                      w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white 
                      transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                      ${isGenerating ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-md'}
                    `}
                  >
                    {isGenerating ? (
                      <>
                        <Icon name="Loader2" className="animate-spin -ml-1 mr-2 h-4 w-4" />
                        Generating Magic...
                      </>
                    ) : (
                      <>
                        <Icon name="Sparkles" className="-ml-1 mr-2 h-4 w-4" />
                        Generate Content
                      </>
                    )}
                  </button>
                </div>
              </form>

            </div>
          </div>

          {/* Output Section */}
          <div className="flex-1 border-t md:border-t-0 md:border-l border-slate-200 bg-white flex flex-col h-[50vh] md:h-auto">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h2 className="text-sm font-semibold text-slate-700">Generated Result</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  disabled={!generatedContent}
                  className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors disabled:opacity-50"
                  title="Copy to clipboard"
                >
                  <Icon name="Copy" className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-6 overflow-y-auto bg-white">
               {!generatedContent && !isGenerating ? (
                 <div className="h-full flex flex-col items-center justify-center text-slate-300 space-y-3">
                    <Icon name="PenTool" className="w-12 h-12 stroke-[1.5]" />
                    <p className="text-sm">Ready to write. Fill out the form to start.</p>
                 </div>
               ) : (
                 <div className="prose prose-sm prose-slate max-w-none">
                    <div className="whitespace-pre-wrap leading-relaxed text-slate-800">
                      {generatedContent}
                      {isGenerating && <span className="inline-block w-2 h-4 ml-1 bg-indigo-500 animate-pulse align-middle"></span>}
                    </div>
                 </div>
               )}
            </div>
          </div>
          
        </div>

      </div>

      {/* History Panel (Right Side) */}
      <HistoryPanel 
        history={history}
        onSelectHistory={loadHistoryItem}
        onClearHistory={clearHistory}
        onDeleteHistoryItem={deleteHistoryItem}
      />

    </div>
  );
};

export default App;
