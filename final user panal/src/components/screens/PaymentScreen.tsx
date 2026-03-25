import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "../Button";

interface PaymentScreenProps {
  amount: number;
  onSuccess: (orderId: string) => void;
  onFailure: () => void;
}

type PaymentState = "processing" | "success" | "failure";

export function PaymentScreen({ amount, onSuccess, onFailure }: PaymentScreenProps) {
  const [state, setState] = useState<PaymentState>("processing");

  useEffect(() => {
    // Simulate payment processing
    const timer = setTimeout(() => {
      // 90% success rate for demo
      const isSuccess = Math.random() > 0.1;
      if (isSuccess) {
        const orderId = `ORD${Date.now().toString().slice(-8)}`;
        setState("success");
        setTimeout(() => onSuccess(orderId), 1500);
      } else {
        setState("failure");
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onSuccess]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
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
            <h1 className="mb-2">Processing Payment</h1>
            <p className="text-gray-600 mb-4">Please wait while we process your payment</p>
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Amount</span>
                <span className="text-2xl font-bold text-indigo-600">
                  ₹{amount.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Do not close this window
            </p>
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
            <h1 className="mb-2 text-green-600">Payment Successful!</h1>
            <p className="text-gray-600">Redirecting to confirmation...</p>
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
