import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-neu-bg rounded-t-2xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[90vh] overflow-y-auto" style={{boxShadow: '10px 10px 20px #a3b1c6, -10px -10px 20px #ffffff'}}>
        <div className="sticky top-0 bg-neu-bg flex items-center justify-between px-5 sm:px-6 py-4 z-10" style={{boxShadow: '0 4px 8px #a3b1c6, 0 -2px 4px #ffffff'}}>
          <h2 className="text-base sm:text-lg font-bold text-neu-text">{title}</h2>
          <button onClick={onClose} className="neu-btn p-1.5 rounded-xl"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
}