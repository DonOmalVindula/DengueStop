from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
db = SQLAlchemy()
ma = Marshmallow()


class PatientStatus(db.Model):
    # class corresponding to the patient status Table in the database
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(45), unique=True, nullable=False)

    def __init__(self, status):
        self.status = status


class PatientStatusSchema(ma.Schema):
    class Meta:
        fields = ('id', 'status')


# init schema
patient_status_schema = PatientStatusSchema()
patient_statuses_schema = PatientStatusSchema(many=True)
