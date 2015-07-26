GTE.TREE = (function (parentModule) {
    "use strict";

    /**
    * Creates a new Node.
    * @class
    * @param {Node} [parent] Parent node. If null, this is root.
    */
    function Node(parent, reachedBy, iset) {
        this.circle = null;
        this.parent = parent;
        this.children = [];
        this.iset = iset || null;
        this.reachedBy = reachedBy || null;
        if (parent === null) { // If this is root set level to 0
            this.level = 0;
        } else {
            parent.addChild(this);
            this.level = parent.level + 1;
        }
    }

    /**
    * ToString function
    */
    Node.prototype.toString = function () {
        return "Node: " + "children.length: " + this.children.length +
               "; level: " + this.level + "; reachedBy: " + this.reachedBy +
               "; iset: " + this.iset;
    };

    /**
    * Calculates the y of the circle depending. It needs to check for the positions
    * of the other nodes in the same iset
    */
    Node.prototype.calculateY = function () {
        var nodesInSameISet = this.iset.getNodes();
        // If it is alone
        if (nodesInSameISet.length === 1) {
            return this.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
        } else {
            var levels = [];
            // Iterate over the nodes in same iset and get the deepest level of all
            while (nodesInSameISet.length !== 0) {
                var node = nodesInSameISet.pop();
                if (levels.indexOf(node.level) === -1) {
                    levels.push(node.level);
                }
            }
            levels.sort();
            var y = levels[levels.length-1] * GTE.CONSTANTS.DIST_BETWEEN_LEVELS;
            if (levels[levels.length-1] !== this.level) {
                GTE.tree.recursiveMoveDownEverythingBelowNode(this,
                            y - this.level * GTE.CONSTANTS.DIST_BETWEEN_LEVELS);
            }
            return y;
        }
    };



    /**
    * Function that draws the node in the global canvas
    */
    Node.prototype.draw = function () {
        // TODO #19
        // The line has to be drawn before so that the circle is drawn on top of it
        if (this.reachedBy !== null) {
            this.reachedBy.draw(this.parent, this);
        }
        var thisNode = this;
        this.circle = GTE.canvas.circle(GTE.CONSTANTS.CIRCLE_SIZE)
                                .addClass('node')
                                .x(this.x)
                                .y(this.y)
                                .click(function() {
                                    thisNode.onClick();
                                });
    };

    /**
    * Function that defines the behaviour of the node on click
    */
    Node.prototype.onClick = function () {
        switch (GTE.MODE) {
            case GTE.MODES.ADD:
                // If there are more nodes in the information set
                // Remove the node from the iset since the iset will
                // not be coherent
                if (this.iset.numberOfNodes > 1) {
                    this.createSingletonISetWithNode();
                }
                this.iset.onClick();
                // Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.DELETE:
                GTE.tree.deleteNode(this);
                // // If it is a leaf, delete itself, if not, delete all children
                // if (this.isLeaf()) {
                //     this.delete();
                // } else {
                //     GTE.tree.deleteChildrenOf(this);
                // }
                // Tell the tree to redraw itself
                GTE.tree.draw();
                break;
            case GTE.MODES.MERGE:
                // This is controlled by the information set
                this.iset.onClick();
                break;
            case GTE.MODES.DISSOLVE:
                // This is controlled by the information set
                this.iset.onClick();
                break;
            default:
                break;
        }
    };

    /**
    * Function that adds child to node
    * @param {Node} node Node to add as child
    * @return {Move} The move that has been created for this child
    */
    Node.prototype.addChild = function (node) {
        this.children.push(node);
        return new GTE.TREE.Move(this, node);
    };

    /**
    * Function that removes child node from children
    * @param {Node} node Child node to remove
    */
    Node.prototype.removeChild = function (nodeToDelete) {
        var indexInList = this.children.indexOf(nodeToDelete);
        if (indexInList > -1) {
            this.children.splice(indexInList, 1);
        }
    };

    /**
    * Function that finds out if node is leaf
    * @return {Boolean} True if is leaf.
    */
    Node.prototype.isLeaf = function () {
        if (this.children.length === 0) {
            return true;
        }
        return false;
    };

    /**
    * Function that changes node's parent to a given one
    * @param {Node} newParent New parent for node
    */
    Node.prototype.changeParent = function (newParent) {
        if (this.parent !== null) {
            this.parent.removeChild(this);
        }
        this.parent = newParent;
        if (this.parent !== null) {
            this.parent.addChild(this);
        }
    };

    /**
    * Creates a new singleton information set with given node.
    * It creates a new move for each node's children
    */
    Node.prototype.createSingletonISetWithNode = function () {
        // Remove current node from current iset
        this.iset.removeNode(this);
        // Create a new iset and add current node to it
        GTE.tree.addNewISet().addNode(this);
        // Add as many moves as node's children
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].reachedBy = this.iset.addNewMove();
        }
    };

    /**
    * Changes current information set to a given one
    * @param {ISet} newISet New information set for current node
    */
    Node.prototype.changeISet = function (newISet) {
        // Remove the node for current information set
        this.iset.removeNode(this);
        // Add the node to the new information set
        newISet.addNode(this);
        // Set the new moves for current children
        // children[] and moves[] will have the same length
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].reachedBy = newISet.moves[i];
        }
    };

    /**
    * Function that tells node to delete himself
    */
    Node.prototype.delete = function () {
        // Delete all references to current node
        this.changeParent(null);
        this.iset.removeNode(this);
        this.reachedby = null;
        GTE.tree.positionsUpdated = false;
    };

    // Add class to parent module
    parentModule.Node = Node;

    return parentModule;
}(GTE.TREE)); // Add to GTE.TREE sub-module
