const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const OPENAI_API_URL = 'https://api.openai.com/v1';

export async function analyzeReceipt(imageBase64: string) {
  try {
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
            role: "user",
            content: [
              {
                type: "text",
                text: "Extract the following information from this receipt: total amount, date, merchant name, and items purchased. Format the response as JSON with these fields: amount, date, place, items."
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
      throw new Error('Failed to analyze receipt');
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    if (!result) throw new Error('No result from OpenAI');

    // Parse the JSON response
    const parsedResult = JSON.parse(result);
    return parsedResult;
  } catch (error) {
    console.error('Error analyzing receipt:', error);
    throw error;
  }
}

export async function transcribeAudio(audioBlob: Blob) {
  try {
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
      throw new Error('Transcription failed');
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw error;
  }
}

export async function extractTransactionDetails(text: string) {
  try {
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
            content: "Extract transaction details from the text. Format the response as JSON with these fields: amount, category, place, date (in ISO format), description."
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
      throw new Error('Failed to extract transaction details');
    }

    const data = await response.json();
    const result = data.choices[0].message.content;
    if (!result) throw new Error('No result from OpenAI');

    // Parse the JSON response
    const parsedResult = JSON.parse(result);
    return parsedResult;
  } catch (error) {
    console.error('Error extracting transaction details:', error);
    throw error;
  }
} 