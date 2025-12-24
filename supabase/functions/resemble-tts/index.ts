import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ResembleVoice {
  uuid: string;
  name: string;
  status: string;
}

interface ResembleAgent {
  uuid: string;
  name: string;
}

// Cache for agent and voice UUIDs
let cachedVoiceUuid: string | null = null;
let cachedAgentUuid: string | null = null;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEMBLE_API_KEY = Deno.env.get('RESEMBLE_API_KEY');
    
    if (!RESEMBLE_API_KEY) {
      console.error('RESEMBLE_API_KEY is not set');
      return new Response(
        JSON.stringify({ error: 'RESEMBLE_API_KEY is not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { text, action } = await req.json();
    const authHeader = `Bearer ${RESEMBLE_API_KEY}`;

    // Action: List voices
    if (action === 'list-voices') {
      const response = await fetch('https://app.resemble.ai/api/v2/voices?page=1&page_size=10', {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error listing voices:', response.status, errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to list voices' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      console.log('Voices:', JSON.stringify(data));
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: List agents
    if (action === 'list-agents') {
      const response = await fetch('https://app.resemble.ai/api/v2/agents?advanced=true', {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error listing agents:', response.status, errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to list agents' }),
          { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const data = await response.json();
      console.log('Agents:', JSON.stringify(data));
      return new Response(
        JSON.stringify(data),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Create agent
    if (action === 'create-agent') {
      // First, get a voice UUID
      const voicesResponse = await fetch('https://app.resemble.ai/api/v2/voices?page=1&page_size=10', {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!voicesResponse.ok) {
        const errorText = await voicesResponse.text();
        console.error('Error fetching voices:', voicesResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch voices' }),
          { status: voicesResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const voicesData = await voicesResponse.json();
      const voices = voicesData.items || [];
      
      if (voices.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No voices found in your Resemble AI account. Please create a voice first.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Use the first available voice
      const voiceUuid = voices[0].uuid;
      console.log('Using voice UUID:', voiceUuid);

      // Create the agent
      const agentPayload = {
        name: "Pawan's Portfolio Assistant",
        voice_uuid: voiceUuid,
        languages: ["en-US"],
        asr: {
          provider: "deepgram",
          model: "nova-2",
          user_input_audio_format: "pcm_16000"
        },
        turn: {
          turn_timeout: 7,
          silence_end_call_timeout: -1,
          mode: "silence"
        },
        llm: {
          prompt: `You are Pawan's AI assistant. You help visitors learn about Pawan's expertise in data engineering, AI, and cloud solutions. 
          
Key information about Pawan:
- Expert in data engineering, AI, and cloud solutions
- Experienced with Python, SQL, Apache Spark, AWS, Azure
- Has built scalable data pipelines and ML platforms
- Works on real-time streaming and enterprise data solutions

Be helpful, concise, and professional. Guide visitors to explore his portfolio and projects.`,
          provider: "openai",
          model: "gpt-4o",
          temperature: 0.7
        },
        system_tools: {
          end_call: {
            active: true,
            disable_interruptions: false,
            force_pre_tool_speech: false
          }
        }
      };

      const createResponse = await fetch('https://app.resemble.ai/api/v2/agents', {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentPayload),
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Error creating agent:', createResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to create agent', details: errorText }),
          { status: createResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const agentData = await createResponse.json();
      console.log('Agent created:', JSON.stringify(agentData));
      
      cachedAgentUuid = agentData.item?.agent?.uuid || agentData.uuid;
      
      return new Response(
        JSON.stringify(agentData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Action: Dispatch agent (start a conversation session)
    if (action === 'dispatch-agent') {
      const { agentUuid } = await req.json().catch(() => ({}));
      
      // Get agent UUID from cache or list agents
      let agentId = agentUuid || cachedAgentUuid;
      
      if (!agentId) {
        // Try to get existing agent
        const agentsResponse = await fetch('https://app.resemble.ai/api/v2/agents', {
          method: 'GET',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json',
          },
        });

        if (agentsResponse.ok) {
          const agentsData = await agentsResponse.json();
          const agents = agentsData.items || [];
          if (agents.length > 0) {
            agentId = agents[0].agent?.uuid || agents[0].uuid;
          }
        }
      }

      if (!agentId) {
        return new Response(
          JSON.stringify({ error: 'No agent found. Please create an agent first.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const dispatchResponse = await fetch(`https://app.resemble.ai/api/v2/agents/${agentId}/dispatch`, {
        method: 'POST',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!dispatchResponse.ok) {
        const errorText = await dispatchResponse.text();
        console.error('Error dispatching agent:', dispatchResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to dispatch agent', details: errorText }),
          { status: dispatchResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const dispatchData = await dispatchResponse.json();
      console.log('Agent dispatched:', JSON.stringify(dispatchData));
      
      return new Response(
        JSON.stringify(dispatchData),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Default action: Generate TTS using clips API (simpler approach for web)
    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required for TTS generation' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Generating TTS for:', text.substring(0, 50) + '...');

    // Get voices if not cached
    if (!cachedVoiceUuid) {
      const voicesResponse = await fetch('https://app.resemble.ai/api/v2/voices?page=1&page_size=10', {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
        },
      });

      if (!voicesResponse.ok) {
        const errorText = await voicesResponse.text();
        console.error('Error fetching voices:', voicesResponse.status, errorText);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch voices from Resemble AI' }),
          { status: voicesResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const voicesData = await voicesResponse.json();
      const voices = voicesData.items || [];
      
      if (voices.length === 0) {
        return new Response(
          JSON.stringify({ error: 'No voices found. Please create a voice in your Resemble AI account.' }),
          { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      cachedVoiceUuid = voices[0].uuid;
      console.log('Cached voice UUID:', cachedVoiceUuid);
    }

    // Use the sync TTS endpoint for immediate audio
    const ttsResponse = await fetch('https://app.resemble.ai/api/v2/clips/sync', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voice_uuid: cachedVoiceUuid,
        body: text,
        sample_rate: 22050,
        output_format: 'mp3',
        precision: 'PCM_16'
      }),
    });

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text();
      console.error('Error generating TTS:', ttsResponse.status, errorText);
      
      // Try async clip creation as fallback
      return await createAsyncClip(authHeader, cachedVoiceUuid!, text, corsHeaders);
    }

    const ttsData = await ttsResponse.json();
    console.log('TTS generated:', JSON.stringify(ttsData));

    const audioUrl = ttsData.item?.audio_src || ttsData.audio_src;
    
    if (!audioUrl) {
      return new Response(
        JSON.stringify({ error: 'No audio URL in response' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ audioUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in resemble-tts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Fallback function for async clip creation with polling
async function createAsyncClip(
  authHeader: string, 
  voiceUuid: string, 
  text: string, 
  corsHeaders: Record<string, string>
): Promise<Response> {
  console.log('Falling back to async clip creation...');
  
  // Get projects first
  const projectsResponse = await fetch('https://app.resemble.ai/api/v2/projects?page=1&page_size=10', {
    method: 'GET',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
  });

  if (!projectsResponse.ok) {
    return new Response(
      JSON.stringify({ error: 'Failed to fetch projects' }),
      { status: projectsResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const projectsData = await projectsResponse.json();
  const projects = projectsData.items || [];
  
  if (projects.length === 0) {
    return new Response(
      JSON.stringify({ error: 'No projects found in Resemble AI account' }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const projectUuid = projects[0].uuid;

  // Create clip
  const clipResponse = await fetch(`https://app.resemble.ai/api/v2/projects/${projectUuid}/clips`, {
    method: 'POST',
    headers: {
      'Authorization': authHeader,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      voice_uuid: voiceUuid,
      body: text,
      is_public: false,
      sample_rate: 22050,
      output_format: 'mp3',
    }),
  });

  if (!clipResponse.ok) {
    const errorText = await clipResponse.text();
    return new Response(
      JSON.stringify({ error: 'Failed to create audio clip', details: errorText }),
      { status: clipResponse.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  const clipData = await clipResponse.json();
  const clip = clipData.item || clipData;

  if (clip.audio_src) {
    return new Response(
      JSON.stringify({ audioUrl: clip.audio_src }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Poll for completion
  const clipUuid = clip.uuid;
  let attempts = 0;
  const maxAttempts = 20;

  while (attempts < maxAttempts) {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const statusResponse = await fetch(`https://app.resemble.ai/api/v2/projects/${projectUuid}/clips/${clipUuid}`, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (statusResponse.ok) {
      const statusData = await statusResponse.json();
      const statusClip = statusData.item || statusData;

      if (statusClip.audio_src) {
        return new Response(
          JSON.stringify({ audioUrl: statusClip.audio_src }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    attempts++;
  }

  return new Response(
    JSON.stringify({ error: 'Audio generation timed out' }),
    { status: 408, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
}
