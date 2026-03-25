import { useState, useEffect } from "react";
import { WelcomeScreen } from "./components/screens/WelcomeScreen";
import { WorkBuilderScreen } from "./components/screens/WorkBuilderScreen";
import { WorkPropertiesModal } from "./components/screens/WorkPropertiesModal";
import { OrderReviewScreen } from "./components/screens/OrderReviewScreen";
import { PaymentScreen } from "./components/screens/PaymentScreen";
import { ConfirmationScreen } from "./components/screens/ConfirmationScreen";
import { Work, WorkProperties, FileItem, DEFAULT_PROPERTIES } from "./types";
import { calculateWorkPrice, calculateTotalPrice } from "./utils/pricing";
import { api } from "./services/api";

type Screen = "welcome" | "builder" | "review" | "payment" | "confirmation";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("welcome");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [works, setWorks] = useState<Work[]>([]);
  const [editingWork, setEditingWork] = useState<Work | null>(null);
  const [orderId, setOrderId] = useState("");
  const [shopId, setShopId] = useState("default"); // Default shop ID

  // Fetch shop details on mount
  useEffect(() => {
    api.getShop().then(shop => {
      if (shop && shop.id) setShopId(shop.id);
    }).catch(err => console.error("Failed to fetch shop", err));
  }, []);

  // Helper to recalculate prices via backend
  const updatePrices = async (currentWorks: Work[]) => {
    if (currentWorks.length === 0) return;
    try {
      const response = await api.calculatePrice(currentWorks);
      if (response && response.works) {
        setWorks(prevWorks => {
          // Merge backend pricing with current works
          // We match by ID if possible, or just index if order preserved
          // The backend returns the same works array with added pricing info
          return currentWorks.map((w, idx) => {
            const pricedWork = response.works[idx]; // Assuming order preserved
            // Verify safety or match by ID if we sent IDs
            if (pricedWork) {
              return { ...w, price: pricedWork.pricing.total };
            }
            return w;
          });
        });
      }
    } catch (e) {
      console.error("Price update failed", e);
    }
  };

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
    const newWorks = [...works, newWork];
    setWorks(newWorks);
    setEditingWork(newWork);
    // No need to recalc price on empty create, it's 0
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
    const updatedWorks = works.map((w) => {
      if (w.id === fromWorkId) {
        const updatedWork = { ...w, files: w.files.filter((f) => f.id !== fileId) };
        // Local estimate while waiting for backend
        updatedWork.price = calculateWorkPrice(updatedWork);
        return updatedWork;
      } else if (w.id === toWorkId) {
        const updatedWork = { ...w, files: [...w.files, fileToMove] };
        updatedWork.price = calculateWorkPrice(updatedWork);
        return updatedWork;
      }
      return w;
    });
    setWorks(updatedWorks);
    updatePrices(updatedWorks); // Trigger backend recalc
  };

  const handleDeleteFile = (workId: string, fileId: string) => {
    const updatedWorks = works.map((w) => {
      if (w.id === workId) {
        const updatedWork = { ...w, files: w.files.filter((f) => f.id !== fileId) };
        updatedWork.price = calculateWorkPrice(updatedWork);
        return updatedWork;
      }
      return w;
    });
    setWorks(updatedWorks);
    updatePrices(updatedWorks);
  };

  const handleSaveWork = (workId: string, files: FileItem[], properties: WorkProperties) => {
    const updatedWorks = works.map((w) => {
      if (w.id === workId) {
        const updatedWork = { ...w, files, properties };
        // We set it to 0 or keep old price temporarily, backend will fix it
        // updatedWork.price = calculateWorkPrice(updatedWork); 
        return updatedWork;
      }
      return w;
    });
    setWorks(updatedWorks);
    setEditingWork(null); // Close modal
    updatePrices(updatedWorks); // Trigger backend recalc
  };

  const handleReviewOrder = () => {
    // Force one last price check before review
    updatePrices(works);
    setCurrentScreen("review");
  };

  const handleBackToBuilder = () => {
    setCurrentScreen("builder");
  };

  const handleProceedToPayment = () => {
    setCurrentScreen("payment");
  };

  const handlePaymentSuccess = async (newOrderId: string) => {
    // newOrderId here comes from PaymentScreen dummy logic, we override it or ignore it
    try {
      const order = await api.createOrder({
        shopId,
        mobile: phoneNumber,
        works,
        totalAmount: totalPrice
      });
      setOrderId(order.id);
      setCurrentScreen("confirmation");
    } catch (e) {
      console.error("Order creation failed", e);
      // Fallback to dummy ID if backend fails so user isn't stuck
      setOrderId(newOrderId);
      setCurrentScreen("confirmation");
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