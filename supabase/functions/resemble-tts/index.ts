import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const { text, voiceUuid } = await req.json();

    if (!text) {
      return new Response(
        JSON.stringify({ error: 'Text is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log('Generating speech with Resemble AI for text:', text.substring(0, 50) + '...');

    // Use Resemble AI's sync endpoint for immediate audio generation
    const response = await fetch('https://app.resemble.ai/api/v2/projects?page=1&page_size=10', {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${RESEMBLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Resemble API error fetching projects:', response.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch projects from Resemble AI' }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const projectsData = await response.json();
    console.log('Projects data:', JSON.stringify(projectsData));

    // Get the first project
    const projects = projectsData.items || projectsData;
    if (!projects || projects.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No projects found in Resemble AI account' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const projectUuid = projects[0].uuid;
    console.log('Using project UUID:', projectUuid);

    // Get voices for the project
    const voicesResponse = await fetch(`https://app.resemble.ai/api/v2/projects/${projectUuid}/voices`, {
      method: 'GET',
      headers: {
        'Authorization': `Token token=${RESEMBLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    if (!voicesResponse.ok) {
      const errorText = await voicesResponse.text();
      console.error('Resemble API error fetching voices:', voicesResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch voices from Resemble AI' }),
        { 
          status: voicesResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const voicesData = await voicesResponse.json();
    console.log('Voices data:', JSON.stringify(voicesData));

    const voices = voicesData.items || voicesData;
    if (!voices || voices.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No voices found in Resemble AI project' }),
        { 
          status: 404, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const selectedVoiceUuid = voiceUuid || voices[0].uuid;
    console.log('Using voice UUID:', selectedVoiceUuid);

    // Create a clip using the sync endpoint
    const clipResponse = await fetch(`https://app.resemble.ai/api/v2/projects/${projectUuid}/clips`, {
      method: 'POST',
      headers: {
        'Authorization': `Token token=${RESEMBLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        voice_uuid: selectedVoiceUuid,
        body: text,
        is_public: false,
        is_archived: false,
        sample_rate: 22050,
        output_format: 'mp3',
      }),
    });

    if (!clipResponse.ok) {
      const errorText = await clipResponse.text();
      console.error('Resemble API error creating clip:', clipResponse.status, errorText);
      return new Response(
        JSON.stringify({ error: 'Failed to create audio clip' }),
        { 
          status: clipResponse.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const clipData = await clipResponse.json();
    console.log('Clip created:', JSON.stringify(clipData));

    // Check if audio is ready or we need to poll
    const clip = clipData.item || clipData;
    
    if (clip.audio_src) {
      // Audio is immediately available
      return new Response(
        JSON.stringify({ audioUrl: clip.audio_src, clipUuid: clip.uuid }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Need to poll for the audio
    const clipUuid = clip.uuid;
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const statusResponse = await fetch(`https://app.resemble.ai/api/v2/projects/${projectUuid}/clips/${clipUuid}`, {
        method: 'GET',
        headers: {
          'Authorization': `Token token=${RESEMBLE_API_KEY}`,
          'Content-Type': 'application/json',
        },
      });

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        const statusClip = statusData.item || statusData;
        
        if (statusClip.audio_src) {
          return new Response(
            JSON.stringify({ audioUrl: statusClip.audio_src, clipUuid: statusClip.uuid }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
      }
      
      attempts++;
    }

    return new Response(
      JSON.stringify({ error: 'Audio generation timed out' }),
      { 
        status: 408, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in resemble-tts function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
