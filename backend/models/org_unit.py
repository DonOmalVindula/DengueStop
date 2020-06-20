from database import db
from database import ma


class OrgUnit(db.Model):
    # class corresponding to the org_unit Table in the database
    id = db.Column(db.Integer, primary_key=True)
    province = db.Column(db.String(45), nullable=False)
    district = db.Column(db.String(45), nullable=False)
    name = db.Column(db.String(45), nullable=False)
    contact = db.Column(db.Integer, nullable=False)

    def __init__(self, province, district, name, contact):
        self.province = province
        self.district = district
        self.name = name
        self.contact = contact


class OrgUnitSchema(ma.Schema):
    class Meta:
        fields = ('id', 'province', 'district', 'name', 'contact')


# init schema
org_unit_schema = OrgUnitSchema()
org_units_schema = OrgUnitSchema(many=True)
