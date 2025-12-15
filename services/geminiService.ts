import { GoogleGenAI, Type, Schema } from "@google/genai";
import { SocialKitConfig, SocialKitResult } from "../types";

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const responseSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    analysis: {
      type: Type.OBJECT,
      properties: {
        summary: { type: Type.STRING, description: "Brief visual description of the image" },
        mood: { type: Type.STRING, description: "The emotional tone of the image" },
        keywords: { type: Type.ARRAY, items: { type: Type.STRING }, description: "5 key visual elements" }
      },
      required: ["summary", "mood", "keywords"]
    },
    captions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          platform: { type: Type.STRING, description: "e.g., Instagram, TikTok" },
          hook: { type: Type.STRING, description: "Attention grabbing opening line (max 10 words)" },
          text: { type: Type.STRING, description: "Short, punchy caption body (max 2 sentences)" },
          cta: { type: Type.STRING, description: "Short call to action" }
        },
        required: ["platform", "hook", "text", "cta"]
      }
    },
    hashtags: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, enum: ["Reach (High Vol)", "Niche (Targeted)", "Community (Low Vol)"] },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["category", "tags"]
      }
    },
    scripts: {
      type: Type.OBJECT,
      properties: {
        tiktok: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            scene_breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  visual: { type: Type.STRING },
                  audio: { type: Type.STRING }
                }
              }
            },
            cta: { type: Type.STRING }
          }
        },
        shorts: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            hook: { type: Type.STRING },
            scene_breakdown: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  timestamp: { type: Type.STRING },
                  visual: { type: Type.STRING },
                  audio: { type: Type.STRING }
                }
              }
            },
            cta: { type: Type.STRING }
          }
        }
      }
    },
    linkedin_post: { type: Type.STRING, description: "Professional post for LinkedIn" },
    twitter_thread: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Array of tweets for a thread" }
  },
  required: ["analysis", "captions", "hashtags", "scripts", "linkedin_post", "twitter_thread"]
};

export const generateContent = async (
  apiKey: string,
  imageBase64: string,
  mimeType: string,
  config: SocialKitConfig
): Promise<SocialKitResult> => {
  if (!apiKey) throw new Error("API Key is required");

  const ai = new GoogleGenAI({ apiKey });

  const systemInstruction = `
    You are an expert Social Media Manager and Content Strategist.
    Your goal is to analyze the provided image and generate a complete social media kit.
    
    Configuration:
    - Tone: ${config.tone}
    - Include Emojis: ${config.includeEmoji}
    - Language: ${config.language}
    
    IMPORTANT RULES:
    1. **Captions must be SHORT and EFFECTIVE.** Avoid long paragraphs. Focus on viral hooks and punchy 1-2 sentence bodies.
    2. **Hooks** must stop the scroll.
    3. **Video scripts** should be fast-paced.
    
    Deliverables:
    1. Visual analysis of the image.
    2. 3 distinct caption variations (Instagram, Generic, Story).
    3. 3 sets of hashtags (High volume, Niche, Community).
    4. Video scripts for TikTok and YouTube Shorts based on the image context (imagining the image as a thumbnail or keyframe).
    5. A short and professional LinkedIn post.
    6. A Twitter/X thread (3-5 tweets).
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: mimeType,
            data: imageBase64
          }
        },
        {
          text: "Generate a comprehensive social media kit for this image."
        }
      ]
    },
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: responseSchema,
      thinkingConfig: { thinkingBudget: 0 } // Disable thinking for speed on flash model
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response generated");

  return JSON.parse(text) as SocialKitResult;
};