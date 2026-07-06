"use client";

import { useState } from "react";
import AllChatUsers from "./AllChatUsers";
import ChatHeader from "./ChatHeader";
import AllMessages from "./AllMessages";
import SendMessageInput from "./SendMessageInput";
import { useRouter } from "next/navigation";

function MessageLayout() {
  const [showMessages, setShowMessages] = useState(false);
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto h-screen">
      {/* Large screens → grid */}
      <div className="hidden sm:grid sm:grid-cols-[30%_70%] md:grid-cols-[38%_62%] xl:grid-cols-[30%_70%] h-full">
        {/* Left panel: Chat users */}
        <div className="border-r bg-primary sticky top-0 border-l h-full">
          <AllChatUsers onUserClick={() => setShowMessages(true)} />
        </div>

        {/* Right panel: Chat content */}
        <div className="flex flex-col h-full bg-primary relative">
          <div className="sticky top-0 bg-primary z-10">
            <ChatHeader />
          </div>
          <div className="flex-1 overflow-y-auto border-r">
            <AllMessages />
          </div>
          <div className="sticky sm:bottom-0 bottom-10 bg-primary z-10">
            <SendMessageInput />
          </div>
        </div>
      </div>

      {/* Small screens → toggle between list and chat */}
      {/* Small screens → toggle between list and chat */}
      <div className="sm:hidden h-full">
        {!showMessages ? (
          <AllChatUsers onUserClick={() => setShowMessages(true)} />
        ) : (
          <div className="flex flex-col h-full bg-primary relative">
            <div className="sticky top-0 bg-primary z-10">
              {/* Back button inside ChatHeader for mobile */}
              <ChatHeader onBack={() => setShowMessages(false)} />
            </div>
            <div className="flex-1 overflow-y-auto border-r">
              <AllMessages />
            </div>
            <div className="sticky bottom-0 bg-primary z-10">
              <SendMessageInput />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageLayout;
