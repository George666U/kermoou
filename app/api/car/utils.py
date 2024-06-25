def load_data(car_db_obj):
    """ Load car's data

    Parameters:
    - Car db object
    """
    from app.models.schemas import CarSchema

    car_schema = CarSchema()

    data = car_schema.dump(car_db_obj)

    return data
