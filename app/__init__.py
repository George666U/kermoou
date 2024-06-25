import os
from flask import Flask, render_template, send_from_directory
from app.extensions import db, admin, migrate, ma, bcrypt, jwt, cors
from app.config import Config
from app.admin_config import config_admin

api_url_prefix = '/api'


def create_app():
    app = Flask(__name__, static_url_path='',
                static_folder='dist',
                template_folder='dist')
    app.config.from_object(Config)

    # Serve React App

    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve(path):
        if path != "" and os.path.exists(app.static_folder + '/' + path):
            return send_from_directory(app.static_folder, path)
        else:
            return send_from_directory(app.static_folder, 'index.html')

    @app.errorhandler(404)
    def not_found(e):
        return app.send_static_file('index.html')

    register_extensions(app)

    # Register blueprints
    from .api import api_bp

    app.register_blueprint(api_bp, url_prefix=api_url_prefix)

    return app


def register_extensions(app):
    # Registers flask extensions
    db.init_app(app)
    admin.init_app(app, url='/admin')
    config_admin(admin)
    migrate.init_app(app, db)
    ma.init_app(app)
    jwt.init_app(app)
    bcrypt.init_app(app)
    cors.init_app(app)
