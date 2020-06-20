from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
db = SQLAlchemy()
ma = Marshmallow()


class Admin(db.Model):
    # class corresponding to the admin table in the database
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(45), unique=True, nullable=False)
    name = db.Column(db.String(45), nullable=False)
    contact = db.Column(db.String(10), nullable=False)
    password = db.Column(db.String(45), nullable=False)
    salt = db.Column(db.String(45), nullable=False)
    org_id = db.Column(db.Integer, nullable=False)

    def __init__(self, email, name, contact, password, salt, org_id):
        self.email = email
        self.name = name
        self.contact = contact
        self.password = password
        self.salt = salt
        self.org_id = org_id


class AdminSchema(ma.Schema):
    # Admin schema
    class Meta:
        fields = ('id', 'email', 'name', 'contact',
                  'password', 'salt', 'org_id')


# init schema
admin_schema = AdminSchema()
admins_schema = AdminSchema(many=True)
