import { Request, Response } from 'express';
import { getReadingFromImage } from '../services/geminiServices';  

export const getGeminiContent = async (req: Request, res: Response) => {
    try {
        const { image, customer_code, measure_datetime, measure_type } = req.body;

        if (!image || typeof image !== 'string') {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Imagem base64 inválida'
            });
        }
        if (!customer_code || !measure_datetime || !measure_type) {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Campos obrigatórios estão ausentes'
            });
        }

        const result = await getReadingFromImage(image);

        const isDuplicate = false; 
        if (isDuplicate) {
            return res.status(409).json({
                error_code: 'DOUBLE_REPORT',
                error_description: 'Leitura do mês já realizada'
            });
        }

        res.status(200).json({
            image_url: result.imageUrl,  
            measure_value: result.measureValue,  
            measure_uuid: result.measureUuid  
        });
    } catch (error) {
        console.error("Error calling the api:", error);
        res.status(500).send('failed while processing the image');
    }
};
