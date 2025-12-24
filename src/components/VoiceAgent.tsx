import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Send, Volume2, X, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const VoiceAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'agent'; text: string }>>([]);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { role: 'user', text }]);
    setMessage('');

    try {
      // Generate a response (you can integrate with an AI service here)
      const agentResponse = getAgentResponse(text);
      
      // Call Resemble AI for TTS
      const { data, error } = await supabase.functions.invoke('resemble-tts', {
        body: { text: agentResponse }
      });

      if (error) {
        throw new Error(error.message);
      }

      setConversation(prev => [...prev, { role: 'agent', text: agentResponse }]);

      if (data?.audioUrl) {
        playAudio(data.audioUrl);
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate response",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return "Hello! I'm Pawan's voice assistant. How can I help you learn more about his work in data engineering and AI?";
    }
    if (lowerMessage.includes('experience') || lowerMessage.includes('work')) {
      return "Pawan has extensive experience in data engineering, AI, and cloud solutions. He has worked with leading organizations to build scalable data pipelines and implement AI-driven solutions.";
    }
    if (lowerMessage.includes('skills') || lowerMessage.includes('expertise')) {
      return "Pawan's expertise includes Python, SQL, Apache Spark, cloud platforms like AWS and Azure, machine learning, and building end-to-end data solutions.";
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach')) {
      return "You can connect with Pawan through LinkedIn or email. Check out the contact section on this website for more details.";
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio')) {
      return "Pawan has worked on various data engineering showcases including real-time streaming pipelines, ML platforms, and enterprise data solutions. Scroll through the website to explore his projects.";
    }
    
    return "I'm here to help you learn more about Pawan's expertise in data engineering and AI. Feel free to ask about his experience, skills, projects, or how to get in touch!";
  };

  const playAudio = (url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    
    const audio = new Audio(url);
    audioRef.current = audio;
    
    audio.onplay = () => setIsPlaying(true);
    audio.onended = () => setIsPlaying(false);
    audio.onerror = () => {
      setIsPlaying(false);
      toast({
        title: "Audio Error",
        description: "Failed to play audio response",
        variant: "destructive"
      });
    };
    
    audio.play();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform flex items-center justify-center"
        aria-label="Open voice agent"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <Volume2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Voice Assistant</h3>
                <p className="text-xs opacity-80">Ask me about Pawan</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-64 overflow-y-auto p-4 space-y-3 bg-background">
            {conversation.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-8">
                <Volume2 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Hi! Ask me anything about Pawan's expertise.</p>
              </div>
            )}
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm">
                  <span className="animate-pulse">Generating response...</span>
                </div>
              </div>
            )}
            {isPlaying && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm flex items-center gap-2">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Speaking...</span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" size="icon" disabled={isLoading || !message.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default VoiceAgent;
