from sklearn import SVD
from skl2onnx import convert_sklearn
from skl2onnx.common.data_types import FloatTensorType

params = {
    
}

# Initialize a model (parameters ignored)
model = SVD()

# Load data and train
# model.fit()

# Assume you already have the surprise model in memory at this point
initial_type = [('float_input', FloatTensorType([None, 2]))]
onx = convert_sklearn(model, initial_types=initial_type)
with open("surprise_svd_recommender.onnx", "wb") as f:
    f.write(onx.SerializeToString())

