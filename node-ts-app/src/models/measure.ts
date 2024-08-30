import mongoose, { Schema, Document } from 'mongoose';

interface IMeasure extends Document {
    measure_uuid: string;
    measure_value: number;
    confirmed_value?: number;
    confirmed: boolean;
    measure_type: 'WATER' | 'GAS';  
    image_url: string;              
    measure_datetime: Date;       
    customer_code: string;          
}

const MeasureSchema: Schema = new Schema({
    measure_uuid: { type: String, required: true, unique: true },
    measure_value: { type: Number, required: true },
    confirmed_value: { type: Number },
    confirmed: { type: Boolean, default: false },
    measure_type: { type: String, required: true, enum: ['WATER', 'GAS'] }, 
    image_url: { type: String, required: true },      
    measure_datetime: { type: Date, required: true }, 
    customer_code: { type: String, required: true },  
});

export default mongoose.model<IMeasure>('Measure', MeasureSchema);
