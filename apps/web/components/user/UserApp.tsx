"use client";

import { useState } from "react";
import { WelcomeScreen } from "./screens/WelcomeScreen";
import { WorkBuilderScreen } from "./screens/WorkBuilderScreen";
import { WorkPropertiesModal } from "./screens/WorkPropertiesModal";
import { OrderReviewScreen } from "./screens/OrderReviewScreen";
import { PaymentScreen } from "./screens/PaymentScreen";
import { ConfirmationScreen } from "./screens/ConfirmationScreen";
import { Work, WorkProperties, FileItem, DEFAULT_PROPERTIES } from "@/lib/types";
import { calculateWorkPrice, calculateTotalPrice } from "@/lib/user-utils/pricing";

type Screen = "welcome" | "builder" | "review" | "payment" | "confirmation";

export default function App({ 
  shopId, 
  shopName, 
  shopAddress, 
  shopPhone,
  shopSettings,
  upiId,
  initialPricingRules = [],
  initialBindingOptions = []
}: { 
  shopId?: string; 
  shopName?: string;
  shopAddress?: string;
  shopPhone?: string;
  shopSettings?: any;
  upiId?: string;
  initialPricingRules?: any[];
  initialBindingOptions?: any[];
}) {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [orderId, setOrderId] = useState("");

  const handleWelcomeContinue = (phone: string) => {
    setPhoneNumber(phone);
    setCurrentScreen("builder");
  };

  const handleCreateWork = () => {
    const newWork: Work = {
      id: Math.random().toString(36).substr(2, 9),
      files: [],
      properties: { ...DEFAULT_PROPERTIES },
      price: 0,
    };
    setWorks([...works, newWork]);
    setEditingWork(newWork);
  };

  const handleEditWork = (workId: string) => {
    const work = works.find((w) => w.id === workId);
    if (work) {
      setEditingWork(work);
    }
  };

  const handleDeleteWork = (workId: string) => {
    setWorks(works.filter((w) => w.id !== workId));
  };

  const handleMoveFile = (fileId: string, fromWorkId: string, toWorkId: string) => {
    // Find the file in the source work
    const sourceWork = works.find((w) => w.id === fromWorkId);
    const fileToMove = sourceWork?.files.find((f) => f.id === fileId);
    
    if (!fileToMove) return;

    // Update works: remove file from source, add to destination
    setWorks(
      works.map((w) => {
        if (w.id === fromWorkId) {
          // Remove file from source work
          const updatedWork = {
            ...w,
            files: w.files.filter((f) => f.id !== fileId),
          };
          updatedWork.price = calculateWorkPrice(updatedWork, initialPricingRules, initialBindingOptions);
          return updatedWork;
        } else if (w.id === toWorkId) {
          // Add file to destination work (inherits destination's settings)
          const updatedWork = {
            ...w,
            files: [...w.files, fileToMove],
          };
          updatedWork.price = calculateWorkPrice(updatedWork, initialPricingRules, initialBindingOptions);
          return updatedWork;
        }
        return w;
      })
    );
  };

  const handleDeleteFile = (workId: string, fileId: string) => {
    setWorks(
      works.map((w) => {
        if (w.id === workId) {
          const updatedWork = {
            ...w,
            files: w.files.filter((f) => f.id !== fileId),
          };
          updatedWork.price = calculateWorkPrice(updatedWork, initialPricingRules, initialBindingOptions);
          return updatedWork;
        }
        return w;
      })
    );
  };

  const handleSaveWork = (workId: string, files: FileItem[], properties: WorkProperties) => {
    setWorks(
      works.map((w) => {
        if (w.id === workId) {
          const updatedWork = { ...w, files, properties };
          updatedWork.price = calculateWorkPrice(updatedWork, initialPricingRules, initialBindingOptions);
          return updatedWork;
        }
        return w;
      })
    );
    setEditingWork(null);
  };

  const handleReviewOrder = () => {
    setCurrentScreen("review");
  };

  const handleBackToBuilder = () => {
    setCurrentScreen("builder");
  };

  const handleProceedToPayment = () => {
    setCurrentScreen("payment");
  };

  const handlePaymentSuccess = async (paymentMethod: string = "upi") => {
    try {
      // Create the order payload connecting all works and their files
      const payload = {
        shopId: shopId,
        mobile: phoneNumber,
        totalAmount: calculateTotalPrice(works),
        paymentMethod: paymentMethod,
        works: works.map((w) => ({
          pageSize: w.properties.paperSize,
          colorType: w.properties.color ? "COLOR" : "BW",
          printSide: w.properties.sided.toUpperCase(),
          copies: w.properties.copies,
          bindingType: w.properties.binding.toUpperCase(),
          paperType: w.properties.paperType,
          gsm: w.properties.gsm,
          calculatedPrice: w.price,
          files: w.files,
        })),
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create order");
      
      const data = await res.json();
      setOrderId(data.id);
      setCurrentScreen("confirmation");
    } catch (error) {
      console.error(error);
      alert("There was an issue placing your order. Please try again.");
      setCurrentScreen("review");
    }
  };

  const handlePaymentFailure = () => {
    setCurrentScreen("review");
  };

  const handleDone = () => {
    // Reset app
    setCurrentScreen("welcome");
    setWorks([]);
    setPhoneNumber("");
    setOrderId("");
  };

  const totalPrice = calculateTotalPrice(works);

  return (
    <div className="min-h-screen">
      {currentScreen === "welcome" && (
        <WelcomeScreen onContinue={handleWelcomeContinue} shopName={shopName} />
      )}

      {currentScreen === "builder" && (
        <>
          <WorkBuilderScreen
            works={works}
            onCreateWork={handleCreateWork}
            onEditWork={handleEditWork}
            onDeleteWork={handleDeleteWork}
            onMoveFile={handleMoveFile}
            onDeleteFile={handleDeleteFile}
            onContinue={handleReviewOrder}
          />
          <WorkPropertiesModal
            work={editingWork}
            isOpen={editingWork !== null}
            onClose={() => setEditingWork(null)}
            onSave={handleSaveWork}
            initialPricingRules={initialPricingRules}
            initialBindingOptions={initialBindingOptions}
          />
        </>
      )}

      {currentScreen === "review" && (
        <OrderReviewScreen
          works={works}
          onBack={handleBackToBuilder}
          onConfirm={handleProceedToPayment}
        />
      )}

      {currentScreen === "payment" && (
        <PaymentScreen
          amount={totalPrice}
          onSuccess={handlePaymentSuccess}
          onFailure={handlePaymentFailure}
          shopName={shopName}
          upiId={upiId || shopSettings?.upi_id || "payment@nowait"}
        />
      )}

      {currentScreen === "confirmation" && (
        <ConfirmationScreen 
          orderId={orderId} 
          onDone={handleDone} 
          shopName={shopName}
          shopAddress={shopAddress}
          shopPhone={shopPhone}
        />
      )}
    </div>
  );
}