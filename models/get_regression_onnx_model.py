from sklearn.linear_model import LinearRegression
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType
import numpy as np

if __name__ == "__main__":
    # Initialize a model (parameters ignored)
    print("Initializing the model")
    model = LinearRegression()

    # Fake training data. 
    # Feature schema: [Age, G1, G2, G3, O1, O2, O3, O4, GE1, GE2, GE3, GE4, A1, A2, A3, A4] 
    # where G, O, GE, A stand for gender vector, occupation vector, movie genre vector, and actor vector
    print("Loading training data")
    X = np.array([
        [30, 0.2, 0.4, 0.3, 0.12, 0.05, 0.8, 0.04, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.2], 
        [45, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.2, 0.4, 0.3, 0.12, 0.05, 0.8, 0.04, 0.1], 
        [10, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0.4, 0.3, 0.2, 0.05, 0.6, 0.03, 0.05, 0.38], 
        [65, 0.4, 0.3, 0.2, 0.05, 0.6, 0.03, 0.05, 0.6, 0.7, 0.2, 0.4, 0.3, 0.12, 0.05, 0.8], 
        ])
    # Labels: ground truth movie ratings
    Y = np.array([
        3.5,
        2.5,
        4.5,
        1.0
    ])

    # Train the model
    print("Training the model")
    model.fit(X, Y)

    # Convert the model to ONNX format
    print("Saving the model to ONNX format")
    initial_type = [('float_input', FloatTensorType([None, 16]))]
    onx = convert_sklearn(model, initial_types=initial_type, dtype=np.float32)
    with open("linear_reg_recommender.onnx", "wb") as f:
        f.write(onx.SerializeToString())

    print("Completed!")