import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Volume2, X, MessageCircle, Mic, MicOff, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'agent';
  text: string;
}

// Extend Window interface for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

const VoiceAgent: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Message[]>([]);
  const [agentStatus, setAgentStatus] = useState<'unknown' | 'ready' | 'error'>('unknown');
  const [speechSupported, setSpeechSupported] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if Web Speech API is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setSpeechSupported(true);
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setMessage(finalTranscript);
          // Auto-send after final transcript
          setTimeout(() => {
            sendMessage(finalTranscript);
          }, 100);
        } else {
          setMessage(interimTranscript);
        }
      };

      recognitionRef.current.onerror = (event: Event) => {
        console.error('Speech recognition error:', event);
        setIsListening(false);
        toast({
          title: "Voice input error",
          description: "Could not recognize speech. Please try again.",
          variant: "destructive"
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      checkAgentStatus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const checkAgentStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('resemble-tts', {
        body: { action: 'list-voices' }
      });

      if (error) {
        console.error('Agent status check error:', error);
        setAgentStatus('error');
        return;
      }

      const voices = data?.items || [];
      if (voices.length > 0) {
        setAgentStatus('ready');
      } else {
        setAgentStatus('error');
        toast({
          title: "No voices configured",
          description: "Please add a voice to your Resemble AI account",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error checking agent status:', error);
      setAgentStatus('error');
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setMessage('');
      recognitionRef.current.start();
    }
  };

  const getAgentResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! I'm Pawan's AI voice assistant. I can tell you about his expertise in data engineering, AI, and cloud solutions. What would you like to know?";
    }
    if (lowerMessage.includes('experience') || lowerMessage.includes('work') || lowerMessage.includes('background')) {
      return "Pawan has extensive experience in data engineering, AI, and cloud solutions. He has worked with leading organizations to build scalable data pipelines, implement AI-driven solutions, and architect cloud infrastructure.";
    }
    if (lowerMessage.includes('skills') || lowerMessage.includes('expertise') || lowerMessage.includes('tech')) {
      return "Pawan's technical expertise includes Python, SQL, Apache Spark, cloud platforms like AWS and Azure, machine learning frameworks, and building end-to-end data solutions. He specializes in real-time streaming and enterprise data platforms.";
    }
    if (lowerMessage.includes('contact') || lowerMessage.includes('reach') || lowerMessage.includes('email')) {
      return "You can connect with Pawan through LinkedIn or by using the contact form on this website. Scroll down to find the contact section for more details.";
    }
    if (lowerMessage.includes('project') || lowerMessage.includes('portfolio') || lowerMessage.includes('showcase')) {
      return "Pawan has worked on various data engineering showcases including real-time streaming pipelines, machine learning platforms, and enterprise data solutions. You can explore his projects by scrolling through this portfolio website.";
    }
    if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('study')) {
      return "Pawan has a strong educational background in computer science and data engineering. His continuous learning approach keeps him updated with the latest technologies in AI and cloud computing.";
    }
    if (lowerMessage.includes('hire') || lowerMessage.includes('available') || lowerMessage.includes('opportunity')) {
      return "Pawan is open to discussing interesting opportunities in data engineering and AI. Feel free to reach out through the contact form or LinkedIn to discuss potential collaborations.";
    }
    
    return "I'm here to help you learn more about Pawan's expertise in data engineering and AI. You can ask about his experience, technical skills, projects, or how to get in touch!";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { role: 'user', text }]);
    setMessage('');

    try {
      // Generate a response
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
      } else if (data?.error) {
        console.warn('TTS warning:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      const agentResponse = getAgentResponse(text);
      setConversation(prev => [...prev, { role: 'agent', text: agentResponse }]);
      
      toast({
        title: "Voice unavailable",
        description: "Showing text response instead",
        variant: "default"
      });
    } finally {
      setIsLoading(false);
    }
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
      console.warn('Audio playback failed');
    };
    
    audio.play().catch(err => {
      console.warn('Audio play error:', err);
      setIsPlaying(false);
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(message);
  };

  const quickQuestions = [
    "What's your experience?",
    "Tell me about your skills",
    "Show me your projects"
  ];

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-all duration-200 flex items-center justify-center group"
        aria-label="Open voice agent"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <>
            <Bot className="w-6 h-6" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          </>
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">AI Voice Assistant</h3>
                  <div className="flex items-center gap-1.5 text-xs opacity-80">
                    <span className={`w-2 h-2 rounded-full ${
                      agentStatus === 'ready' ? 'bg-green-400' : 
                      agentStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    <span>
                      {agentStatus === 'ready' ? 'Voice enabled' : 
                       agentStatus === 'error' ? 'Text only' : 'Connecting...'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="h-72 overflow-y-auto p-4 space-y-3 bg-background">
            {conversation.length === 0 && (
              <div className="text-center text-muted-foreground text-sm py-4">
                <Bot className="w-10 h-10 mx-auto mb-3 opacity-50" />
                <p className="mb-2">Hi! Ask me anything about Pawan's expertise.</p>
                {speechSupported && (
                  <p className="text-xs mb-4">Tap the mic to speak or type below</p>
                )}
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendMessage(q)}
                      className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {conversation.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-none'
                      : 'bg-muted text-foreground rounded-bl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isListening && (
              <div className="flex justify-end">
                <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm flex items-center gap-2 rounded-br-none">
                  <Mic className="w-4 h-4 animate-pulse" />
                  <span>{message || 'Listening...'}</span>
                </div>
              </div>
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted text-muted-foreground px-3 py-2 rounded-lg text-sm rounded-bl-none">
                  <span className="inline-flex gap-1">
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                </div>
              </div>
            )}
            {isPlaying && (
              <div className="flex justify-start">
                <div className="bg-primary/10 text-primary px-3 py-2 rounded-lg text-sm flex items-center gap-2 rounded-bl-none">
                  <Volume2 className="w-4 h-4 animate-pulse" />
                  <span>Speaking...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-border bg-card">
            <div className="flex gap-2">
              {speechSupported && (
                <Button
                  type="button"
                  size="icon"
                  variant={isListening ? "destructive" : "outline"}
                  onClick={toggleListening}
                  disabled={isLoading}
                  className="shrink-0"
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? (
                    <MicOff className="w-4 h-4" />
                  ) : (
                    <Mic className="w-4 h-4" />
                  )}
                </Button>
              )}
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={isListening ? "Listening..." : "Type or tap mic..."}
                disabled={isLoading || isListening}
                className="flex-1 text-sm"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isLoading || !message.trim() || isListening}
                className="shrink-0"
              >
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
