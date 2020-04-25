//#ifndef NEURALNETWORK_H
//#define NEURALNETWORK_H

//#include <vector>
//#include <memory>

//namespace NeuralNetwork {

//    class Neuron
//    {

//    private:
//        std::vector<double> weights;
//        double   output;
//        double   bias;

//        int qtyLinks;

//    public:
//        Neuron(int QtyLinks);
//    };

//    class Layer
//    {

//    private:
//        std::vector<std::unique_ptr<Neuron>> neurons;

//        int qtyNeurons;

//    public:
//        Layer();
//    };


//    class NeuralNetwork
//    {

//    private:
//        Layer   entryLayer;
//        std::vector<std::unique_ptr<Layer>> hiddenLayers;
//        Layer   outputLayer;

//        int qtyHidden;

//    public:
//        NeuralNetwork();
//        NeuralNetwork(int qtyHidden, int qtyNeuronsEntry, int qtyNeuronsHidden, int qtyNeuronsOutput);

//        /*
//         * OUTPUTS:
//         *
//         * 00 - + OR - (pos x)
//         * 01 - 1 OR 0 (pos x)
//         * 02 - + OR - (pos y)
//         * 03 - 1 OR 0 (pos y)
//         * 04 - VEL [1, 10]
//         * 05 - CHARGE RATE [0, 100]
//         *
//         */

//        /*
//         * ENTRY:
//         *
//         * 8 DIRECTIONS: (0, -1) (1, -1) (1, 0) (1, 1) (0, 1) (-1, 1) (-1, 0) (-1, -1)
//         *
//         * 00 - DISTANCE > CLIENT
//         * 01 - DISTANCE > RECHARGE
//         * 02 - DISTANCE > PROHIBITED
//         * 03 - DISTANCE > WALL
//         *
//         * 04,05,06,07
//         * 08,09,10,11
//         * 12,13,14,15
//         * 16,17,18,19
//         * 20,21,22,23
//         * 24,25,26,27
//         * 28,29,30,31
//         *
//         * 32 - VEL
//         * 33 - BATTERY CHARGE
//         * 34 - RECHARGE POINT (0,1)
//         */

//        double hiddenActivation(double x);

//        double outputActivation(int output_type, double x);

//        void copyVectorToLayers(std::vector<double> vector);

//        void copyLayersToVector(std::vector<double> vector_out);

//        void copy_to_entry(std::vector<double> entryVector);

//        int dnaSize();

//        void copyToOutput(std::vector<double> outputVector);

//        void calculateOutput();
//    };

//}

//#endif // NEURALNETWORK_H
