
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAIResponse } from "@/services/foodApi";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";

interface Message {
  text: string;
  isUser: boolean;
}

export const NutritionAIChat = () => {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
    <Card className="w-full bg-white/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-medium flex items-center gap-2">
          <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
          Chat with Your Nutrition Doctor
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="h-[400px] overflow-y-auto p-4 space-y-4 bg-white/80 rounded-lg">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.isUser
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-800"
                  } animate-fade-in`}
                >
                  <p className="whitespace-pre-wrap">{message.text}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-gray-100 text-gray-800 p-3 rounded-lg">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about nutrition or request a diet plan..."
              className="flex-1 bg-white"
            />
            <Button type="submit" disabled={loading}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
};
