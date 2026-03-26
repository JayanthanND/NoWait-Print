"use client";

import { useState, useEffect } from "react";
import { BottomSheet } from "../BottomSheet";
import { DropdownWithPrice } from "../DropdownWithPrice";
import { ToggleWithPrice } from "../ToggleWithPrice";
import { SegmentedControlWithPrice } from "../SegmentedControlWithPrice";
import { Stepper } from "../Stepper";
import { Button } from "../Button";
import { FileUploader } from "../FileUploader";
import { DocumentPreview } from "../DocumentPreview";
import { 
  Work, 
  WorkProperties, 
  PAPER_SIZES, 
  PAPER_TYPES, 
  GSM_OPTIONS, 
  BINDING_OPTIONS, 
  FileItem 
} from "@/lib/types";
import { 
  calculateWorkPrice, 
  calculateOptionPrice 
} from "@/lib/user-utils/pricing";
import { motion, AnimatePresence } from "motion/react";
import { FileText, ChevronRight } from "lucide-react";

interface WorkPropertiesModalProps {
  work: Work | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (workId: string, files: FileItem[], properties: WorkProperties) => void;
  initialPricingRules?: any[];
  initialBindingOptions?: any[];
}

export function WorkPropertiesModal({ 
  work, 
  isOpen, 
  onClose, 
  onSave,
  initialPricingRules = [],
  initialBindingOptions = []
}: WorkPropertiesModalProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [properties, setProperties] = useState<WorkProperties>(work?.properties || {
    paperSize: "a4",
    color: false,
    sided: "single",
    copies: 1,
    orientation: "portrait",
    paperType: "regular",
    gsm: "80",
    binding: "none",
    notes: "",
  });
  const [showPreview, setShowPreview] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (work) {
      setFiles(work.files);
      setProperties(work.properties);
      setShowPreview(false); // Reset preview when opening
    }
  }, [work]);

  const handleFilesAdd = async (newFiles: File[]) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      newFiles.forEach((file) => formData.append("files", file));

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      
      const { files: uploadedFiles } = await response.json();
      
      const fileItems: FileItem[] = uploadedFiles.map((uf: any) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: uf.originalName,
        size: uf.size,
        pageCount: uf.pageCount,
        storagePath: uf.path,
      }));
      setFiles((prev) => [...prev, ...fileItems]);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload files. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileRemove = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const updateProperty = <K extends keyof WorkProperties>(
    key: K,
    value: WorkProperties[K]
  ) => {
    setProperties({ ...properties, [key]: value });
  };

  const currentWork = { ...work!, files, properties };
  const currentPrice = calculateWorkPrice(currentWork, initialPricingRules, initialBindingOptions);

  // Calculate prices for each option dynamically based on rules
  const paperSizeOptions = PAPER_SIZES.map((size) => ({
    value: size.value,
    label: size.label,
    price: calculateOptionPrice(currentWork, "paperSize", size.value, initialPricingRules, initialBindingOptions),
  })).filter(opt => {
    // Optional: Filter out sizes that have NO rule defined for this shop
    return initialPricingRules.some(r => r.page_size === opt.value.toUpperCase());
  });

  const paperTypeOptions = PAPER_TYPES.map((type) => ({
    value: type.value,
    label: type.label,
    price: calculateOptionPrice(currentWork, "paperType", type.value, initialPricingRules, initialBindingOptions),
  }));

  const gsmOptions = GSM_OPTIONS.map((gsm) => ({
    value: gsm.value,
    label: gsm.label,
    price: calculateOptionPrice(currentWork, "gsm", gsm.value, initialPricingRules, initialBindingOptions),
  }));

  const bindingOptions = initialBindingOptions.map((binding: any) => ({
    value: binding.name.toLowerCase(),
    label: binding.name,
    price: calculateOptionPrice(currentWork, "binding", binding.name.toLowerCase(), initialPricingRules, initialBindingOptions),
  }));
  
  // Ensure "No Binding" is always an option if not in DB
  if (!bindingOptions.some(b => b.value === 'none')) {
    bindingOptions.unshift({ value: 'none', label: 'No Binding', price: 0 });
  }

  const sidedOptions = [
    {
      value: "single",
      label: "Single",
      price: calculateOptionPrice(currentWork, "sided", "single", initialPricingRules, initialBindingOptions),
    },
    {
      value: "double",
      label: "Double",
      price: calculateOptionPrice(currentWork, "sided", "double", initialPricingRules, initialBindingOptions),
    },
  ];

  const orientationOptions = [
    {
      value: "portrait",
      label: "Portrait",
      price: calculateOptionPrice(currentWork, "orientation", "portrait"),
    },
    {
      value: "landscape",
      label: "Landscape",
      price: calculateOptionPrice(currentWork, "orientation", "landscape"),
    },
  ];

  const colorOffPrice = calculateOptionPrice(currentWork, "color", false, initialPricingRules, initialBindingOptions);
  const colorOnPrice = calculateOptionPrice(currentWork, "color", true, initialPricingRules, initialBindingOptions);

  const handleContinueToPreview = () => {
    setShowPreview(true);
  };

  const handleBackToEdit = () => {
    setShowPreview(false);
  };

  const handleSave = () => {
    if (work) {
      onSave(work.id, files, properties);
      onClose();
    }
  };

  if (!work) return null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={showPreview ? "Preview Your Work" : "Configure Work"}
    >
      <AnimatePresence mode="wait">
        {!showPreview ? (
          <motion.div
            key="config"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            {/* File Upload Section */}
            <div>
              <h3 className="mb-3">Documents</h3>
              <FileUploader
                files={files}
                onFilesAdd={handleFilesAdd}
                onFileRemove={handleFileRemove}
              />
            </div>

            {/* Print Settings */}
            <div className="space-y-4">
              <h3 className="mb-3">Print Settings</h3>

              <DropdownWithPrice
                label="Paper Size"
                value={properties.paperSize}
                onChange={(value) => updateProperty("paperSize", value)}
                options={paperSizeOptions}
              />

              <div className="bg-gray-50 rounded-xl p-4 space-y-4">
                <ToggleWithPrice
                  label="Color Printing"
                  enabled={properties.color}
                  onChange={(value) => updateProperty("color", value)}
                  offPrice={colorOffPrice}
                  onPrice={colorOnPrice}
                />

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sides
                  </label>
                  <SegmentedControlWithPrice
                    options={sidedOptions}
                    value={properties.sided}
                    onChange={(value) => updateProperty("sided", value as "single" | "double")}
                  />
                </div>

                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Orientation
                  </label>
                  <SegmentedControlWithPrice
                    options={orientationOptions}
                    value={properties.orientation}
                    onChange={(value) => updateProperty("orientation", value as "portrait" | "landscape")}
                  />
                </div>

                <Stepper
                  label="Copies"
                  value={properties.copies}
                  onChange={(value) => updateProperty("copies", value)}
                  min={1}
                  max={100}
                />
              </div>

              <DropdownWithPrice
                label="Paper Type"
                value={properties.paperType}
                onChange={(value) => updateProperty("paperType", value)}
                options={paperTypeOptions}
              />

              <DropdownWithPrice
                label="Paper Weight (GSM)"
                value={properties.gsm}
                onChange={(value) => updateProperty("gsm", value)}
                options={gsmOptions}
              />

              <DropdownWithPrice
                label="Binding"
                value={properties.binding}
                onChange={(value) => updateProperty("binding", value)}
                options={bindingOptions}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Special Notes (Optional)
                </label>
                <textarea
                  value={properties.notes}
                  onChange={(e) => updateProperty("notes", e.target.value)}
                  placeholder="Any special instructions..."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-base resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                  rows={3}
                />
              </div>
            </div>

            {/* Price Preview */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Estimated Price</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ₹{currentPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Based on ~5 pages per file
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <Button variant="secondary" onClick={onClose} fullWidth>
                Cancel
              </Button>
              <Button
                onClick={handleContinueToPreview}
                fullWidth
                disabled={files.length === 0 || isUploading}
                icon={<ChevronRight className="w-4 h-4" />}
              >
                {isUploading ? "Uploading..." : "Preview"}
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6 pb-24"
          >
            {/* Document Visual Preview */}
            <DocumentPreview files={files} properties={properties} />

            {/* Divider */}
            <div className="border-t border-gray-200"></div>

            {/* Files Preview */}
            <div>
              <h3 className="mb-3">Documents ({files.length})</h3>
              <div className="space-y-2">
                {files.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-200"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Properties Preview */}
            <div>
              <h3 className="mb-3">Print Configuration</h3>
              <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
                <PreviewRow label="Paper Size" value={paperSizeOptions.find(o => o.value === properties.paperSize)?.label || ""} />
                <PreviewRow label="Color" value={properties.color ? "Color" : "Black & White"} />
                <PreviewRow label="Sides" value={properties.sided === "single" ? "Single Sided" : "Double Sided"} />
                <PreviewRow label="Orientation" value={properties.orientation === "portrait" ? "Portrait" : "Landscape"} />
                <PreviewRow label="Copies" value={`${properties.copies} ${properties.copies === 1 ? "copy" : "copies"}`} />
                <PreviewRow label="Paper Type" value={paperTypeOptions.find(o => o.value === properties.paperType)?.label || ""} />
                <PreviewRow label="Paper Weight" value={gsmOptions.find(o => o.value === properties.gsm)?.label || ""} />
                <PreviewRow label="Binding" value={bindingOptions.find(o => o.value === properties.binding)?.label || ""} />
                {properties.notes && (
                  <div className="p-4">
                    <p className="text-sm text-gray-600 mb-1">Special Notes</p>
                    <p className="text-sm text-gray-900">{properties.notes}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Total Price */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">Total Price</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  ₹{currentPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {files.length} file{files.length !== 1 ? "s" : ""} × ~5 pages × {properties.copies} {properties.copies === 1 ? "copy" : "copies"}
              </p>
            </div>

            {/* Back Button */}
            <div className="pt-2">
              <Button variant="secondary" onClick={handleBackToEdit} fullWidth>
                Back to Edit
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Save Button (only shows in preview) */}
      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-lg z-50"
          >
            <Button onClick={handleSave} fullWidth size="lg">
              Save Work
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </BottomSheet>
  );
}

function PreviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between p-4">
      <span className="text-sm text-gray-600">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}