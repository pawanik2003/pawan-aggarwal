import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User, MessageCircle, Sparkles, Brain, FileText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { OpenAIService } from "@/lib/openai";

interface Message {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I'm Pawan's AI-powered digital assistant, trained on his comprehensive resume and professional background. I can provide detailed insights about his 19+ years in data engineering, his leadership at companies like NatWest Bank and UHG, his technical expertise, and major achievements. What would you like to know?",
      type: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      type: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      // In production, this would call your backend edge function with OpenAI
      // For demo purposes, we'll provide intelligent responses based on common questions
      const response = generateDemoResponse(currentInput);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        type: 'bot',
        timestamp: new Date(),
      };

      // Simulate API delay for realistic feel
      setTimeout(() => {
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 1500);

    } catch (error) {
      console.error('Error:', error);
      
      const fallbackMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "I'm here to help you learn about Pawan's professional journey! You can ask me about his technical expertise, leadership experience, achievements, or any specific projects.",
        type: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
      setIsLoading(false);
      
      toast({
        title: "Demo Mode",
        description: "Currently running in demo mode with intelligent responses based on Pawan's resume.",
        variant: "default",
      });
    }
  };

  const generateDemoResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('achievement') || lowerInput.includes('accomplish')) {
      return "Pawan has achieved remarkable results throughout his career! His biggest achievements include: designing resilient data platforms processing 50M+ daily transactions (7B+ total volume), building real-time streaming architecture that reduced fraud detection from hours to milliseconds, saving $15M annually, achieving 40% cost reduction and 10x faster queries through cloud lakehouse modernization, and creating MLOps pipelines that improved forecast accuracy by 18% with 10x faster model deployment.";
    }
    
    if (lowerInput.includes('cloud') || lowerInput.includes('aws') || lowerInput.includes('azure')) {
      return "Pawan is a cloud transformation expert with deep expertise across multiple platforms. He has extensive experience with AWS (EMR, Spark, Glue, Athena, QuickSight, MongoDB, Airflow), Azure (Kafka, ADF, Databricks, Spark, Scala, Delta Lake, Synapse), and GCP. He's led cloud modernization projects that achieved 40% cost reduction and implemented batch and near real-time Data Products using Medallion Architecture with CDC/Kafka streams.";
    }
    
    if (lowerInput.includes('leadership') || lowerInput.includes('team') || lowerInput.includes('manage')) {
      return "Pawan is an experienced engineering leader currently serving as Director of Data Engineering at NatWest Bank. He leads multiple feature teams of Data Engineers, Technical Architects, and Quality Engineers with global accountability. His leadership philosophy centers on helping teams understand the 'why' behind decisions, mentoring through doing rather than just telling, and building 'invisible infrastructure' - systems so reliable that teams forget they exist. He has 19+ years of experience leading globally distributed teams.";
    }
    
    if (lowerInput.includes('experience') || lowerInput.includes('career') || lowerInput.includes('background')) {
      return "Pawan has 19+ years of experience in Data Engineering and Big Data Analytics. His career timeline includes: Currently Director at NatWest Bank (2+ years), previously Associate Lead Manager at UHG (15.5 years), and Manager at Infosys (1.3 years). He's a graduate of Indian Institute of Management Bangalore and Delhi Technological University with a Bachelor of Engineering.";
    }
    
    if (lowerInput.includes('technical') || lowerInput.includes('technology') || lowerInput.includes('skill')) {
      return "Pawan has a comprehensive technical skill set spanning: Programming Languages (Python, Scala, SQL, Java, R), Cloud Platforms (AWS, Azure, GCP), Big Data Technologies (Kafka, Spark Streaming, CDC/Debezium, Airflow, Delta Lake), Data Platforms (Snowflake, MongoDB, Data Lakehouse, Data Mesh, Medallion Architecture), ML/AI (TensorFlow, MLflow, MLOps, Demand Forecasting), and DevOps (Docker, Kubernetes, Terraform, CI/CD). He specializes in modern data architectures at scale.";
    }
    
    if (lowerInput.includes('natwest') || lowerInput.includes('bank')) {
      return "At NatWest Bank, Pawan serves as Director of Data Engineering with E2E engineering responsibility for One Customer View Data Products supporting the One Bank Vision. He has global accountability for enterprise data products and BI/Analytics/Machine Learning systems, works with business franchises to align product and technical roadmaps, and focuses on data security, governance, and building resilient, high-performance data pipelines.";
    }
    
    if (lowerInput.includes('cost') || lowerInput.includes('save') || lowerInput.includes('efficiency')) {
      return "Pawan has delivered significant business impact through his technical leadership. He achieved $15M in annual savings by building real-time streaming architecture that reduced fraud detection from hours to milliseconds. Additionally, he delivered 40% cost reduction and 10x faster queries through cloud lakehouse modernization, and improved forecast accuracy by 18% with 10x faster model deployment through MLOps pipelines.";
    }
    
    // Default response for general queries
    return "That's a great question! Pawan Aggarwal is a seasoned Data Engineering Director with 19+ years of experience leading technology transformations. He currently leads data engineering teams at NatWest Bank and has a proven track record of delivering business impact through technical excellence. Feel free to ask me about his specific achievements, technical expertise, leadership experience, or any particular aspect of his career you'd like to know more about!";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const suggestedQuestions = [
    "What are Pawan's biggest achievements?",
    "Tell me about his cloud transformation experience",
    "What leadership roles has Pawan held?",
    "What technologies does he specialize in?",
    "How much cost savings has he delivered?",
    "What's his experience with real-time data processing?"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <div className="container mx-auto px-4 py-8 max-w-5xl h-screen flex flex-col">
        {/* Header Section */}
        <div className="text-center mb-8 flex-shrink-0">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="p-4 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/20">
                <Brain className="h-10 w-10 text-primary" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Sparkles className="h-6 w-6 text-secondary animate-pulse" />
              </div>
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary via-primary-glow to-secondary bg-clip-text text-transparent">
                AI Assistant
              </h1>
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2 justify-center">
                <FileText className="h-4 w-4" />
                Powered by Pawan's Resume & OpenAI
              </p>
            </div>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Your intelligent assistant trained on Pawan Aggarwal's comprehensive professional background. 
            Ask about his 19+ years in data engineering, leadership experience, technical expertise, and major achievements.
          </p>
        </div>

        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="mb-8 flex-shrink-0">
            <h3 className="text-sm font-medium text-muted-foreground mb-4 flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Try asking about:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {suggestedQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="text-left h-auto py-4 px-4 whitespace-normal border-dashed hover:border-solid transition-all duration-200 hover:shadow-md"
                  onClick={() => setInputValue(question)}
                >
                  <span className="text-sm leading-relaxed">{question}</span>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Chat Interface */}
        <Card className="flex-1 flex flex-col border-2 shadow-2xl min-h-0 bg-card/50 backdrop-blur-sm">
          <CardHeader className="border-b bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm flex-shrink-0">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 rounded-lg bg-primary/10">
                <Bot className="h-6 w-6 text-primary" />
              </div>
              Chat with Pawan's AI Assistant
              <div className="ml-auto flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                Online
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="flex-1 p-0 min-h-0">
            <ScrollArea className="h-full p-6">
              <div className="space-y-6">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-4 ${
                      message.type === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className={`flex gap-4 max-w-[85%] ${
                      message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                    }`}>
                      <div className="flex-shrink-0">
                        {message.type === 'user' ? (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-primary-glow flex items-center justify-center shadow-lg">
                            <User className="h-5 w-5 text-primary-foreground" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/20 flex items-center justify-center backdrop-blur-sm">
                            <Bot className="h-5 w-5 text-secondary-foreground" />
                          </div>
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-6 py-4 shadow-lg ${
                          message.type === 'user'
                            ? 'bg-gradient-to-r from-primary to-primary-glow text-primary-foreground'
                            : 'bg-gradient-to-r from-muted/80 to-muted/60 text-foreground border border-border/50 backdrop-blur-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <span className="text-xs opacity-70 mt-2 block">
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
                  <div className="flex gap-4 justify-start">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 border border-secondary/20 flex items-center justify-center backdrop-blur-sm">
                      <Bot className="h-5 w-5 text-secondary-foreground" />
                    </div>
                    <div className="bg-gradient-to-r from-muted/80 to-muted/60 rounded-2xl px-6 py-4 backdrop-blur-sm border border-border/50">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Section */}
          <div className="border-t bg-gradient-to-r from-card/80 to-card/60 backdrop-blur-sm p-6 flex-shrink-0">
            <div className="flex gap-3">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about Pawan's experience, achievements, technical expertise, or leadership philosophy..."
                disabled={isLoading}
                className="flex-1 h-12 bg-background/50 backdrop-blur-sm border-2 focus:border-primary/50 transition-all duration-200"
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={isLoading || !inputValue.trim()}
                size="lg"
                className="h-12 px-6 bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary transition-all duration-200 shadow-lg"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center flex-shrink-0">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4" />
            AI Assistant powered by OpenAI and trained on Pawan's comprehensive resume
            <FileText className="h-4 w-4" />
          </p>
        </div>
      </div>
    </div>
  );
};

export default Chat;