import { motion } from "motion/react";
import { Phone, Printer } from "lucide-react";
import { Button } from "../Button";
import { Input } from "../Input";
import { useState } from "react";

interface WelcomeScreenProps {
  onContinue: (phone: string) => void;
  shopName?: string;
}

export function WelcomeScreen({ onContinue, shopName }: WelcomeScreenProps) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleContinue = () => {
    // Basic validation
    if (phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    setError("");
    onContinue(phone);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero gradient header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-b from-blue-50 via-indigo-50 to-white px-6 pt-12 pb-8 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl"
        >
          <Printer className="w-10 h-10 text-white" />
        </motion.div>
        
        <h1 className="mb-3">{shopName || "PrintHub Express"}</h1>
        <p className="text-gray-600 text-lg">Upload documents to print</p>
      </motion.div>

      {/* Main content */}
      <div className="flex-1 px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-md mx-auto space-y-6"
        >
          <div>
            <h2 className="mb-2">Get started</h2>
            <p className="text-gray-600">Enter your phone number to begin your order</p>
          </div>

          <Input
            label="Phone Number"
            type="tel"
            placeholder="Enter 10-digit number"
            value={phone}
            onChange={(value) => {
              setPhone(value.replace(/\D/g, "").slice(0, 10));
              setError("");
            }}
            error={error}
            icon={<Phone className="w-5 h-5" />}
            maxLength={10}
          />

          <div className="pt-4">
            <Button onClick={handleContinue} fullWidth size="lg">
              Continue
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy. 
            Your documents are processed securely and deleted after printing.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
