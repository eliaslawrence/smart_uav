// Elias Lawrence

function Decoder() {     
    
    this.decode = function(randomKeys) {
        let vehicle = new Vehicle(initX, initY, clients, energystations, obstacles, pg, 0, 0);
        let weights = [];
        
        for(let i = 0; i < randomKeys.length; i++){
            if(randomKeys[i] == null){
                console.log('erro');
            }
//            weights.push(randomKeys[i] * 2 - 1); // [0,1) -> [-1,1)
            weights.push(randomKeys[i]);
        }
        
        vehicle.brain.setWeights(weights);
        
        return vehicle;
    }  
    
}