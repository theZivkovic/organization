import { Stack } from "./stack";

enum TreeNodeType {
    OFFICE,
    STORE
};

class TreeNode {
    name: string;
    type: TreeNodeType;
    children: TreeNode[];
    left: number;
    right: number;
    
    constructor(name: string, type: TreeNodeType) {
        this.name = name;
        this.type = type;
        this.children = [];
    }

    addChild(child: TreeNode) {
        this.children.push(child);
        return child;
    }

    addChildren(children: TreeNode[]) {
        this.children.push(...children);
        return this;
    }
}

class Tree {
    root: TreeNode;

    constructor(root: TreeNode) {
        this.root = root;
    }

    addChildren(children: Array<TreeNode>){
        this.root.addChildren(children);
        return this;
    }
}


const t = 
new Tree(new TreeNode("Srbija", TreeNodeType.OFFICE))
.addChildren([
    new TreeNode("Vojvodina", TreeNodeType.OFFICE)
        .addChildren([
            new TreeNode("Severnobacki okrug", TreeNodeType.OFFICE)
                .addChild(new TreeNode("Subotica", TreeNodeType.OFFICE))
                    .addChild(new TreeNode("Radnja 1", TreeNodeType.STORE)),
            new TreeNode("Juznobacki okrug", TreeNodeType.OFFICE)
                .addChild(new TreeNode("Novi Sad", TreeNodeType.OFFICE))
                    .addChildren([
                        new TreeNode("Detelinara", TreeNodeType.OFFICE),
                        new TreeNode("Liman", TreeNodeType.OFFICE)
                    ])
        ]),
    new TreeNode("Grad Beograd", TreeNodeType.OFFICE),
])

function printTree(tree: Tree){
    let num = 1;
    const stack = new Stack<TreeNode>();
    stack.push(t.root);

    while(stack.size() > 0) {
        const node = stack.peek();
        console.log(`Processing node: ${node?.name}`);
        
        if (!node){
            break;
        }

        if (node.children.length > 0){
            node.left = num;
            node.children.forEach(child => stack.push(child));
        }
        else {
            node.right = num;
            stack.pop();
            console.log(`${node.name} (${node.left}, ${node.right})`);
        }

        num++;
    }
}

export { Tree, TreeNode, TreeNodeType, printTree, t };




