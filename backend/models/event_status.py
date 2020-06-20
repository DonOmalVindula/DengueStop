from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
db = SQLAlchemy()
ma = Marshmallow()


class EventStatus(db.Model):
    # class corresponding to the Event status Table in the database
    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String(45), unique=True, nullable=False)

    def __init__(self, status):
        self.status = status


class EventStatusSchema(ma.Schema):
    class Meta:
        fields = ('id', 'status')


# init schema
event_status_schema = EventStatusSchema()
event_statuses_schema = EventStatusSchema(many=True)
