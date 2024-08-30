import { Request, Response } from 'express';
import Measure from '../models/measure'; 

export const confirmMeasure = async (req: Request, res: Response) => {
    try {
        const { measure_uuid, confirmed_value } = req.body;

        if (!measure_uuid || typeof confirmed_value !== 'number') {
            return res.status(400).json({
                error_code: 'INVALID_DATA',
                error_description: 'Parâmetros inválidos: <>'
            });
        }

        const measure = await Measure.findOne({ measure_uuid });

        if (!measure) {
            return res.status(404).json({
                error_code: 'MEASURE_NOT_FOUND',
                error_description: 'Leitura não encontrada'
            });
        }   

        if (measure.confirmed) {
            return res.status(409).json({
                error_code: 'CONFIRMATION_DUPLICATE',
                error_description: 'Leitura já confirmada'
            });
        }

        measure.confirmed_value = confirmed_value;
        measure.confirmed = true;
        await measure.save();

        return res.status(200).json({ success: true });

    } catch (error) {
        console.error("Erro ao confirmar a leitura:", error);
        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Erro ao processar a solicitação'
        });
    }
};
