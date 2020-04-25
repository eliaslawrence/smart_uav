// Elias Lawrence

function Individual() {        
    this.w = w_;
    
    this.maxPopSize = _maxPopSize;
    this.chromoSize = _chromoSize;
    this.top        = _top;
    this.bot        = _bot;
    this.rho        = _rho;   
    
    
    
    this.crossover = function(population) {
        
    }
    
    this.mutate = function(population) {
        
    }
    
    this.rank = function(population) {
        
    }
        
    this.exec = function(numGenerations) {
        let population = this.generateInitialPopulation();
        this.rank(population);
        
        for(let g = 0; g < numGenerations; g++){
            this.crossover(population);
            this.mutate(population);
            this.rank(population);
        }                
    };    
    
}