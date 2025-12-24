import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Volume2, X, Mic, MicOff, Bot } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Web Speech API types
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

  // Fallback response if AI fails
  const getFallbackResponse = (): string => {
    return "I'm Pawan's AI assistant. I can help you learn about his expertise in data engineering, AI, and cloud solutions. What would you like to know?";
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsLoading(true);
    setConversation(prev => [...prev, { role: 'user', content: text }]);
    setMessage('');

    try {
      // Get AI response from Lovable AI
      const { data: chatData, error: chatError } = await supabase.functions.invoke('portfolio-chat', {
        body: { 
          message: text,
          conversationHistory: conversation
        }
      });

      if (chatError) {
        throw new Error(chatError.message);
      }

      const agentResponse = chatData?.response || "I'm sorry, I couldn't generate a response.";
      
      // Call Resemble AI for TTS
      const { data: ttsData, error: ttsError } = await supabase.functions.invoke('resemble-tts', {
        body: { text: agentResponse }
      });

      setConversation(prev => [...prev, { role: 'assistant', content: agentResponse }]);

      if (ttsData?.audioUrl && !ttsError) {
        playAudio(ttsData.audioUrl);
      } else if (ttsData?.error) {
        console.warn('TTS warning:', ttsData.error);
      }
    } catch (error) {
      console.error('Error:', error);
      setConversation(prev => [...prev, { 
        role: 'assistant', 
        content: "I'm sorry, I encountered an error. Please try again." 
      }]);
      
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive"
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
                  {msg.content}
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
