import { Request, Response } from 'express';
import Measure from '../models/measure';
import { getReadingFromImage } from '../services/geminiServices';
import { v4 as uuidv4 } from 'uuid';

const isValidBase64 = (str: string): boolean => {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (err) {
    return false;
  }
};

export const uploadMeasure = async (req: Request, res: Response) => {
    const { image, customer_code, measure_datetime, measure_type } = req.body;

    if (!image || !customer_code || !measure_datetime || !measure_type) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    if (!isValidBase64(image)) {
        return res.status(400).json({ message: 'Invalid base64 image string' });
    }

    try {
        const startOfMonth = new Date(new Date(measure_datetime).setDate(1));
        const existingMeasure = await Measure.findOne({
            customer_code,
            measure_type,
            measure_datetime: { $gte: startOfMonth },
        });

        if (existingMeasure) {
            return res.status(409).json({ message: 'Measure already exists for this month' });
        }

        const geminiResponse = await getReadingFromImage(image);

        if (geminiResponse && geminiResponse.measureValue !== undefined) {
            const { measureValue, imageUrl: geminiImageUrl, measureUuid } = geminiResponse;

            const gidentifier = uuidv4();  

            const simulatedImageUrl = `https://your-cdn.com/images/${gidentifier}`;

            const newMeasure = new Measure({
                image_url: simulatedImageUrl,
                customer_code,
                measure_datetime,
                measure_type,
                value: measureValue,
                gidentifier
            });

            await newMeasure.save();

            return res.status(201).json({
                imageUrl: simulatedImageUrl,
                gidentifier,
                value: measureValue,
                measureUuid
            });
        } else {
            return res.status(400).json({ message: 'Error retrieving reading from image' });
        }
    } catch (error) {
        console.error('Error processing the image:', error);
        return res.status(500).json({ message: 'Error processing the image', error });
    }
};
