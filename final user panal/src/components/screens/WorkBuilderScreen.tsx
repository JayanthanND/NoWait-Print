import { motion, AnimatePresence } from "motion/react";
import { Plus, Settings2, Trash2, FileText, MoveDown } from "lucide-react";
import { Work } from "../../types";
import { Card } from "../Card";
import { Button } from "../Button";
import { StickyBottomBar } from "../StickyBottomBar";
import { calculateTotalPrice } from "../../utils/pricing";
import { FileChip } from "../FileChip";
import { useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import { useState } from "react";

interface WorkBuilderScreenProps {
  works: Work[];
  onCreateWork: () => void;
  onEditWork: (workId: string) => void;
  onDeleteWork: (workId: string) => void;
  onContinue: () => void;
  onMoveFile: (fileId: string, fromWorkId: string, toWorkId: string) => void;
  onDeleteFile: (workId: string, fileId: string) => void;
}

function WorkCard({
  work,
  index,
  onEditWork,
  onDeleteWork,
  onMoveFile,
  onDeleteFile,
  isDraggingAny,
}: {
  work: Work;
  index: number;
  onEditWork: (workId: string) => void;
  onDeleteWork: (workId: string) => void;
  onMoveFile: (fileId: string, fromWorkId: string, toWorkId: string) => void;
  onDeleteFile: (workId: string, fileId: string) => void;
  isDraggingAny: boolean;
}) {
  const [{ isOver, canDrop }, drop] = useDrop(
    () => ({
      accept: "FILE",
      drop: (item: { fileId: string; workId: string }) => {
        if (item.workId !== work.id) {
          onMoveFile(item.fileId, item.workId, work.id);
        }
      },
      canDrop: (item: { fileId: string; workId: string }) => {
        return item.workId !== work.id;
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      }),
    }),
    [work.id, onMoveFile]
  );

  const showDropZone = isDraggingAny && canDrop;
  const isDropTarget = isOver && canDrop;

  const maxVisibleFiles = 3;
  const visibleFiles = work.files.slice(0, maxVisibleFiles);
  const remainingFiles = work.files.length - maxVisibleFiles;

  return (
    <motion.div
      ref={drop}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ delay: index * 0.05 }}
      className="relative"
    >
      {/* Drop zone highlight overlay */}
      {showDropZone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`absolute inset-0 rounded-2xl border-2 border-dashed pointer-events-none z-10 transition-all duration-200 ${
            isDropTarget
              ? "border-indigo-500 bg-indigo-50/80"
              : "border-indigo-300 bg-indigo-50/40"
          }`}
        >
          {isDropTarget && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg flex items-center gap-2">
                <MoveDown className="w-4 h-4" />
                <span className="text-sm font-medium">Move to Work {index + 1}</span>
              </div>
            </div>
          )}
        </motion.div>
      )}

      <Card elevated>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="mb-1">Work {index + 1}</h3>

            {work.files.length > 0 ? (
              <div className="space-y-3">
                {/* Settings chips - MOVED UP */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    {work.properties.paperSize.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    {work.properties.color ? "Color" : "B&W"}
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    {work.properties.sided === "single" ? "Single" : "Double"} sided
                  </span>
                  <span className="px-2 py-1 bg-gray-100 rounded-md">
                    {work.properties.copies} {work.properties.copies === 1 ? "copy" : "copies"}
                  </span>
                </div>

                {/* Subtle divider */}
                <div className="border-t border-gray-100"></div>

                {/* Files list - MOVED DOWN */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {visibleFiles.map((file) => (
                      <FileChip
                        key={file.id}
                        fileId={file.id}
                        fileName={file.name}
                        workId={work.id}
                        onDelete={() => onDeleteFile(work.id, file.id)}
                      />
                    ))}
                  </AnimatePresence>
                  {remainingFiles > 0 && (
                    <p className="text-xs text-gray-500 px-3">
                      +{remainingFiles} more file{remainingFiles !== 1 ? "s" : ""}
                    </p>
                  )}
                </div>

                {/* Price */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-lg font-bold text-indigo-600">
                    ₹{work.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No files added yet</p>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="secondary"
            size="sm"
            fullWidth
            onClick={() => onEditWork(work.id)}
            icon={<Settings2 className="w-4 h-4" />}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDeleteWork(work.id)}
            icon={<Trash2 className="w-4 h-4 text-red-500" />}
          >
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}

export function WorkBuilderScreen({
  works,
  onCreateWork,
  onEditWork,
  onDeleteWork,
  onContinue,
  onMoveFile,
  onDeleteFile,
}: WorkBuilderScreenProps) {
  const [isDraggingAny, setIsDraggingAny] = useState(false);
  const totalPrice = calculateTotalPrice(works);

  // Detect if touch device for backend selection
  const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
  const backend = isTouchDevice ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backend}>
      <div className="min-h-screen bg-gray-50 pb-32">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
          <h1 className="text-xl">Your Print Works</h1>
          <p className="text-sm text-gray-600 mt-1">
            Drag files between works to reorganize
          </p>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-4 max-w-2xl mx-auto">
          <AnimatePresence>
            {works.map((work, index) => (
              <WorkCard
                key={work.id}
                work={work}
                index={index}
                onEditWork={onEditWork}
                onDeleteWork={onDeleteWork}
                onMoveFile={onMoveFile}
                onDeleteFile={onDeleteFile}
                isDraggingAny={isDraggingAny}
              />
            ))}
          </AnimatePresence>

          {/* Create work button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: works.length * 0.05 }}
          >
            <button
              onClick={onCreateWork}
              className="w-full border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:border-indigo-500 hover:bg-indigo-50/50 transition-all duration-200 group"
            >
              <div className="flex items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <Plus className="w-6 h-6 text-indigo-600" />
                </div>
                <span className="font-semibold text-gray-900">Create New Work</span>
              </div>
            </button>
          </motion.div>

          {works.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">Create your first print work to get started</p>
            </motion.div>
          )}
        </div>

        {/* Sticky bottom bar */}
        {works.length > 0 && (
          <StickyBottomBar price={totalPrice}>
            <Button onClick={onContinue} fullWidth size="lg">
              Review Order
            </Button>
          </StickyBottomBar>
        )}
      </div>
    </DndProvider>
  );
}