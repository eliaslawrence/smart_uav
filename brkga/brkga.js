// Elias Lawrence

function BRKGA(_maxPopSize, _chromoSize, _top, _bot, _rho, _decoder) {        
    this.decoder = _decoder;
    
    this.maxPopSize = _maxPopSize;
    this.chromoSize = _chromoSize;
    this.top        = _top;
    this.bot        = _bot;
    this.rho        = _rho;
    
    this.eliteSize     = parseInt(this.top * this.maxPopSize);
    this.mutantSize    = parseInt(this.bot * this.maxPopSize);
    this.crossoverSize = this.maxPopSize - this.eliteSize - this.mutantSize;
    
    this.eliteStartIndex     = 0;
    this.eliteEndIndex       = this.eliteStartIndex + this.eliteSize;
    
    this.crossoverStartIndex = this.eliteEndIndex;
    this.crossoverEndIndex   = this.crossoverStartIndex + this.crossoverSize;
    
    this.mutantStartIndex    = this.crossoverEndIndex;
    this.mutantEndIndex      = this.mutantStartIndex + this.mutantSize;
    
    this.fixedRK = [];
    
    this.population = [];
    
    // RK
    this.generateRandomKeys = function() {
        let rk = [];
        for(let i = 0; i < this.chromoSize; i++){
//            if(this.fixedRK[i] != null){
//                rk.push(this.fixedRK[i]);
//            } else {
//                rk.push(random(-1,1));
//                this.fixedRK.push(rk[i]);
//            }
            rk.push(random(-1,1));
        }  
        
        return rk;
//        return fixedRK;
    }
    
    // Initial Population
    this.generateInitialPopulation = function() {
        let initialPop = [];
        for(let i = 0; i < this.maxPopSize; i++){
            let rk  = this.generateRandomKeys();
            let ind = this.decoder.decode(rk);
            initialPop.push({rk: rk, individual: ind});
        }  
        
        return initialPop;
    } 
    
    this.loadInitialPopulation = function(data) {
        let initialPop = [];
        
        let i;
        for(i = 0; i < this.maxPopSize || i < data.population.length; i++){
            let rk  = data.population[i];
            let ind = this.decoder.decode(rk);
            initialPop.push({rk: rk, individual: ind});
        }  
        
        // If maxPopSize is greater than model saved
        for(i; i < this.maxPopSize; i++){
            let rk  = this.generateRandomKeys();
            let ind = this.decoder.decode(rk);
            initialPop.push({rk: rk, individual: ind});
        }  
        
        return initialPop;
    }
    
    this.savePopulation = function(population) {
        let modelToSave = {};
        modelToSave.population = [];
        for(let i = 0; i < this.maxPopSize; i++){
            modelToSave.population.push(population[i].rk);            
        }  
        
        save(modelToSave, 'model.json');
    }
    
    // Crossover
    this.electParents = function(population) {
        let rollElite    = parseInt(random(this.eliteStartIndex, this.eliteEndIndex));
        let rollNonElite = parseInt(random(this.eliteEndIndex, this.maxPopSize));
        
        let parents = {elite: population[rollElite], nonElite: population[rollNonElite]};
        
        return parents;
    }
    
    this.mating = function(parents) {
        let eliteParent    = parents.elite;
        let nonEliteParent = parents.nonElite;
        
        let child = [];
        for(let i = 0; i < this.chromoSize; i++){
            let roll  = random(1);
            child.push(roll <= this.rho ? eliteParent.rk[i] : nonEliteParent.rk[i]);
        }  
        
        return child;
    }
    
    this.crossover = function(population, newPopulation) {        
        for(let i = 0; i < this.crossoverSize; i++){
            let parents = this.electParents(population);            
            
            let rk  = this.mating(parents);
            let ind = this.decoder.decode(rk);
            
            newPopulation[this.crossoverStartIndex + i] = {rk: rk, individual: ind};
        }  
        
        return newPopulation;
    }
    
    // Mutation
    this.mutate = function(population, newPopulation) {        
        for(let i = this.mutantStartIndex; i < this.mutantEndIndex; i++){
            let index = parseInt(random(this.crossoverStartIndex, this.maxPopSize));
            
            let rk  = population[index].rk;
            
//            let rk  = this.generateRandomKeys();
            let ind = this.decoder.decode(rk);
            
            newPopulation[i] = {rk: rk, individual: ind};
        }  
        
        return newPopulation;
    }    
    
    // Elite
    this.elite = function(population, newPopulation) { 
        for(let i = 0; i < this.eliteEndIndex; i++){
            
            let rk  = population[i].rk;
            let ind = this.decoder.decode(rk);
            
            newPopulation[i] = {rk: rk, individual: ind};
        }  
        
        return newPopulation;
    }   
    
    // Rank population according to fitness
    this.rank = function(population) {
        population.sort(function(a, b){
            
            let better = a.individual.betterThan(b.individual);
            if (better) {
              return -1;
            }
            
            return 1;
            
//            return a.individual.betterThan(b.individual) ? -1 : 1;
        })
        
        return population
    }
        
    this.exec = function(population, numGenerations) {   
        console.log("rank");
        let newPopulation;
        
        for(let g = 0; g < numGenerations; g++){
            // copy population
//            newPopulation = [...population];
            newPopulation = this.rank(population);
            
            newPopulation = this.elite(population, newPopulation);
            newPopulation = this.crossover(population, newPopulation);
            newPopulation = this.mutate(population, newPopulation);
            
            population = newPopulation;
        }
        
        return population;
    };    
    
}