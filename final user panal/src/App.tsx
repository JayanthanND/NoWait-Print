import { useState } from "react";
import { WelcomeScreen } from "./components/screens/WelcomeScreen";
import { WorkBuilderScreen } from "./components/screens/WorkBuilderScreen";
import { WorkPropertiesModal } from "./components/screens/WorkPropertiesModal";
import { OrderReviewScreen } from "./components/screens/OrderReviewScreen";
import { PaymentScreen } from "./components/screens/PaymentScreen";
import { ConfirmationScreen } from "./components/screens/ConfirmationScreen";
import { Work, WorkProperties, FileItem, DEFAULT_PROPERTIES } from "./types";
import { calculateWorkPrice, calculateTotalPrice } from "./utils/pricing";

type Screen = "welcome" | "builder" | "review" | "payment" | "confirmation";

export default function App() {
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
          updatedWork.price = calculateWorkPrice(updatedWork);
          return updatedWork;
        } else if (w.id === toWorkId) {
          // Add file to destination work (inherits destination's settings)
          const updatedWork = {
            ...w,
            files: [...w.files, fileToMove],
          };
          updatedWork.price = calculateWorkPrice(updatedWork);
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
          updatedWork.price = calculateWorkPrice(updatedWork);
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
          updatedWork.price = calculateWorkPrice(updatedWork);
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

  const handlePaymentSuccess = (newOrderId: string) => {
    setOrderId(newOrderId);
    setCurrentScreen("confirmation");
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
        <WelcomeScreen onContinue={handleWelcomeContinue} />
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
        />
      )}

      {currentScreen === "confirmation" && (
        <ConfirmationScreen orderId={orderId} onDone={handleDone} />
      )}
    </div>
  );
}