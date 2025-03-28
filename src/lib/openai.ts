const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

if (!OPENAI_API_KEY) {
  console.warn('OpenAI API key is not configured');
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
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "system",
            content: "You are a receipt analysis assistant. Extract the following information from the receipt: total amount, date, merchant name, and items purchased. Format the response as JSON with these fields: amount (number), date (YYYY-MM-DD), place (string), items (array of strings). If any field is unclear, use null."
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

    // Validate and format the result
    return {
      amount: parsedResult.amount || 0,
      date: parsedResult.date || new Date().toISOString().split('T')[0],
      place: parsedResult.place || '',
      items: Array.isArray(parsedResult.items) ? parsedResult.items : []
    };
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
      throw new Error(`Failed to transcribe audio: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Transcription Result:', data);
    return data.text;
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
            content: "You are a transaction analysis assistant. Extract the following information from the text: amount, category, place, date, and description. Use common expense categories like 'Food & Dining', 'Transportation', 'Shopping', 'Bills & Utilities', 'Entertainment', 'Health & Medical', 'Education', 'Travel', 'Gifts & Donations', or 'Other'. Format the response as JSON with these fields: amount (number), category (string), place (string), date (YYYY-MM-DD), description (string). If any field is unclear, use null."
          },
          {
            role: "user",
            content: text
          }
        ],
        max_tokens: 500
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

    // Validate and format the result
    return {
      amount: parsedResult.amount || 0,
      category: parsedResult.category || 'Other',
      place: parsedResult.place || '',
      date: parsedResult.date || new Date().toISOString().split('T')[0],
      description: parsedResult.description || ''
    };
  } catch (error) {
    console.error('Error extracting transaction details:', error);
    throw error;
  }
} 