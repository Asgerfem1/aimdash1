import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message } = await req.json();

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4-mini',
        messages: [
          {
            role: 'system',
            content: `You are a goal planning assistant. Help users break down their goals into actionable subtasks, suggest realistic timelines, and recommend priority levels (High, Medium, Low).
            Format your responses using this markdown structure:

            ### Goal Analysis
            [Provide a brief analysis of the goal's scope and requirements]

            ### Specific Subtasks
            1. **[Main Task 1]**
               - [Subtask 1.1]
               - [Subtask 1.2]

            2. **[Main Task 2]**
               - [Subtask 2.1]
               - [Subtask 2.2]

            ### Timeline Recommendations
            - [Task 1]: [Timeline]
            - [Task 2]: [Timeline]

            ### Priority Levels
            - High Priority: [Tasks]
            - Medium Priority: [Tasks]
            - Low Priority: [Tasks]

            ### Additional Tips
            - [Tip 1]
            - [Tip 2]`
          },
          { role: 'user', content: message }
        ],
      }),
    });

    const data = await response.json();
    const generatedText = data.choices[0].message.content;

    return new Response(JSON.stringify({ generatedText }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});