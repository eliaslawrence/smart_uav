// Elias Lawrence

function AStar(start_x, start_y, end_x, end_y, step_, radius_){
    // Create start and end node
    this.start_node = new AStarNode(null, start_x, start_y);
    this.end_node   = new AStarNode(null,   end_x,   end_y);

    // Initialize both open and closed list
    this.open_list   = [];
    this.closed_list = [];

    // Add the start node
    this.open_list.push(this.start_node);

    // Current node
    this.current_node;
    this.current_index;  
    
    this.path = [];
    
    this.step   =   step_;
    this.radius = radius_;
    
    this.end = false;
    
    this.astar = function() /* return the route with a sub path from START point to END modified */
    {    

        if(!this.end){
        // Loop until you find the end
//        while(this.open_list.length > 0){

            // Get the current node of smaller value of f
            this.current_node = this.open_list[0];
            this.current_index = 0;

            for (let index = 0; index < this.open_list.length; index++) {
                if(this.open_list[index].f < this.current_node.f){
                    this.current_node  = this.open_list[index];
                    this.current_index = index;
                }
            }

            // Pop current node off open list and add it to the closed list        
            this.closed_list.push(createVector(this.current_node.pnt.x, this.current_node.pnt.y));
            this.open_list.splice(this.current_index, 1);
            
//            console.log(this.current_node.pnt);

            // Found the goal
            if(this.current_node.insideRadius(this.end_node, this.radius)){
//            if(this.current_node.equals(this.end_node)){
                
//                let path = [];
//
                console.log("end");
                this.end = true;
                while (this.current_node) {
                    this.path.push(createVector(this.current_node.pnt.x, this.current_node.pnt.y));
                    this.current_node = this.current_node.parent;
                }
                
                

                // Reverse the path
    //            for (int i = temp.size() - 1; i >= 0; i--) {
    //                Solution_Pair p = Solution_Pair(temp[i]);
    //                path.add_solution_pair(p);
    //            }

                // Delete from memory

    //            open_list.clear();
    //            closed_list.clear();
    //            for (int i = 0; i < open_list.size(); i++) {
    //                delete open_list[i];
    //            }

    //            for (int i = 0; i < closed_list.size(); i++) {
    //                delete closed_list[i];
    //            }

    //            temp.clear();

                // Return
//                return path;
                return;
            }

            // Generate children
            let children = this.current_node.adjacents(true, this.step, this.radius);

            // Loop through children
            next_iteration: for (child of children) {

                // Child is on the closed list
                for (closed_child of this.closed_list) {
                    if(child.pnt.x == closed_child.x && child.pnt.y == closed_child.y){
                        continue next_iteration;
                    }
                }

                // Set f, g and h values
                child.g = this.current_node.g + 1;
                child.h = (child.pnt.x - this.end_node.pnt.x)*(child.pnt.x - this.end_node.pnt.x) + (child.pnt.y - this.end_node.pnt.y)*(child.pnt.y - this.end_node.pnt.y);
                child.f = child.g + child.h;

                // Child is already on the open list and better path
                for (open_node of this.open_list) {
                    if(child.equals(open_node) && child.g > open_node.g){
                        continue next_iteration;
                    }
                }

                // Add the child to the open list
                this.open_list.push(child);
            }
//        }
        }
    }
    
    this.show = function(){
        let l = 5;
        pg.push();
        pg.noStroke();
        
        if(!this.end){
           // Open list
            pg.fill(0, 255, 0);
            for (open_node of this.open_list) {
                pg.rect(open_node.pnt.x - l/2, open_node.pnt.y - l/2, l, l); 
            }

            // Closed list
            pg.fill(0, 0, 255);
            for (closed_child of this.closed_list) {
                pg.rect(closed_child.x - l/2, closed_child.y - l/2, l, l); 
            }

            let node = this.current_node;

            pg.fill(255);
            pg.stroke(0);
            while (node) {
                pg.rect(node.pnt.x - l/2, node.pnt.y - l/2, l, l);
                node = node.parent;
            } 
        }  else {
            
            pg.fill(255);
            pg.stroke(0);
            for(let i = 0; i < this.path.length - 1; i+=2){
                pg.line(this.path[i].x, this.path[i].y, this.path[i+1].x, this.path[i+1].y);
                pg.rect(this.path[i].x - l/2, this.path[i].y - l/2, l, l);              
                pg.rect(this.path[i+1].x - l/2, this.path[i+1].y - l/2, l, l);
            } 
            
        }                              
        
        pg.pop();
    }
}