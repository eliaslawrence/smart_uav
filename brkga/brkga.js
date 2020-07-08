// Elias Lawrence

var lastV;
var lastFit;

function equalArrays(a,b){
    var resp = true;
    
    for(let i = 0; i < a.length; i++){
        if(a[i] != b[i]) {
            resp = false;
            break;
        }
    }
    
    return resp;
}

function BRKGA(_maxPopSize, _chromoSize, _top, _cros, _bot, _rho, _decoder) {        
    this.decoder = _decoder;
    
    this.maxPopSize = _maxPopSize;
    this.chromoSize = _chromoSize;
    this.top        = _top;
    this.cros       = _cros;
    this.bot        = _bot;
    this.rho        = _rho;
    
    this.eliteSize     = parseInt(this.top  * this.maxPopSize);    
    this.randomSize    = parseInt(this.bot  * this.maxPopSize);
    this.crossoverSize = parseInt(this.cros * this.maxPopSize);
    this.mutantSize    = this.maxPopSize - this.eliteSize - this.crossoverSize - this.randomSize;
    
    this.eliteStartIndex     = 0;
    this.eliteEndIndex       = this.eliteStartIndex + this.eliteSize;
    
    this.crossoverStartIndex = this.eliteEndIndex;
    this.crossoverEndIndex   = this.crossoverStartIndex + this.crossoverSize;
    
    this.mutantStartIndex    = this.crossoverEndIndex;
    this.mutantEndIndex      = this.mutantStartIndex + this.mutantSize;
    
    this.randomStartIndex    = this.mutantEndIndex;
    this.randomEndIndex      = this.randomStartIndex + this.randomSize;
    
//    this.fixedRK = [];
    
//    this.population = [];
    
    // RK
    this.generateRandomKeys = function() {
        var rk = [];
        for(var i = 0; i < this.chromoSize; i++){
//            if(this.fixedRK[i] != null){
//                rk.push(this.fixedRK[i]);
//            } else {
//                rk.push(random(-1,1));
//                this.fixedRK.push(rk[i]);
//            }
            var randomNum = random();
            rk.push(parseFloat(randomNum.toFixed(3)));
        }  
        
        return rk;
//        return fixedRK;
    }
    
    // Initial Population
    this.generateInitialPopulation = function() {
        var initialPop = [];
        for(var i = 0; i < this.maxPopSize; i++){
            var rk  = this.generateRandomKeys();
            var ind = this.decoder.decode(rk);
            initialPop.push({rk: rk, individual: ind});
        }  
        
        return initialPop;
    } 
    
    this.loadInitialPopulation = function(data) {
        var initialPop = [];
        
        var i;
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
        var modelToSave = {};
        modelToSave.population = [];
        for(var i = 0; i < this.maxPopSize; i++){
            modelToSave.population.push(population[i].rk);            
        }  
        
        save(modelToSave, 'model.json');
    }
    
    // Crossover
    this.electParents = function(population) {
        var rollElite    = parseInt(random(this.eliteStartIndex, this.eliteEndIndex));
        var rollNonElite = parseInt(random(this.eliteEndIndex, this.maxPopSize));
        
        var parents = {elite: population[rollElite], nonElite: population[rollNonElite]};
        
        return parents;
    }
    
    this.mating = function(parents) {
        var eliteParent    = parents.elite;
        var nonEliteParent = parents.nonElite;
        
        var child = [];
        for(var i = 0; i < this.chromoSize; i++){
            var roll = random(1);
            roll = parseFloat(roll.toFixed(3));
            child.push(roll <= this.rho ? eliteParent.rk[i] : nonEliteParent.rk[i]);
        }  
        
        return child;
    }
    
    this.crossover = function(population, newPopulation) {        
        for(var i = 0; i < this.crossoverSize; i++){
            var parents = this.electParents(population);            
            
            var rk  = this.mating(parents);
            var ind = this.decoder.decode(rk);
            
            newPopulation[this.crossoverStartIndex + i] = {rk: rk, individual: ind};
        }  
        
        return newPopulation;
    }
    
    // Mutation
    this.mutating = function(original) {        
        let mutation = [];
        for(var i = 0; i < this.chromoSize; i++){
            var roll  = random(1);
            roll = parseFloat(roll.toFixed(3));
            if(roll < 0.1){
                mutation.push(min(1, original.rk[i] + 0.1));
            } else if(roll < 0.2){
                mutation.push(max(-1, original.rk[i] - 0.1));
            } else {
                mutation.push(original.rk[i]);
            }            
        }  
        
        return mutation;
    }
    
    this.mutate = function(population, newPopulation) {      
        var sumFitness = 0;
        for(var i = 0; i < this.maxPopSize; i++){
            sumFitness += population[i].individual.fitness;
        }
        var roulette = []
        var currPos = 0;
        for(var i = 0; i < this.maxPopSize; i++){
            var relFitness = population[i].individual.fitness / sumFitness;
            var qtyRoul = Math.floor(relFitness * this.maxPopSize);
            var end = currPos + qtyRoul;
            
            for(currPos; currPos < end; currPos++){
                roulette.push(i);
            }
        }
        
        for(var i = this.mutantStartIndex; i < this.mutantEndIndex; i++){
            var randomPos = random(roulette);
            
            var rk  = this.mutating(population[randomPos]);
            var ind = this.decoder.decode(rk);
            
            newPopulation[i] = {rk: rk, individual: ind};
        }  
        
        return newPopulation;
    }   
    
    this.random = function(newPopulation) {        
        for(var i = this.randomStartIndex; i < this.randomEndIndex; i++){            
            var rk  = this.generateRandomKeys();
            var ind = this.decoder.decode(rk);
            
            newPopulation[i] = {rk: rk, individual: ind};
        }  
        
        return newPopulation;
    }  
    
    // Elite
    this.elite = function(population, newPopulation) { 
        for(var i = 0; i < this.eliteEndIndex; i++){
            
            var rk  = population[i].rk;
            var ind = this.decoder.decode(rk);
            
            newPopulation[i] = {rk: rk, individual: ind};
        }  
        
        return newPopulation;
    }   
    
    // Rank population according to fitness
    this.rank = function(population) {
        population.sort(function(a, b){
            
            var better = a.individual.betterThan(b.individual);
            if (better) {
              return -1;
            }
            
            return 1;
            
//            return a.individual.betterThan(b.individual) ? -1 : 1;
        })
        
        return population;
    }
    
    this.scaleFit = function(population) {
        let maxFit = - Infinity;
        let minFit =   Infinity;
        
        for(let i = 0; i < this.maxPopSize; i++){
            maxFit = max(maxFit, population[i].individual.fitness);
            minFit = min(minFit, population[i].individual.fitness);
        }
        
        for(let i = 0; i < this.maxPopSize; i++){
            population[i].individual.fitness = (population[i].individual.fitness - minFit) / (maxFit - minFit);
        }
        
        return population;
    }
        
    this.exec = function(population) { 
//        console.log('start');
        
//        console.log('rank');           
        population = this.rank(population);
        lastFit = population[0].individual.fitness;
        lastV   = population[0];
        bestQtyWayPoints = lastFit;
        
        //        console.log('scaleFit');
        population = this.scaleFit(population);
        
//        console.log('slice');   
        let newPopulation = [...population];           
        
//        console.log('elite');
        newPopulation = this.elite(population, newPopulation);
        
//        console.log('crossover');
        newPopulation = this.crossover(population, newPopulation);
        
        newPopulation = this.mutate(population, newPopulation);
        
//        console.log('random');
        newPopulation = this.random(newPopulation);
        
        return newPopulation;
    };    
    
}