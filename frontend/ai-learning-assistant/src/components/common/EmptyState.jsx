import React from 'react';
import { FileText, Plus } from 'lucide-react';

const EmptyState = ({ onActionClick, title, description, buttonText }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-linear-to-br from-slate-50/50 via-white to-slate-50/30 border-2 border-dashed border-slate-200 rounded-3xl mb-6">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-slate-100 to-slate-200/50 mb-4">
        <FileText className="w-8 h-8 text-slate-400" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-semibold text-slate-900 mb-2">{title}</h3>
      <p className="text-sm text-slate-500 mb-8 max-w-sm leading-relaxed">{description}</p>
      
      {buttonText && onActionClick && (
        <button
          onClick={onActionClick}
          className="group relative inline-flex items-center gap-2 px-6 h-11 bg-linear-to-r from-emerald-500 hover:to-teal-600 text-white font-semibold text-sm rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 cursor-pointer overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            {buttonText}
          </span>
          <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        </button>
      )}
    </div>
  );
};

export default EmptyState;