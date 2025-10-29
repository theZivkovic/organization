
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { TreeNodeType } from '../tree';

export type NodeDocument = HydratedDocument<Node>;


@Schema()
export class Node {
  @Prop({required: true})
  name: string;

  @Prop({required: true, enum: TreeNodeType})
  type: TreeNodeType;

  @Prop()
  left: number;
  
  @Prop()
  right: number;
}

export const NodeSchema = SchemaFactory.createForClass(Node);
