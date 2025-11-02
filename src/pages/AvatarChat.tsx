import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Video, VideoOff, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StreamingAvatar, { AvatarQuality, StreamingEvents, TaskType } from "@heygen/streaming-avatar";

const AvatarChat = () => {
  const { toast } = useToast();
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [isLoadingAvatar, setIsLoadingAvatar] = useState(false);
  const [stream, setStream] = useState<MediaStream>();
  const [sessionData, setSessionData] = useState<any>();
  const [message, setMessage] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  const mediaStream = useRef<HTMLVideoElement>(null);
  const avatar = useRef<StreamingAvatar | null>(null);

  async function fetchAccessToken() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/heygen-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response from heygen-token:", response.status, errorText);
        throw new Error(`Failed to get token: ${response.status}`);
      }

      const token = await response.text();
      console.log("Successfully received token");
      return token;
    } catch (error) {
      console.error("Error fetching access token:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get access token",
        variant: "destructive",
      });
      return "";
    }
  }

  async function startSession() {
    setIsLoadingSession(true);
    try {
      const token = await fetchAccessToken();
      
      avatar.current = new StreamingAvatar({ token });
      
      avatar.current.on(StreamingEvents.AVATAR_START_TALKING, () => {
        console.log("Avatar started talking");
        setIsSpeaking(true);
      });

      avatar.current.on(StreamingEvents.AVATAR_STOP_TALKING, () => {
        console.log("Avatar stopped talking");
        setIsSpeaking(false);
      });

      avatar.current.on(StreamingEvents.STREAM_DISCONNECTED, () => {
        console.log("Stream disconnected");
        endSession();
      });

      setIsLoadingAvatar(true);
      const res = await avatar.current.createStartAvatar({
        quality: AvatarQuality.High,
        avatarName: "358de16437984372a8dbb88a36c71638",
        voice: {
          voiceId: "1bd001e7e50f421d891986aad5158bc8",
        },
      });

      setSessionData(res);
      setStream(avatar.current.mediaStream);
      setIsLoadingAvatar(false);
      
      toast({
        title: "Avatar Ready",
        description: "You can now start chatting!",
      });
    } catch (error) {
      console.error("Error starting session:", error);
      toast({
        title: "Error",
        description: "Failed to start avatar session",
        variant: "destructive",
      });
      setIsLoadingAvatar(false);
    } finally {
      setIsLoadingSession(false);
    }
  }

  async function endSession() {
    if (!avatar.current) return;
    
    await avatar.current.stopAvatar();
    setStream(undefined);
    setSessionData(undefined);
    avatar.current = null;
  }

  async function handleSendMessage() {
    if (!avatar.current || !message.trim()) return;

    try {
      setIsSpeaking(true);
      await avatar.current.speak({
        text: message,
        taskType: TaskType.REPEAT,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      setIsSpeaking(false);
    }
  }

  useEffect(() => {
    if (stream && mediaStream.current) {
      mediaStream.current.srcObject = stream;
      mediaStream.current.onloadedmetadata = () => {
        mediaStream.current!.play();
      };
    }
  }, [stream]);

  useEffect(() => {
    return () => {
      endSession();
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-2">Talk to My Avatar</h1>
            <p className="text-muted-foreground">
              Interactive AI avatar powered by Heygen
            </p>
          </div>

          <Card className="p-6 mb-6">
            <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-4 relative">
              {stream ? (
                <video
                  ref={mediaStream}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                >
                  <track kind="captions" />
                </video>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center">
                    <VideoOff className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">
                      {isLoadingSession || isLoadingAvatar
                        ? "Loading avatar..."
                        : "Start a session to begin chatting"}
                    </p>
                  </div>
                </div>
              )}
              
              {isSpeaking && stream && (
                <div className="absolute bottom-4 left-4 bg-primary/90 text-primary-foreground px-3 py-1 rounded-full text-sm">
                  Speaking...
                </div>
              )}
            </div>

            <div className="flex gap-2 mb-4">
              {!stream ? (
                <Button
                  onClick={startSession}
                  disabled={isLoadingSession}
                  className="w-full"
                >
                  {isLoadingSession ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Starting Session...
                    </>
                  ) : (
                    <>
                      <Video className="mr-2 h-4 w-4" />
                      Start Avatar Session
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={endSession}
                  variant="destructive"
                  className="w-full"
                >
                  End Session
                </Button>
              )}
            </div>

            {stream && (
              <div className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type your message..."
                  disabled={isSpeaking || !stream}
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!message.trim() || isSpeaking || !stream}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            )}
          </Card>

          {isLoadingAvatar && (
            <div className="text-center text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p>Loading avatar, this may take a moment...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AvatarChat;
