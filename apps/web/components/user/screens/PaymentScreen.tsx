import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "../Button";

interface PaymentScreenProps {
  amount: number;
  onSuccess: (orderId: string) => void;
  onFailure: () => void;
  shopName?: string;
  upiId?: string;
}

type PaymentState = "pending" | "processing" | "success" | "failure";

export function PaymentScreen({ amount, onSuccess, onFailure, shopName, upiId }: PaymentScreenProps) {
  const [state, setState] = useState<PaymentState>("pending");

  const startPayment = () => {
    setState("processing");
    // Simulate payment processing
    setTimeout(() => {
      // 95% success rate for demo
      const isSuccess = Math.random() > 0.05;
      if (isSuccess) {
        const orderId = `ORD${Date.now().toString().slice(-8)}`;
        setState("success");
        setTimeout(() => onSuccess(orderId), 1500);
      } else {
        setState("failure");
      }
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full">
        {state === "pending" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Scan & Pay</h1>
              <p className="text-gray-500 mt-1">Paying to {shopName || "Print Shop"}</p>
            </div>

            {/* UPI QR Code Placeholder */}
            <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.08)] mb-8 border border-gray-100 flex flex-col items-center">
              <div className="w-48 h-48 bg-gray-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-gray-200 mb-4 overflow-hidden">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=${upiId || "shop@upi"}&pn=${encodeURIComponent(shopName || "Shop")}&am=${amount}&cu=INR`} 
                  alt="UPI QR Code"
                  className="w-full h-full object-contain p-2"
                />
              </div>
              <p className="text-sm font-medium text-gray-700">{upiId || "shop@upi"}</p>
              <div className="mt-6 w-full pt-6 border-t border-gray-50 flex justify-between items-center text-left">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Total Amount</p>
                  <p className="text-2xl font-bold text-indigo-600">₹{amount.toFixed(2)}</p>
                </div>
                <div className="bg-indigo-50 px-3 py-1 rounded-full">
                  <span className="text-xs font-bold text-indigo-600">Secure UPI</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
              <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[10px] font-bold text-white">!</span>
              </div>
              <p className="text-xs text-yellow-800 leading-relaxed">
                Scan the QR code using any UPI app (GPay, PhonePe, Paytm) to pay. Click <strong>"I've Paid"</strong> once your payment is complete.
              </p>
            </div>

            <Button onClick={startPayment} fullWidth size="lg">
              I've Paid
            </Button>
            <button 
              onClick={onFailure}
              className="mt-4 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Cancel Payment
            </button>
          </motion.div>
        )}

        {state === "processing" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-24 h-24 mx-auto mb-6"
            >
              <Loader2 className="w-24 h-24 text-indigo-600" />
            </motion.div>
            <h1 className="mb-2">Verifying Payment</h1>
            <p className="text-gray-600 mb-4">Please wait while we confirm your payment</p>
          </motion.div>
        )}

        {state === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
            >
              <CheckCircle className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="mb-2 text-green-600 font-bold">Payment Confirmed!</h1>
            <p className="text-gray-600">Your order has been placed successfully.</p>
          </motion.div>
        )}

        {state === "failure" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center"
            >
              <XCircle className="w-16 h-16 text-white" />
            </motion.div>
            <h1 className="mb-2 text-red-600">Payment Failed</h1>
            <p className="text-gray-600 mb-6">
              There was an issue processing your payment. Please try again.
            </p>
            <Button onClick={onFailure} fullWidth>
              Try Again
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
