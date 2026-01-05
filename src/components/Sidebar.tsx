import { Lock, Upload, X } from 'lucide-react';
import { Location, Language } from '../types';

interface SidebarProps {
  cardNumber: string;
  location: Location;
  language: Language;
  uploadedFile: File | null;
  contextChars: number;
  onLocationChange: (location: Location) => void;
  onLanguageChange: (language: Language) => void;
  onFileUpload: (file: File) => void;
  onFileRemove: () => void;
}

const locations: Location[] = ['IIT Madras Main Gate', 'Chennai Airport', 'Phoenix Mall'];

export default function Sidebar({
  cardNumber,
  location,
  language,
  uploadedFile,
  contextChars,
  onLocationChange,
  onLanguageChange,
  onFileUpload,
  onFileRemove,
}: SidebarProps) {
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      onFileUpload(file);
    }
  };

  return (
    <div className="w-72 bg-slate-900 text-white p-6 flex flex-col h-screen overflow-y-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Lock className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Security & Context Setup</h2>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Masked Visa Number</label>
        <div className="bg-slate-800 px-4 py-3 rounded-lg text-slate-300 font-mono text-sm">
          {cardNumber}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Simulate Location</label>
        <select
          value={location}
          onChange={(e) => onLocationChange(e.target.value as Location)}
          className="w-full bg-slate-800 px-4 py-3 rounded-lg text-white border-none outline-none cursor-pointer"
        >
          {locations.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-4">Language</label>
        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="English"
              checked={language === 'English'}
              onChange={() => onLanguageChange('English')}
              className="w-4 h-4 accent-red-500"
            />
            <span>English</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="language"
              value="Tamil"
              checked={language === 'Tamil'}
              onChange={() => onLanguageChange('Tamil')}
              className="w-4 h-4 accent-red-500"
            />
            <span>Tamil</span>
          </label>
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          Upload Visa PDF Documents
          <span className="block text-xs text-slate-400 font-normal mt-1">(optional)</span>
        </label>

        <div className="border-2 border-dashed border-slate-700 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-slate-500" />
          <p className="text-sm text-slate-400 mb-2">Drag and drop files here</p>
          <p className="text-xs text-slate-500 mb-4">Limit 200MB per file • PDF</p>

          <label className="inline-block">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileSelect}
              className="hidden"
            />
            <span className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg cursor-pointer inline-block text-sm">
              Browse files
            </span>
          </label>
        </div>

        {uploadedFile && (
          <div className="mt-4 bg-slate-800 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-700 rounded flex items-center justify-center">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium truncate max-w-[120px]">{uploadedFile.name}</p>
                <p className="text-xs text-slate-400">{(uploadedFile.size / 1024).toFixed(1)}KB</p>
              </div>
            </div>
            <button
              onClick={onFileRemove}
              className="text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {contextChars > 0 && (
        <div className="mt-auto pt-4 border-t border-slate-800">
          <div className="bg-slate-800/50 px-4 py-3 rounded-lg">
            <p className="text-sm text-green-400">
              Context loaded ({contextChars.toLocaleString()} chars)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
