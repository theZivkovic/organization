import { model, Schema } from "mongoose";

enum PlaceType {
    OFFICE = 'OFFICE',
    STORE = 'STORE'
};

interface IPlace extends Document {
    name: string,
    type: PlaceType,
    left: number,
    right: number;
}

const placeSchema = new Schema<IPlace>({
    name: { type: String, required: true },
    type: { type: String, enum: Object.values(PlaceType), required: true },
    left: { type: Number, required: true },
    right: { type: Number, required: true }
});

const Place = model<IPlace>('Place', placeSchema);

export { Place, PlaceType };    
export type { IPlace };

