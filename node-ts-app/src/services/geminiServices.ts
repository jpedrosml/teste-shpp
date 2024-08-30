import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI, GenerateContentResult } from "@google/generative-ai";
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}

const fileManager = new GoogleAIFileManager(apiKey);
const genAI = new GoogleGenerativeAI(apiKey);

export const getReadingFromImage = async (imageBase64: string) => {
    try {
        const tempFilePath = path.join(__dirname, '..', 'uploads', 'temp-image.jpg');

        const buffer = Buffer.from(imageBase64, 'base64');
        if (buffer.length === 0) {
            throw new Error("Buffer da imagem base64 está vazio");
        }

        fs.writeFileSync(tempFilePath, buffer);

        const uploadResponse = await fileManager.uploadFile(tempFilePath, {
            mimeType: "image/jpeg",
            displayName: "Uploaded Image"
        });

        fs.unlinkSync(tempFilePath); 

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-pro"
        });

        console.log("Calling api...", {
            fileData: {
                mimeType: uploadResponse.file.mimeType,
                fileUri: uploadResponse.file.uri
            },
            text: "Extract the reading from this image."
        });

        const result: GenerateContentResult = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri
                }
            },
            { text: "Extract the reading from this image." }
        ]);

        console.log("API's response:", result);

        if (result.response.text) { 
            const extractedText = result.response.text(); 
            if (extractedText) {
                return {
                    imageUrl: uploadResponse.file.uri, 
                    measureValue: parseInt(extractedText, 10), 
                    measureUuid: "UUID_PLACEHOLDER"
                };
            } else {
                throw new Error("Failed to extract reading from the image.");
            }
        } else {
            throw new Error("No valid response found in result.");
        }
    } catch (error) {
        console.error("Error calling the API: ", error);
        throw error;
    }
};