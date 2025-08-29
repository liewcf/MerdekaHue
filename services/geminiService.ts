import { GoogleGenAI, Modality } from "@google/genai";
import type { ImageFile } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const PROMPT = `
You are a master digital artist specializing in photorealistic apparel design and abstract expressionist backgrounds. Your task is to perform two main edits on this photo:
1.  Recolor the apparel worn by the person with a photorealistic finish.
2.  Replace the background with a new, high-resolution, painterly abstract background.

**Strict Instructions for Apparel (Photorealistic Edit):**
1.  **Target Only Apparel:** Recolor only the apparel (shirt, t-shirt, blouse, jacket).
2.  **Preserve Person:** The person's face, skin tone, hair, and accessories (like glasses or jewelry) must remain completely untouched and identical to the original. Pay special attention to preserving reflections in glasses. The person must remain photorealistic.
3.  **Preserve Fabric Details:** The recolored apparel must retain the original fabric's texture, folds, wrinkles, shadows, and highlights. The effect should look natural, not like a flat overlay.
4.  **Apply Malaysian-inspired Colors:** Recolor the apparel using a creative and artistic combination of red (#E41E26), white (#FFFFFF), blue (#0018A8), and yellow (#FFD700). Do not recreate the Malaysian flag itself. Instead, create a stylish, modern pattern or design using these colors that would look good on clothing. The result should be tasteful and visually appealing.

**Strict Instructions for Background (Painterly Abstract Edit):**
1.  **Replace Background:** Completely replace the original background with a new, painterly abstract background for Merdeka.
2.  **Style and Elements:** Use dynamic brushstrokes, rich textures, and subtle gold leaf accents. The style should emphasize motion and festive energy.
3.  **Composition for Portrait:** Keep the central area of the background low-detail and soft. This is crucial for compositing the portrait overlay. The edges should be seamless.
4.  **Seamless Integration:** The photorealistic person from the original photo must be seamlessly and artistically integrated into this new abstract background. The lighting on the subject must be adjusted to match the new background's atmosphere, while preserving their original facial details.
5.  **Resolution:** The final background should be ultra-high resolution.
6.  **Negative Constraints:** The new background must NOT contain any Malaysia flags, flag motifs, text, watermarks, or logos.

**Final Output:**
Provide only the final edited image as a high-resolution PNG. Do not add any text, watermarks, or other artifacts. The output must be a single, high-quality composite image blending a photorealistic person with a painterly background.
`;

export const recolorImage = async (imageFile: ImageFile): Promise<string> => {
  const base64Data = imageFile.base64.split(',')[1];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Data,
              mimeType: imageFile.mimeType,
            },
          },
          {
            text: PROMPT,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    if (
        response.candidates &&
        response.candidates.length > 0 &&
        response.candidates[0].content &&
        response.candidates[0].content.parts
    ) {
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                const mimeType = part.inlineData.mimeType || 'image/png';
                const base64ImageBytes = part.inlineData.data;
                return `data:${mimeType};base64,${base64ImageBytes}`;
            }
        }
    }

    throw new Error("The model did not return an image. It might be due to a safety policy violation or an issue with the input.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unexpected error occurred while processing the image.");
  }
};