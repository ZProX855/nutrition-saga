
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { generateAIResponse } from "@/services/foodApi";
import { useToast } from "@/hooks/use-toast";

export const NutritionAIChat = () => {
  const [query, setQuery] = useState("");
  const [response, setResponse] = useState("");
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

    setLoading(true);
    try {
      const aiResponse = await generateAIResponse(query);
      setResponse(aiResponse);
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
        <CardTitle className="text-xl font-medium">Ask Nutrition AI</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about nutrition or request a diet plan..."
              className="flex-1 bg-white"
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Thinking..." : "Ask"}
            </Button>
          </div>
          {response && (
            <div className="mt-4 p-4 bg-white rounded-lg">
              <p className="whitespace-pre-wrap">{response}</p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};
