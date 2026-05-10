require('dotenv').config({ path: './backend/.env' });

const testGemini = async () => {
  const url = process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";
  const key = process.env.GOOGLE_API_KEY;

  console.log('Testing Gemini API...');
  console.log('URL:', url);
  console.log('Key:', key ? 'FOUND' : 'MISSING');

  const prompt = "Say 'Hello, API is working!' if you can read this.";

  try {
    const response = await fetch(`${url}?key=${key}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.error('API Error:', data);
      return;
    }

    console.log('API Response:', JSON.stringify(data, null, 2));
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log('Extracted Text:', aiText);
  } catch (error) {
    console.error('Fetch Error:', error);
  }
};

testGemini();
