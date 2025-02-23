
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAIResponse } from "@/services/foodApi";
import { useToast } from "@/hooks/use-toast";
import { MessageSquare, Send, Heart, Apple } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
}

export const NutritionAIChat = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      toast({
        title: "Please enter a question",
        description: "Your question cannot be empty",
        variant: "destructive",
      });
      return;
    }

    const userMessage = query.trim();
    setMessages((prev) => [...prev, { text: userMessage, isUser: true }]);
    setQuery("");
    setLoading(true);

    try {
      const aiResponse = await generateAIResponse(userMessage);
      setMessages((prev) => [...prev, { text: aiResponse, isUser: false }]);
    } catch (error) {
      toast({
        title: "Error generating response",
        description: error instanceof Error ? error.message : "Please try again later",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full bg-white/70 backdrop-blur-md shadow-lg">
      <CardHeader className="border-b border-gray-100">
        <CardTitle className="text-xl font-medium flex items-center gap-3">
          <div className="relative">
            <MessageSquare className="w-6 h-6 text-primary" />
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm"></div>
          </div>
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Chat with Your Nutrition Doctor
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div 
            className="h-[400px] overflow-y-auto p-4 space-y-4 bg-white/80 rounded-lg backdrop-blur-sm"
            style={{ overscrollBehavior: "contain" }}
          >
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-gray-500">
                <Apple className="w-12 h-12 text-primary" />
                <p>Ask me anything about nutrition or request a personalized diet plan!</p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  } shadow-md`}
                >
                  <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 p-4 rounded-2xl shadow-md">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    Thinking...
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about nutrition or request a diet plan..."
              className="flex-1 bg-white/90 backdrop-blur-sm"
            />
            <Button
              type="submit"
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};

