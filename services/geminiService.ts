
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a detailed prompt for logo creation based on a simple user description.
 * @param description - The user's description of their company and logo idea.
 * @returns A detailed prompt string for an image generation model.
 */
export const generateLogoPrompt = async (description: string): Promise<string> => {
  const model = "gemini-2.5-flash";
  const prompt = `Based on the following company description, create a single, detailed, and effective prompt for an AI image generator to design a professional logo. The prompt should specify a modern, minimalist, vector-style logo that is simple, memorable, and visually appealing. Do not include any text in the logo itself.
  
  Company Description: "${description}"
  
  The generated prompt should be a single paragraph.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating logo prompt:", error);
    throw new Error("Failed to generate a creative prompt from your description.");
  }
};

/**
 * Generates a logo image using the Imagen 4.0 model.
 * @param prompt - The detailed prompt for the image generation model.
 * @param aspectRatio - The desired aspect ratio for the image.
 * @returns A base64 encoded string of the generated JPEG image.
 */
export const generateLogoImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const model = 'imagen-4.0-generate-001';
    try {
        const response = await ai.models.generateImages({
            model: model,
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio as "1:1" | "3:4" | "4:3" | "9:16" | "16:9",
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages[0].image.imageBytes;
        } else {
            throw new Error("Image generation failed, no images were returned.");
        }
    } catch (error) {
        console.error("Error generating logo image:", error);
        throw new Error("Failed to generate the logo image. The model might be busy or the prompt could be unsuitable.");
    }
};
