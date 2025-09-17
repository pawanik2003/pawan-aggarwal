import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

const Chat = () => {
  // Pawan's resume data for context
  const resumeContext = `
Director – Data Engineering at NatWest Bank
19+ years of experience in Data Engineering/Big Data Analytics and Technology Transformation

KEY ACHIEVEMENTS:
• Leading Multiple Feature teams of Data Engineers, Technical Architects and Quality Engineers
• Global Accountability for Enterprise data products and BI/Analytics/Machine Learning systems on AWS/GCP and Azure
• Designed and delivered resilient, high-performance data platforms processing 50M+ daily transactions (7B+ total volume)
• Built real-time streaming architecture reducing fraud detection from hours to milliseconds, saving $15M annually
• Achieved 40% cost reduction and 10x faster queries through cloud lakehouse modernization
• Created MLOps pipelines improving forecast accuracy by 18% with 10x faster model deployment

EXPERIENCE:
• NatWest Bank (2 years) - Engineering Director
• UHG (15.5 years) - Associate Lead Manager  
• Infosys (1.3 years) - Manager

TECHNICAL EXPERTISE:
• Languages: Python, Scala, SQL, Java, R
• Cloud: AWS (EMR, Spark, Glue, Athena, QuickSight), Azure (ADF, Databricks, Synapse), GCP
• Big Data: Kafka, Spark Streaming, CDC (Debezium), Airflow, Delta Lake
• Data: Snowflake, MongoDB, Data Lakehouse, Data Mesh, Medallion Architecture
• ML/AI: TensorFlow, MLflow, MLOps, Demand Forecasting
• DevOps: Docker, Kubernetes, Terraform, CI/CD

LEADERSHIP PHILOSOPHY:
Teams thrive when they understand the "why" behind decisions. Believes in mentoring through doing, not just telling. Focuses on building "invisible infrastructure" - systems so reliable that teams forget they exist.

BUSINESS IMPACT:
Consistently delivers data solutions that drive real business outcomes, connecting technical excellence to measurable results like cost savings, performance improvements, and operational efficiency.
`;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Pawan's digital assistant. I can answer questions about his professional journey, technical expertise, achievements, and leadership philosophy. What would you like to know?",
      type: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;
    
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Perplexity API key to continue.",
        variant: "destructive",
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: `You are Pawan Aggarwal's professional digital assistant. Answer questions about his career using this context: ${resumeContext}

Guidelines:
- Be professional yet approachable
- Use specific achievements and numbers when available
- Connect technical expertise to business impact
- If asked about something not in the context, politely redirect to what you can help with
- Keep responses concise but informative`
            },
            {
              role: 'user',
              content: inputValue
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000,
          return_images: false,
          return_related_questions: false,
          frequency_penalty: 1,
          presence_penalty: 0
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: data.choices?.[0]?.message?.content || "Sorry, I'm having trouble accessing Pawan's insights right now. Please try again shortly.",
        type: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble accessing Pawan's insights right now. Please check your API key and try again.",
        type: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      
      toast({
        title: "Connection Error",
        description: "Unable to connect to the AI service. Please check your API key and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are Pawan's biggest achievements?",
    "Tell me about Pawan's experience with cloud transformation",
    "What leadership roles has Pawan held?",
    "What technologies does Pawan specialize in?",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      <div className="container mx-auto px-4 py-8 max-w-4xl h-screen flex flex-col">
        <div className="text-center mb-6 flex-shrink-0">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-full bg-primary/10">
              <MessageCircle className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Ask Pawan
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your digital assistant to learn about Pawan Aggarwal's professional journey, 
            technical expertise, and leadership philosophy.
          </p>
        </div>

        {showApiKeyInput && (
          <Card className="mb-6 flex-shrink-0">
            <CardContent className="p-4">
              <div className="space-y-3">
                <Label htmlFor="apiKey" className="text-sm font-medium">
                  Perplexity API Key (Required)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="apiKey"
                    type="password"
                    placeholder="Enter your Perplexity API key..."
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={() => setShowApiKeyInput(false)}
                    disabled={!apiKey.trim()}
                  >
                    Set Key
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from <a href="https://www.perplexity.ai/settings/api" target="_blank" rel="noopener" className="text-primary hover:underline">Perplexity Settings</a>
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {!showApiKeyInput && messages.length === 1 && (
          <div className="mb-6 flex-shrink-0">
            <h3 className="text-sm font-medium text-muted-foreground mb-3">Suggested questions:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto py-3 px-4 whitespace-normal"
                  onClick={() => setInputValue(question)}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        <Card className="flex-1 flex flex-col border-2 shadow-xl min-h-0">
          <CardHeader className="border-b bg-card/50 flex-shrink-0">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bot className="h-5 w-5 text-primary" />
              Chat with Pawan's Assistant
              {!showApiKeyInput && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowApiKeyInput(true)}
                  className="ml-auto"
                >
                  Change API Key
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 min-h-0">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex gap-3 max-w-[80%] ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className="flex-shrink-0">
                        {message.type === 'user' ? (
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <User className="h-4 w-4 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <Bot className="h-4 w-4 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`rounded-lg px-4 py-2 ${
                          message.type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <span className="text-xs opacity-70 mt-1 block">
                          {message.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex gap-3 justify-start">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                      <Bot className="h-4 w-4 text-secondary-foreground" />
                    </div>
                    <div className="bg-muted rounded-lg px-4 py-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          <div className="border-t p-4 flex-shrink-0">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Pawan's experience, achievements, or expertise..."
                disabled={isLoading || (!apiKey.trim() && showApiKeyInput)}
                className="flex-1"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim() || (!apiKey.trim() && showApiKeyInput)}
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center flex-shrink-0">
          <p className="text-sm text-muted-foreground">
            This chatbot uses Perplexity AI and references Pawan's resume for accurate responses.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;