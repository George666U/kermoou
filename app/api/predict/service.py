from flask import current_app
from flask_restx import marshal

from app.utils import err_resp, message, internal_err_resp
import joblib
import numpy as np
import pandas as pd
import sklearn

model = joblib.load('./app/ml_models/car_price_predictor_rf_v2.pkl')
scaler = joblib.load('./app/ml_models/scaler_y_v2.pkl')  # target scaler


class PredictService:
    @staticmethod
    def predict_car_price(car_data):
        """ Predict car price """
        try:
            # reshape the data in car data to value -> [value]
            car_data['engine_displacement'] = car_data['engine_displacement'] / 1000
            for key in car_data:
                car_data[key] = [car_data[key]]
            test_df = pd.DataFrame(car_data)

            prediction = model.predict(test_df)

            prediction = scaler.inverse_transform([prediction])
            prediction = np.round(prediction, 2)

            return prediction[0][0]
        except Exception as error:
            current_app.logger.exception(str(error))
            return internal_err_resp()
