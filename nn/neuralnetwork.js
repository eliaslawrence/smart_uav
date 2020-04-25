// Elias Lawrence

function getWeightsSize (qtyNeuronsInput, qtyHiddenLayers, qtyNeuronsHidden, qtyNeuronsOutput){     
    let size = 0;
    
    // Input
    // Each neuron
    for(let neuronIndex = 0; neuronIndex < qtyNeuronsHidden; neuronIndex++){
        // Each weight
        for(let weightIndex = 0; weightIndex < qtyNeuronsInput; weightIndex++){
            size++;
        }
        
        size++;
    }
    
    // Hidden
    // Each layer
    for(let layerIndex = 1; layerIndex < qtyHiddenLayers; layerIndex++){
        // Each neuron
        for(let neuronIndex = 0; neuronIndex < qtyNeuronsHidden; neuronIndex++){
            // Each weight
            for(let weightIndex = 0; weightIndex < qtyNeuronsHidden; weightIndex++){
                size++;
            }
            
            size++;
        }
    }
    
    // Output
    // Each neuron
    for(let neuronIndex = 0; neuronIndex < qtyNeuronsOutput; neuronIndex++){
        // Each weight
        for(let weightIndex = 0; weightIndex < qtyNeuronsHidden; weightIndex++){
            size++;
        }
        
        size++;
    }
    
    return size;
}

function Neuron(_qtyLinks) { 
    this.weights = [];
    this.output;    

    this.qtyLinks = _qtyLinks; 
    
    for(let i = 0; i < this.qtyLinks; i++){
        this.weights.push(random(-1,1));        
    }
    
    this.bias = random(-1,1);    
}

function Layer(_qtyNeurons) {  
    this.neurons = [];
    this.qtyNeurons = _qtyNeurons;    
}

function NeuralNetwork(_qtyNeuronsInput, _qtyHiddenLayers, _qtyNeuronsHidden, _qtyNeuronsOutput) { 
    this.layers = [];
    
    this.qtyHiddenLayers  = _qtyHiddenLayers;
    this.qtyNeuronsInput  = _qtyNeuronsInput;
    this.qtyNeuronsHidden = _qtyNeuronsHidden;
    this.qtyNeuronsOutput = _qtyNeuronsOutput;
    this.qtyLayers        = this.qtyHiddenLayers + 2;
    
    
    // Layers
    this.layers.push(new Layer(this.qtyNeuronsInput));     
    
    for(let layerIndex = 1; layerIndex < this.qtyLayers - 1; layerIndex++){
        this.layers.push(new Layer(this.qtyNeuronsHidden));        
    }
    
    this.layers.push(new Layer(this.qtyNeuronsOutput));
    
    // Input
    for(let neuronIndex = 0; neuronIndex < this.qtyNeuronsInput; neuronIndex++){
        this.layers[0].neurons.push(new Neuron(0));        
    }
    
    // Neurons
    for(let layerIndex = 1; layerIndex < this.qtyLayers; layerIndex++){
        for(let neuronIndex = 0; neuronIndex < this.layers[layerIndex].qtyNeurons; neuronIndex++){
            this.layers[layerIndex].neurons.push(new Neuron(this.layers[layerIndex - 1].qtyNeurons));        
        }        
    }
    
    // Weights    
    this.setWeights = function (weights){     
        let count = 0;
        // Each layer
        for(let layerIndex = 1; layerIndex < this.layers.length; layerIndex++){
            // Each neuron
            for(let neuronIndex = 0; neuronIndex < this.layers[layerIndex].neurons.length; neuronIndex++){
                // Each weight
                for(let weightIndex = 0; weightIndex < this.layers[layerIndex].neurons[neuronIndex].weights.length; weightIndex++){
                    this.layers[layerIndex].neurons[neuronIndex].weights[weightIndex] = weights[count++];
                }
                
                this.layers[layerIndex].neurons[neuronIndex].bias = weights[count++];
            }
        }
    }
    
//    this.print = function (){     
//        let vals = [];
//        // Each layer
//        for(let layerIndex = 1; layerIndex < this.layers.length; layerIndex++){
//            // Each neuron
//            for(let neuronIndex = 0; neuronIndex < this.layers[layerIndex].neurons.length; neuronIndex++){
//                // Each weight
//                for(let weightIndex = 0; weightIndex < this.layers[layerIndex].neurons[neuronIndex].weights.length; weightIndex++){
//                    vals.push(this.layers[layerIndex].neurons[neuronIndex].weights[weightIndex]);
//                }
//                
//                this.layers[layerIndex].neurons[neuronIndex].output = weights[count++];
//            }
//        }
//        console.log(vals);
//    }
    
    this.output = function (input){
        // Each neuron
        for(let neuronIndex = 0; neuronIndex < this.layers[0].qtyNeurons; neuronIndex++){
            this.layers[0].neurons[neuronIndex].output = input[neuronIndex];
        }
        
        // Each layer
        for(let layerIndex = 1; layerIndex < this.qtyLayers; layerIndex++){
            // Each neuron
            for(let neuronIndex = 0; neuronIndex < this.layers[layerIndex].qtyNeurons; neuronIndex++){
                let neuronOutput = 0;

                // Each weight
                for(let weightIndex = 0; weightIndex < this.layers[layerIndex].neurons[neuronIndex].qtyLinks; weightIndex++){
                    if(isNaN(this.layers[layerIndex].neurons[neuronIndex].weights[weightIndex])){
                        console.log('erro');
                    }
                    neuronOutput += this.layers[layerIndex - 1].neurons[weightIndex].output * this.layers[layerIndex].neurons[neuronIndex].weights[weightIndex];
                }

                neuronOutput += this.layers[layerIndex].neurons[neuronIndex].bias;
                this.layers[layerIndex].neurons[neuronIndex].output = neuronOutput;
            }
        }
        
        let output = [];
        for(let i = 0; i < this.layers[this.qtyLayers - 1].qtyNeurons; i++){
            output.push(this.layers[this.qtyLayers - 1].neurons[i].output);                    
        }     
                
        return output;
    }
    
}