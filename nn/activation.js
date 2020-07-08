//Elias Lawrence

class Activation {
    constructor() {
    } 
    
    static activate(functionName, m){
        let result = Matrix.copy(m);
        
        let fn; 
        switch(functionName){
            case 'relu'  : 
                fn = Activation.relu;
                break;
            case 'sigmoid'  : 
                fn = Activation.sigmoid;
                break;
            default:
                fn = Activation.relu;
        }
        
        result.map(fn);
        
        return result;
    }        
    
    static derivate(functionName, m){
        let result = Matrix.copy(m);
        
        let fn; 
        switch(functionName){
            case 'relu'  : 
                fn = Activation.dRelu;
                break;
            case 'sigmoid'  : 
                fn = Activation.dSigmoid;
                break;
            default:
                fn = Activation.dRelu;
        }
        
        result.map(fn);
        
        return result;
    }  
    
    // FUNCTIONS
    static sigmoid(x){
        return 1 / (1 + Math.exp(-x));
    }         

    static relu(x){
        return Math.max(0, x);
    }
    
    // DERIVATIVES
    static dSigmoid(x){
        return Activation.sigmoid(x) * (1 - Activation.sigmoid(x));
    } 
    
    static dRelu(x){
        if(x < 0){
            return 0;
        } else if(x > 0){
            return 1;            
        }
        
        return undefined;
    }
}