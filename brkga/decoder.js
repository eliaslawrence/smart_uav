// Elias Lawrence

function Decoder() {     
    
    this.decode = function(randomKeys) {
        let vehicle = new Vehicle(problem, pg, 0, 0);
        let weights = [];
        
        for(let i = 0; i < randomKeys.length; i++){
            if(randomKeys[i] == null){
                console.log('erro');
            }
            let weight = randomKeys[i] * 2 - 1; // [0,1) -> [-1,1)
            weights.push(parseFloat(weight.toFixed(3))); 
//            weights.push(randomKeys[i]);
        }
        
        vehicle.brain.setWeights(weights);
        
        return vehicle;
    }  
    
}