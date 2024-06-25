from flask_restx import Api, fields
from flask import Blueprint

from .user.controller import api as user_ns
from .auth.controller import api as auth_ns
from .car.controller import api as car_ns
from .community.controller import api as community_ns
from .post.controller import api as post_ns
from .file.controller import api as file_ns
from .predict.controller import api as predict_ns

# Import controller APIs as namespaces.
api_bp = Blueprint("api", __name__, static_folder='uploads',
                   static_url_path='/file/uploads')

api = Api(api_bp, title="Kermoou API", description="Main routes.")

# API namespaces
api.add_namespace(user_ns)
api.add_namespace(auth_ns)
api.add_namespace(car_ns)
api.add_namespace(community_ns)
api.add_namespace(post_ns)
api.add_namespace(file_ns)
api.add_namespace(predict_ns)
