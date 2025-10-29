import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Node } from "../schemas/nodeSchema";
import { Model } from "mongoose";

@Injectable()
export class NodeRepository {
  constructor(@InjectModel(Node.name) private nodeModel: Model<Node>) {}

  countNodes(): Promise<number> {
    return this.nodeModel.countDocuments().exec();
  }

  findByName(name: string): Promise<Node | null> {
    return this.nodeModel.findOne({ name }).exec();
  };

  findAllDescendants(node: Node): Promise<Node[]> {
    return this.nodeModel.find({ 
        left: { $gt: node.left}, 
        right: {$lt: node.right} 
    }).exec();
  }

  insert(node: Partial<Node>): Promise<Node> {
    const newNode = new this.nodeModel(node);
    return newNode.save();
  }
}