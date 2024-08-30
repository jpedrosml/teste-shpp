import { Request, Response } from 'express';
import Measure from '../models/measure';

export const listMeasures = async (req: Request, res: Response) => {
    try {
        const { customer_code } = req.params;
        let { measure_type } = req.query;

        if (measure_type) {
            measure_type = (measure_type as string).toUpperCase();
            if (measure_type !== 'WATER' && measure_type !== 'GAS') {
                return res.status(400).json({
                    error_code: 'INVALID_TYPE',
                    error_description: 'Tipo de medição não permitida'
                });
            }
        }

        const query: any = { customer_code: customer_code.toUpperCase() }; 

        if (measure_type) {
            query.measure_type = measure_type;
        }

        const measures = await Measure.find(query);

        if (measures.length === 0) {
            return res.status(404).json({
                error_code: 'MEASURES_NOT_FOUND',
                error_description: 'Nenhuma leitura encontrada'
            });
        }

        const response = {
            customer_code,
            measures: measures.map(measure => ({
                measure_uuid: measure.measure_uuid,
                measure_datetime: measure.measure_datetime,
                measure_type: measure.measure_type,
                has_confirmed: measure.confirmed,
                image_url: measure.image_url
            }))
        };

        return res.status(200).json(response);

    } catch (error) {
        console.error("Erro ao listar as leituras:", error);
        return res.status(500).json({
            error_code: 'SERVER_ERROR',
            error_description: 'Erro ao processar a solicitação'
        });
    }
};
