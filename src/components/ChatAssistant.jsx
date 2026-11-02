import { lazy, Suspense, useState } from "react";
import { MessageSquare } from "lucide-react";

const Chatbot = lazy(() => import("./Chatbot"));

export default function ChatAssistant() {
  const [requested, setRequested] = useState(false);
  const trigger = (loading) => (
    <div className="chatbot-container">
      <button
        className="chatbot-toggle-btn"
        disabled={loading}
        onClick={() => setRequested(true)}
        aria-label={
          loading
            ? "Opening assistant"
            : "Open chat with BlueCloud AI Assistant Aura"
        }
      >
        <MessageSquare size={22} />
      </button>
    </div>
  );
  return requested ? (
    <Suspense fallback={trigger(true)}>
      <Chatbot initiallyOpen />
    </Suspense>
  ) : (
    trigger(false)
  );
}
