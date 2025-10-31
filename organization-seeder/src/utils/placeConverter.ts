import {PlaceType} from "../models/placeModel";
import { Stack } from "./stack";

type IDataNode = {
    name: string;
    type: PlaceType;
    children?: any[];
}

type IPlaceNode = {
    name: string;
    type: PlaceType;
    children?: any[];
    left?: number;
    right?: number;
}


function buildPlacesFromData(data: any): Map<string, IPlaceNode> {
    
    let stack = new Stack<IPlaceNode>();
    let counter = 1;
    let result = new Map<string, IPlaceNode>();

    stack.push({
        name: data.name,
        type: data.type,
        children: data.children || [],
    });

    result.set(data.name, { 
        name: data.name, 
        type: data.type,
        left: counter++ 
    });

    while(stack.size() > 0) {
        const currentNode = stack.peek();
        
        if (!currentNode){
            break;
        }

        console.log('Processing node:', currentNode.name);

        if (!result.has(currentNode.name)){
            result.set(currentNode.name, {
                name: currentNode.name,
                type: currentNode.type, 
                left: counter++ });
        }

        const notProcessedChildren = (currentNode.children?.reverse() ?? [])
            .filter((child: any) => !result.has(child.name));
        
        notProcessedChildren.forEach((child: any) => {
            stack.push({
                name: child.name,
                type: child.type,
                children: child.children || [],
            });
        });

        if (notProcessedChildren.length === 0) {
            result.set(currentNode.name, {...result.get(currentNode.name) as IPlaceNode, right: counter++});
            stack.pop();
        }
    }
    return result;
}

export { buildPlacesFromData };