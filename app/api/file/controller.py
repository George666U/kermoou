import os
from pathlib import Path
from flask import send_from_directory
from flask_restx import Resource, fields
from flask_jwt_extended import jwt_required
from flask_jwt_extended import current_user
from werkzeug.datastructures import FileStorage
from werkzeug.utils import secure_filename

from . import api

file_upload = api.parser()
file_upload.add_argument('file',
                         type=FileStorage,
                         location='files',
                         required=True,
                         help='File for uploading')

file_model = api.model('File', {
    'message': fields.String(required=True, description='Upload status message'),
    'filename': fields.String(required=True, description='Name of uploaded file')
})


@api.route('/uploads', methods=['POST'])
class FileUpload(Resource):
    @api.expect(file_upload)
    @api.marshal_with(file_model)
    @api.doc(
        "Upload a file to the server",
        security="Bearer",
    )
    @jwt_required()
    def post(self):
        args = file_upload.parse_args()
        file = args['file']

        if file.filename == '':
            return {"error": "No file selected for uploading."}, 400

        upload_directory = 'app/api/uploads'
        if not os.path.exists(upload_directory):
            os.makedirs(upload_directory)

        filename = secure_filename(file.filename)
        file.save(os.path.join(upload_directory, filename))
        return {"message": "File successfully uploaded", "filename": filename}, 201
