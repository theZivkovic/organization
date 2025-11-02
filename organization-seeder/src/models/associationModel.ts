import { model, Schema } from "mongoose";

interface IAssociation extends Document {
    userId: string,
    placeId: string;
}

const associationSchema = new Schema<IAssociation>({
    userId: { type: String, required: true },
    placeId: { type: String, required: true }
});

const Association = model<IAssociation>('Association', associationSchema);

export { Association };    
export type { IAssociation };

