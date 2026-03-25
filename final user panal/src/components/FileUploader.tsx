import { Upload, File, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useRef } from "react";

interface FileItem {
  id: string;
  name: string;
  size: number;
}

interface FileUploaderProps {
  files: FileItem[];
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (id: string) => void;
}

export function FileUploader({ files, onFilesAdd, onFileRemove }: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      onFilesAdd(selectedFiles);
    }
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        multiple
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        onClick={() => inputRef.current?.click()}
        className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-200 group"
      >
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
            <Upload className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Upload files</p>
            <p className="text-sm text-gray-500 mt-1">PDF, DOC, TXT, or images</p>
          </div>
        </div>
      </button>

      <AnimatePresence>
        {files.map((file) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
              <File className="w-5 h-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-gray-900 truncate">{file.name}</p>
              <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={() => onFileRemove(file.id)}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
