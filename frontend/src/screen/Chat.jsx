import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useParams } from "react-router-dom";
import React, { useState, useRef, useEffect } from "react";
import { createSocketConnection } from "@/lib/socket";
import { useSelector } from "react-redux";
import axiosInstance from "@/lib/axiosInstance";

const Chat = () => {
  const { targetuserId } = useParams();
  const user = useSelector((state) => state.user);
  const userId = user?._id;

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null); // Ref for auto-scroll

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        if (!userId || !targetuserId) return;

        const res = await axiosInstance.get(`/api/v1/chat/${targetuserId}`);

        const msgs = res.data.map((msg) => ({
          ...msg,
          fromSelf: msg.senderId === userId,
        }));

        setMessages(msgs);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [userId, targetuserId]);

  useEffect(() => {
    if (!userId) return;

    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.emit("joinChat", { targetuserId, userId });

    socket.on("message", (message) => {
      setMessages((prev) => [
        ...prev,
        {
          ...message,
          fromSelf: message.senderId === userId,
        },
      ]);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId, targetuserId]);

  useEffect(() => {
    // Scroll to bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = () => {
    const trimmed = input.trim();
    if (trimmed === "") return;

    const msgPayload = {
      message: trimmed,
      userId,
      targetuserId,
    };

    socketRef.current?.emit("message", msgPayload);
    setInput("");
  };

  return (
    <div className="w-full flex justify-center items-start p-4 min-h-screen bg-muted">
      <Card className="w-full max-w-2xl md:max-w-3xl h-[80vh] flex flex-col">
        {/* Header */}
        <CardHeader className="text-lg font-semibold">
          Chat with {targetuserId || "User"}
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-hidden p-0">
          <div className="h-full px-4 py-2 space-y-2 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground mt-10">
                No messages yet. Start the conversation!
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`max-w-[70%] break-words my-1 p-3 rounded-lg ${
                      msg.fromSelf
                        ? "ml-auto bg-primary text-primary-foreground"
                        : "mr-auto bg-muted text-muted-foreground"
                    }`}
                  >
                    {msg.text}
                    <span className="text-xs text-muted-foreground block mt-1">
                      {new Date(msg.updatedAt).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                <div ref={messagesEndRef} /> {/* Invisible scroll target */}
              </>
            )}
          </div>
        </CardContent>

        {/* Input Area */}
        <div className="flex items-center gap-2 p-4 border-t">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button onClick={handleSend} disabled={input.trim() === ""}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Chat;
