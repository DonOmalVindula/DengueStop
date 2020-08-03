import 'dart:core';
import 'package:intl/intl.dart';

// this class corresponds to the event table
class Event {
  // id is auto incremented in the database
  // reported_time is set via the flask backend
  int id;
  String name;
  String venue;
  double locationLat;
  double locationLong;
  DateTime startTime;
  DateTime dateCreated;
  double duration;
  String coordinatorName;
  String coordinatorContact;
  int statusId;
  int orgId;
  int createdBy;
  String description;

  Event(
      {this.id,
        this.name,
        this.venue,
        this.locationLat,
        this.locationLong,
        this.startTime,
        this.dateCreated,
        this.duration,
        this.coordinatorName,
        this.coordinatorContact,
        this.statusId,
        this.createdBy,
        this.description,
        this.orgId});

  Map toJson() => {
    'id': id,
    'name': name,
    'venue': venue,
    'locationLat': locationLat,
    'locationLong': locationLong,
    'startTime': startTime,
    'dateCreated': dateCreated,
    'duration': duration,
    'coordinatorName': coordinatorName,
    'coordinatorContact': coordinatorContact,
    'statusId': statusId,
    'createdBy': createdBy,
    'description': description,
    'orgId': orgId
  };

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
        id: json['id'] as int,
        name: json['province'] as String,
        venue: json['district'] as String,
        locationLat: json['location_lat'] as double,
        locationLong: json['location_long'] as double,
        // parsing string values to DateTime format
        startTime: DateFormat('yyyy-M-dd').parse(json['patient_dob']) as DateTime,
        dateCreated: DateTime.parse(json['reported_time']) as DateTime,
        duration: json['description'] as double,
        coordinatorName: json['reported_user_id'] as String,
        coordinatorContact: json['patient_status_id'] as String,
        description: json['verified_by'] as String,
        statusId: json['is_verified'] as int,
        createdBy: json['verified_by'] as int,
        orgId: json['org_id'] as int);
  }
}
