from database import db
from database import ma


class Event(db.Model):
    # class corresponding to the event table in the database
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(45), nullable=False)
    venue = db.Column(db.String(45), nullable=False)
    location_lat = db.Column(db.Float, nullable=False)
    location_long = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, nullable=False)
    start_time = db.Column(db.DateTime, nullable=False)
    duration = db.Column(db.Integer, nullable=False)
    coordinator_name = db.Column(db.String(45), nullable=False)
    coordinator_contact = db.Column(db.Integer, nullable=False)
    status_id = db.Column(db.Integer, nullable=False)
    org_id = db.Column(db.Integer, nullable=False)
    description = db.Column(db.String(500), nullable=False)

    def __init__(self, name, venue, location_lat, location_long, date_created, start_time, duration, coordinator_name, coordinator_contact, status_id, org_id, description):
        self.name = name
        self.venue = venue
        self.location_lat = location_lat
        self.location_long = location_long
        self.date_created = date_created
        self.start_time = start_time
        self.duration = duration
        self.coordinator_name = coordinator_name
        self.coordinator_contact = coordinator_contact
        self.status_id = status_id
        self.org_id = org_id
        self.description = description


class EventSchema(ma.Schema):
    class Meta:
        fields = ('id', 'name', 'venue', 'location_lat', 'location_long', 'date_created', 'start_time',
                  'duration', 'coordinator_name', 'coordinator_contact', 'status_id', 'org_id', 'description')


# init schema
event_schema = EventSchema()
events_schema = EventSchema(many=True)
