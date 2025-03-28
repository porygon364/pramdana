const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

if (!OPENAI_API_KEY) {
  console.error('OpenAI API key is not set. Please check your environment variables.');
}

export async function analyzeReceipt(imageBase64: string) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    console.log('Starting receipt analysis...');
    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a receipt analysis assistant. Extract the following information from the receipt: total amount, date, merchant name, and items purchased. Format the response as JSON with these fields: amount, date, place, items."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this receipt and extract the key information."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`Failed to analyze receipt: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', data);
    
    const result = data.choices[0].message.content;
    if (!result) throw new Error('No result from OpenAI');

    // Parse the JSON response
    const parsedResult = JSON.parse(result);
    console.log('Parsed Result:', parsedResult);
    return parsedResult;
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    throw error;
  }
}

export async function transcribeAudio(audioBlob: Blob) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    console.log('Starting audio transcription...');
    const formData = new FormData();
    formData.append('file', audioBlob, 'audio.wav');
    formData.append('model', 'whisper-1');

    const response = await fetch(`${OPENAI_API_URL}/audio/transcriptions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`Transcription failed: ${errorData.error?.message || response.statusText}`);
    }

    const result = await response.json();
    console.log('Transcription Result:', result);
    return result.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

export async function extractTransactionDetails(text: string) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured');
  }

  try {
    console.log('Starting transaction details extraction...');
    const response = await fetch(`${OPENAI_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a transaction analysis assistant. Extract transaction details from the text. Format the response as JSON with these fields: amount, category, place, date (in ISO format), description. Use common expense categories like Food, Transport, Shopping, Bills, etc."
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 200
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      throw new Error(`Failed to extract transaction details: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('OpenAI API Response:', data);
    
    const result = data.choices[0].message.content;
    if (!result) throw new Error('No result from OpenAI');

    // Parse the JSON response
    const parsedResult = JSON.parse(result);
    console.log('Parsed Result:', parsedResult);
    return parsedResult;
  } catch (error) {
    console.error('Error extracting transaction details:', error);
    throw error;
  }
} 