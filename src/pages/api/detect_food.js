export const runtime = "experimental-edge";

export const config = {
  api: {
    responseLimit: "100mb",
  },
};

// Function to detect food and calories from a base64 encoded image
async function detectFoodAndCalories(base64Image) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
  const model = "gemini-2.5-pro"; // Specified model for detection
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  // Extract MIME type and pure base64 data from the image string
  const match = base64Image.match(/^data:(image\/\w+);base64,(.*)$/);
  if (!match) {
    throw new Error("Invalid image data format.");
  }

  const mimeType = match[1];
  const base64Data = match[2];

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: 'Identify the food in this picture and estimate the calories. Please make sure to return the content in this structure as JSON. {"items": ["ice", "apple"], "total_calories": xx} Just return JSON, do not include other content.',
          },
          {
            inline_data: {
              mime_type: mimeType,
              data: base64Data,
            },
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(
        `API call failed with status: ${response.status}, ${await response.text()}`,
      );
    }

    const data = await response.json();
    const text = data.candidates[0].content.parts[0].text;
    const regex = /\{.*?\}/s; // The 's' flag allows '.' to match newline characters
    const match = text.match(regex);

    if (!match) {
      throw new Error("No valid JSON found in the response.");
    }

    const jsonStr = match[0];
    const parsedData = JSON.parse(jsonStr);

    // Return the extracted items and total_calories from the parsed JSON
    return {
      items: parsedData.items,
      count: parsedData.total_calories,
    };
  } catch (error) {
    console.error("API call failed:", error);
    throw new Error(`Failed to detect food and calories: ${error.message}`);
  }
}

// Handler for the Cloudflare Worker
export default async function handler(req) {
  if (req.method === "POST") {
    try {
      const { image } = await req.json(); // Parse the image from the POST request's body
      const { items, count } = await detectFoodAndCalories(image);

      // Create and return a successful response
      return new Response(JSON.stringify({ items, count, success: true }), {
        headers: { "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error) {
      // Create and return an error response
      return new Response(
        JSON.stringify({ success: false, message: error.message }),
        {
          headers: { "Content-Type": "application/json" },
          status: 500,
        },
      );
    }
  } else {
    // Return a 405 Method Not Allowed response for non-POST requests
    return new Response(`Method ${req.method} Not Allowed`, {
      headers: { Allow: "POST" },
      status: 405,
    });
  }
}
