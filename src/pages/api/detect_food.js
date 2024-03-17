export const runtime = 'experimental-edge';

async function detectFoodAndCalories(base64Image) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;
    const model = 'gemini-pro-vision'; // 指定使用的模型
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const match = base64Image.match(/^data:(image\/\w+);base64,(.*)$/);
    if (!match) {
        throw new Error('Invalid image data');
    }

    const mimeType = match[1];
    const base64Data = match[2];

    const requestBody = {
        contents: [
            {
                parts: [
                    {text: 'Identify the food in this picture and estimate the calories. Please make sure to return the content in this structure as JSON. {"items": ["ice", "apple"], "total_calories": xx} Just return JSON, do not include other content.'},
                    {
                        inline_data: {
                            mime_type: mimeType,
                            data: base64Data
                        }
                    }
                ]
            }
        ]
    };

    try {
        console.log("fetch");
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();
        const text = data.candidates[0].content.parts[0].text;
        const regex = /\{.*?\}/s; // The 's' flag allows . to match newline characters
        const match = text.match(regex);

        const jsonStr = match[0];
        console.log("Found JSON string:", jsonStr);

        const parsedData = JSON.parse(jsonStr);
        console.log("Parsed JSON:", parsedData);

        // Extract and return the items and total_calories from the parsed JSON
        return {
            success: true,
            items: parsedData.items,
            count: parsedData.total_calories
        };
    } catch (error) {
        console.error('调用API失败:', error);
        return {
            success: false,
            message: error.message // 使用标准的错误消息属性
        };
    }
}


export default async function handler(req, res) {
    if (req.method === 'POST') {
        const {image} = req.body;
        try {
            const {items, count} = await detectFoodAndCalories(image);
            res.status(200).json({items, count});
        } catch (error) {
            res.status(500).json({error: error.message});
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}