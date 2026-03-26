"use client";

import { motion } from "motion/react";
import { FileText, Layers } from "lucide-react";
import { WorkProperties, FileItem } from "@/lib/types";

interface DocumentPreviewProps {
  files: FileItem[];
  properties: WorkProperties;
}

export function DocumentPreview({ files, properties }: DocumentPreviewProps) {
  const isPortrait = properties.orientation === "portrait";
  const isColor = properties.color;
  const isDoubleSided = properties.sided === "double";
  
  // Calculate paper aspect ratios
  const aspectRatios: Record<string, number> = {
    a4: isPortrait ? 1.414 : 0.707, // A4: 210x297mm
    a3: isPortrait ? 1.414 : 0.707, // A3: 297x420mm (same ratio)
    letter: isPortrait ? 1.294 : 0.773, // Letter: 8.5x11"
    legal: isPortrait ? 1.647 : 0.607, // Legal: 8.5x14"
  };

  const aspectRatio = aspectRatios[properties.paperSize] || 1.414;

  // Estimate pages per file (5 pages average)
  const pagesPerFile = 5;
  const totalPages = files.length * pagesPerFile;
  const maxPreviewPages = 6; // Show first 6 pages

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-700">Document Preview</h3>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Layers className="w-3.5 h-3.5" />
          <span>{totalPages} pages total</span>
        </div>
      </div>

      {/* Preview Grid */}
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: Math.min(maxPreviewPages, totalPages) }).map((_, index) => {
          const fileIndex = Math.floor(index / pagesPerFile);
          const pageInFile = (index % pagesPerFile) + 1;
          const currentFile = files[fileIndex];

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <PagePreview
                pageNumber={index + 1}
                fileName={currentFile?.name || "Document"}
                pageInFile={pageInFile}
                aspectRatio={aspectRatio}
                isColor={isColor}
                isDoubleSided={isDoubleSided}
                paperSize={properties.paperSize.toUpperCase()}
              />
            </motion.div>
          );
        })}
      </div>

      {totalPages > maxPreviewPages && (
        <div className="text-center py-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            +{totalPages - maxPreviewPages} more pages
          </p>
        </div>
      )}

      {/* Print Settings Summary */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
        <div className="flex flex-wrap gap-2 text-xs">
          <Badge>{properties.paperSize.toUpperCase()}</Badge>
          <Badge>{isColor ? "Color" : "Black & White"}</Badge>
          <Badge>{isDoubleSided ? "Double Sided" : "Single Sided"}</Badge>
          <Badge>{isPortrait ? "Portrait" : "Landscape"}</Badge>
          <Badge>{properties.copies}x Copies</Badge>
        </div>
      </div>
    </div>
  );
}

function PagePreview({
  pageNumber,
  fileName,
  pageInFile,
  aspectRatio,
  isColor,
  isDoubleSided,
  paperSize,
}: {
  pageNumber: number;
  fileName: string;
  pageInFile: number;
  aspectRatio: number;
  isColor: boolean;
  isDoubleSided: boolean;
  paperSize: string;
}) {
  return (
    <div className="relative group">
      {/* Paper Sheet */}
      <div
        className="relative bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
        style={{ aspectRatio: aspectRatio.toString() }}
      >
        {/* Page Content Mockup */}
        <div className="absolute inset-0 p-3 flex flex-col">
          {/* Header Lines */}
          <div className="space-y-1.5 mb-3">
            <div className={`h-1.5 rounded ${isColor ? "bg-gradient-to-r from-blue-400 to-indigo-400" : "bg-gray-300"} w-3/4`}></div>
            <div className={`h-1 rounded ${isColor ? "bg-gradient-to-r from-purple-300 to-pink-300" : "bg-gray-200"} w-1/2`}></div>
          </div>

          {/* Content Lines */}
          <div className="space-y-1 flex-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className={`h-0.5 rounded ${isColor ? "bg-gray-400" : "bg-gray-200"}`}
                style={{ width: `${Math.random() * 30 + 60}%` }}
              ></div>
            ))}
          </div>

          {/* Image Placeholder (50% chance on color prints) */}
          {isColor && pageInFile <= 2 && (
            <div className="mt-2 h-12 rounded bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 opacity-60"></div>
          )}
        </div>

        {/* Double-sided indicator */}
        {isDoubleSided && (
          <div className="absolute top-1 right-1">
            <div className="w-4 h-4 bg-indigo-600 rounded-full flex items-center justify-center">
              <Layers className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        )}

        {/* Page Number Badge */}
        <div className="absolute bottom-1 right-1">
          <div className="bg-gray-900/80 text-white text-[10px] px-1.5 py-0.5 rounded">
            {pageNumber}
          </div>
        </div>
      </div>

      {/* Hover Info */}
      <div className="mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <p className="text-[10px] text-gray-600 truncate">{fileName}</p>
        <p className="text-[9px] text-gray-500">Page {pageInFile} • {paperSize}</p>
      </div>

      {/* Stacked paper effect for multiple copies */}
      <div className="absolute -bottom-0.5 -right-0.5 w-full h-full bg-white rounded-lg border border-gray-200 -z-10"></div>
      <div className="absolute -bottom-1 -right-1 w-full h-full bg-gray-50 rounded-lg border border-gray-200 -z-20"></div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 bg-white border border-gray-200 rounded-md text-gray-700">
      {children}
    </span>
  );
}
