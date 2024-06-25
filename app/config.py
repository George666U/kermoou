from datetime import timedelta


class Config:
    SECRET_KEY = 'your_secret_key'
    SQLALCHEMY_DATABASE_URI = 'mysql://root:@localhost:3306/kermoou'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # JWT Extended config
    JWT_SECRET_KEY = "JWT_SECRET_KEY"
    # Set the token to expire every week
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(days=7)
