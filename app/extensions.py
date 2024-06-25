from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_admin import Admin

from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
admin = Admin(name="Admin", template_mode="bootstrap3")

bcrypt = Bcrypt()
migrate = Migrate()
cors = CORS()

jwt = JWTManager()
ma = Marshmallow()
