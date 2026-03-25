import { motion } from "motion/react";
import { File, GripVertical, X } from "lucide-react";
import { useDrag } from "react-dnd";

interface FileChipProps {
  fileId: string;
  fileName: string;
  workId: string;
  onDelete: (fileId: string) => void;
}

export function FileChip({ fileId, fileName, workId, onDelete }: FileChipProps) {
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: "FILE",
      item: { fileId, workId, fileName },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }),
    [fileId, workId]
  );

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(fileId);
  };

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: isDragging ? 0.5 : 1, scale: 1 }}
      className={`flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm border border-gray-200 cursor-move touch-none select-none transition-all group ${
        isDragging ? "shadow-lg border-indigo-300" : ""
      }`}
      style={{ touchAction: "none" }}
    >
      <GripVertical className="w-3 h-3 text-gray-400 flex-shrink-0" />
      <File className="w-4 h-4 text-indigo-600 flex-shrink-0" />
      <span className="text-gray-900 truncate flex-1 min-w-0">{fileName}</span>
      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-50 rounded"
      >
        <X className="w-3.5 h-3.5 text-red-500" />
      </button>
    </motion.div>
  );
}