"use client";

import { motion } from "motion/react";
import { CheckCircle, MapPin, Phone } from "lucide-react";
import { Button } from "../Button";
import { Card } from "../Card";
import { StatusTracker } from "../StatusTracker";

interface ConfirmationScreenProps {
  orderId: string;
  onDone: () => void;
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
}

export function ConfirmationScreen({
  orderId,
  onDone,
  shopName,
  shopAddress,
  shopPhone
}: ConfirmationScreenProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-green-50 via-emerald-50 to-white px-6 pt-12 pb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-2xl"
        >
          <CheckCircle className="w-14 h-14 text-white" />
        </motion.div>

        <h1 className="mb-3 text-green-600">Order Confirmed!</h1>
        <p className="text-gray-600 text-lg mb-6">
          Your documents are being processed
        </p>

        <div className="inline-block bg-white rounded-2xl px-6 py-3 shadow-lg">
          <p className="text-sm text-gray-600 mb-1">Order ID</p>
          <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {orderId}
          </p>
        </div>
      </motion.div>

      {/* Content */}
      <div className="px-6 py-6 space-y-6 max-w-2xl mx-auto pb-32">
        {/* Status Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <h2 className="mb-4">Order Status</h2>
            <StatusTracker currentStatus="accepted" />
          </Card>
        </motion.div>

        {/* Pickup Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <h2 className="mb-4">Pickup Details</h2>

            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm mb-1">Location</h3>
                  <p className="text-sm text-gray-600">
                    {shopName || "PrintHub Express"}<br />
                    {shopAddress || "Shop 12, Ground Floor"}<br />
                    {shopAddress ? "" : "College Campus, Main Gate"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm mb-1">Contact</h3>
                  <p className="text-sm text-gray-600">
                    {shopPhone || "+91 98765 43210"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="bg-blue-50 rounded-xl p-4">
                <p className="text-sm text-blue-900 font-medium mb-1">
                  Estimated Ready Time
                </p>
                <p className="text-lg font-bold text-blue-600">
                  15-30 minutes
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Important Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <h3 className="mb-3">Important Notes</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-indigo-600 flex-shrink-0">•</span>
                <span>Please bring your Order ID for pickup</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 flex-shrink-0">•</span>
                <span>You'll receive an SMS when your order is ready</span>
              </li>
              <li className="flex gap-2">
                <span className="text-indigo-600 flex-shrink-0">•</span>
                <span>Collect within 24 hours to avoid cancellation</span>
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Action */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-6 shadow-2xl">
        <div className="max-w-2xl mx-auto">
          <Button onClick={onDone} fullWidth size="lg">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
}
