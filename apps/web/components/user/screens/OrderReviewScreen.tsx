import { motion } from "motion/react";
import { Work } from "@/lib/types";
import { Card } from "../Card";
import { Button } from "../Button";
import { StickyBottomBar } from "../StickyBottomBar";
import { calculateTotalPrice } from "@/lib/user-utils/pricing";
import { FileText, ChevronLeft, CreditCard } from "lucide-react";

interface OrderReviewScreenProps {
  works: Work[];
  onBack: () => void;
  onConfirm: () => void;
}

export function OrderReviewScreen({ works, onBack, onConfirm }: OrderReviewScreenProps) {
  const totalPrice = calculateTotalPrice(works);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors -ml-2"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl">Review Order</h1>
            <p className="text-sm text-gray-600">Verify before payment</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto">
        {/* Order summary */}
        <div>
          <h2 className="mb-4">Order Summary</h2>
          <div className="space-y-3">
            {works.map((work, index) => (
              <motion.div
                key={work.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-white" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm mb-2">Work {index + 1}</h3>
                      
                      <div className="space-y-1 text-sm text-gray-600">
                        <div className="flex justify-between">
                          <span>Files:</span>
                          <span className="font-medium text-gray-900">{work.files.length}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Size:</span>
                          <span className="font-medium text-gray-900">
                            {work.properties.paperSize.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Type:</span>
                          <span className="font-medium text-gray-900">
                            {work.properties.color ? "Color" : "Black & White"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Sides:</span>
                          <span className="font-medium text-gray-900">
                            {work.properties.sided === "single" ? "Single" : "Double"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Copies:</span>
                          <span className="font-medium text-gray-900">
                            {work.properties.copies}
                          </span>
                        </div>
                        {work.properties.binding !== "none" && (
                          <div className="flex justify-between">
                            <span>Binding:</span>
                            <span className="font-medium text-gray-900 capitalize">
                              {work.properties.binding}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-600">Subtotal</span>
                        <span className="font-bold text-indigo-600">
                          ₹{work.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div>
          <h2 className="mb-4">Payment Method</h2>
          <Card>
            <div className="flex items-center gap-3 py-2">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm mb-1">UPI Payment</h3>
                <p className="text-xs text-gray-500">Pay with any UPI app</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Price breakdown */}
        <Card>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-600">
              <span>Items ({works.length} work{works.length !== 1 ? 's' : ''})</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Processing Fee</span>
              <span>₹0.00</span>
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
              <span className="font-semibold text-lg">Total</span>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                ₹{totalPrice.toFixed(2)}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Sticky bottom bar */}
      <StickyBottomBar>
        <Button onClick={onConfirm} fullWidth size="lg">
          Proceed to Payment
        </Button>
      </StickyBottomBar>
    </div>
  );
}
