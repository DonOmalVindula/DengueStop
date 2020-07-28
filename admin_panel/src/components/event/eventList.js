import React, { useState, useEffect } from "react";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    MDBCard,
    MDBRow,
    MDBCol,
    MDBBtn,
    MDBModal,
    MDBModalBody,
    MDBModalHeader,
    MDBModalFooter,
    MDBDropdown,
    MDBDropdownToggle,
    MDBDropdownMenu,
    MDBDropdownItem,
    MDBIcon,
    MDBNotification,
} from "mdbreact";
import DataTable from "react-data-table-component";
import Moment from "react-moment";
import { getSession } from "../../services/sessionService";
import EventService from "../../services/eventService";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
    NotificationContainer,
    NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

const EventList = (props) => {
    const currentUser = getSession();
    const setEventArray = props.setEventArray;
    const eventArray = props.eventArray;
    const statusArray = props.statusArray;
    const lastRefresh = props.lastRefresh;
    const [addEventModal, setAddEventModal] = useState(false);

    const columns = [
        {
            name: "Event ID",
            selector: "event.id",
            sortable: true,
        },
        {
            name: "Event Start Time",
            selector: "event.start_time",
            cell: (row) => (
                <Moment format="DD/MM/YYYY @ hh:mm a">
                    {row.event.start_time}
                </Moment>
            ),
            sortable: true,
        },
        {
            name: "Event Name",
            selector: "event.name",
            sortable: true,
        },
        {
            name: "Event Venue",
            selector: "event.venue",
            sortable: true,
        },
        {
            name: "Coordinator",
            selector: "event.coordinator_name",
            sortable: true,
        },
        {
            name: "Province",
            selector: "org_unit.province",
            sortable: true,
        },
        {
            name: "Org Name",
            selector: "org_unit.name",
            sortable: true,
        },
        {
            name: "Status",
            selector: "status.status",
            sortable: true,
        },
    ];

    return (
        <MDBCard className="patient-table-container">
            <NotificationContainer />
            <NewEventModal
                isOpen={addEventModal}
                setIsOpen={setAddEventModal}
            />
            <MDBRow className="w-100">
                <MDBCol className="p-2">
                    <MDBBtn
                        className="float-right"
                        size="lg"
                        color="primary"
                        onClick={() => setAddEventModal(true)}
                    >
                        <MDBIcon icon="plus" /> Add New Event
                    </MDBBtn>
                </MDBCol>
            </MDBRow>
            <DataTable
                noHeader={true}
                keyField={"ID"}
                columns={columns}
                data={eventArray}
                theme="solarized"
                responsive={true}
                expandableRows
                expandableRowsComponent={
                    <ExpandedComponent
                        currentUser={currentUser}
                        eventArray={eventArray}
                        setEventArray={setEventArray}
                        statusArray={statusArray}
                    />
                }
                pagination
            />
            <p className="px-3 text-right">
                Updated <Moment fromNow>{lastRefresh}</Moment>
            </p>
        </MDBCard>
    );
};

const NewEventModal = (props) => {
    const isOpen = props.isOpen;
    const setIsOpen = props.setIsOpen;
    const mapCenter = [7.9, 80.747452];
    const [startDate, setStartDate] = useState(new Date());
    const [eventCoord, setEventCood] = useState([7.9, 80.747452]);
    const [mapTouched, setMapTouched] = useState(false);
    const eventService = new EventService();

    useEffect(() => {
        setIsOpen(props.isOpen);
    });

    const addNewEvent = (eventData) => {
        var eventObject = eventData;
        eventObject.start_time = startDate.getTime();
        eventObject.location_lat = eventCoord[0];
        eventObject.location_long = eventCoord[1];
        eventService
            .createEvent(eventObject)
            .then((res) => {
                console.log(res);

                NotificationManager.success(
                    "Event Created Successfully",
                    "Success",
                    5000
                );
                setIsOpen(false);
            })
            .catch((err) => {
                console.log(err);
                NotificationManager.error(
                    "Event Creation Failed. Please Try Again",
                    "Failed",
                    5000
                );
            });
    };

    const validateForm = () => {
        return !mapTouched;
    };

    const changeCoordinateOnClick = (event) => {
        setMapTouched(true);
        const lat = event.latlng.lat;
        const long = event.latlng.lng;
        setEventCood([lat, long]);
    };

    const changeCoordinateOnDrag = (event) => {
        setMapTouched(true);
        const lat = event.target._latlng.lat;
        const long = event.target._latlng.lng;
        setEventCood([lat, long]);
    };

    const NewEventSchema = Yup.object().shape({
        name: Yup.string()
            .min(2, "Too Short!")
            .max(45, "Too Long!")
            .required("Required"),
        venue: Yup.string()
            .min(2, "Too Short!")
            .max(45, "Too Long!")
            .required("Required"),
        coordinator_name: Yup.string()
            .min(2, "Too Short!")
            .max(45, "Too Long!")
            .required("Required"),
        coordinator_contact: Yup.string()
            .min(10, "Number too Short!")
            .max(10, "Number too Long!")
            .required("Required"),
        description: Yup.string()
            .min(5, "Too Short!")
            .max(500, "Too Long!")
            .required("Required"),
    });

    return (
        <MDBModal size="lg" isOpen={isOpen} toggle={() => setIsOpen(false)}>
            <Formik
                initialValues={{
                    name: "",
                    venue: "",
                    duration: 0,
                    coordinator_name: "",
                    coordinator_contact: "",
                    description: "",
                }}
                validationSchema={NewEventSchema}
                onSubmit={(values, { setSubmitting }) => {
                    addNewEvent(values);
                    setSubmitting(false);
                }}
                validate={(values) => {
                    const errors = {};
                    if (values.duration <= 0) {
                        errors.duration = "Duration should be more than 0";
                    }
                    return errors;
                }}
            >
                {({ errors, touched }) => (
                    <Form>
                        <MDBModalHeader>Add New Event</MDBModalHeader>
                        <MDBModalBody>
                            <MDBRow>
                                <MDBCol>
                                    <div className="form-group">
                                        <label>Event Name</label>
                                        <Field
                                            name="name"
                                            type="text"
                                            className="form-control"
                                        />
                                        {errors.name && touched.name ? (
                                            <p className="event-form-invalid-text">
                                                {errors.name}
                                            </p>
                                        ) : null}
                                    </div>
                                </MDBCol>
                                <MDBCol>
                                    <div className="form-group">
                                        <label>Event Venue</label>
                                        <Field
                                            name="venue"
                                            type="text"
                                            className="form-control"
                                        />
                                        {errors.venue && touched.venue ? (
                                            <p className="event-form-invalid-text">
                                                {errors.venue}
                                            </p>
                                        ) : null}
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <div className="form-group">
                                        <label>Event Date/Time</label>
                                        <br />
                                        <DatePicker
                                            minDate={new Date()}
                                            className="form-control w-100"
                                            dateFormat="MMMM d, yyyy h:mm aa"
                                            selected={startDate}
                                            showTimeSelect
                                            onChange={(date) =>
                                                setStartDate(date)
                                            }
                                        ></DatePicker>
                                    </div>
                                </MDBCol>
                                <MDBCol>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <Field
                                            name="duration"
                                            type="number"
                                            className="form-control"
                                        />
                                        {errors.duration && touched.duration ? (
                                            <p className="event-form-invalid-text">
                                                {errors.duration}
                                            </p>
                                        ) : null}
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <div className="form-group">
                                        <label>Event Coordinator Name</label>
                                        <Field
                                            name="coordinator_name"
                                            type="text"
                                            className="form-control"
                                        />
                                        {errors.coordinator_name &&
                                        touched.coordinator_name ? (
                                            <p className="event-form-invalid-text">
                                                {errors.coordinator_name}
                                            </p>
                                        ) : null}
                                    </div>
                                </MDBCol>
                                <MDBCol>
                                    <div className="form-group">
                                        <label>Event Coordinator Contact</label>
                                        <Field
                                            name="coordinator_contact"
                                            type="text"
                                            className="form-control"
                                        />
                                        {errors.coordinator_contact &&
                                        touched.coordinator_contact ? (
                                            <p className="event-form-invalid-text">
                                                {errors.coordinator_contact}
                                            </p>
                                        ) : null}
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <div className="form-group">
                                        <label>Event Description</label>
                                        <Field
                                            component="textarea"
                                            name="description"
                                            type="text"
                                            className="form-control"
                                        />
                                        {errors.description &&
                                        touched.description ? (
                                            <p className="event-form-invalid-text">
                                                {errors.description}
                                            </p>
                                        ) : null}
                                    </div>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <p className="text-center">
                                        Mark the event location on the map below
                                    </p>
                                    <Map
                                        className="map-container"
                                        onclick={(event) =>
                                            changeCoordinateOnClick(event)
                                        }
                                        center={mapCenter}
                                        zoom={7}
                                    >
                                        <TileLayer
                                            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker
                                            draggable={true}
                                            ondragend={(event) =>
                                                changeCoordinateOnDrag(event)
                                            }
                                            position={eventCoord}
                                        >
                                            <Popup>Event Location</Popup>
                                        </Marker>
                                    </Map>
                                </MDBCol>
                            </MDBRow>
                        </MDBModalBody>
                        <MDBModalFooter>
                            <MDBBtn
                                type="submit"
                                disabled={validateForm()}
                                color="primary"
                            >
                                Save Event
                            </MDBBtn>
                            <MDBBtn
                                color="secondary"
                                onClick={() => setIsOpen(false)}
                            >
                                Close
                            </MDBBtn>
                        </MDBModalFooter>
                    </Form>
                )}
            </Formik>
        </MDBModal>
    );
};

const ExpandedComponent = (props) => {
    const data = props.data;
    const setEventArray = props.setEventArray;
    const eventArray = props.eventArray;
    const statusArray = props.statusArray;
    const currentUser = props.currentUser;
    const currentOrg = currentUser.org_id;
    const [locationModal, setLocationModal] = useState(false);
    const [eventStatusModal, setEventStatusModal] = useState(false);

    return (
        <div className="p-5 border-bottom">
            <MDBRow>
                <MDBCol size="5">
                    <h5 className="mt-2 font-weight-bold">
                        More Event Details
                    </h5>
                    <hr />
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Event Created at : </b>
                            <Moment format="DD/MM/YYYY @ hh:mm a">
                                {data.event.date_created}
                            </Moment>{" "}
                            (<Moment fromNow>{data.event.date_created}</Moment>)
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Event ID : </b>
                            {data.event.id}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Event Venue : </b>
                            {data.event.venue}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Event Coordinator : </b>
                            {data.event.coordinator_name}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Event Contact : </b>
                            {data.event.coordinator_contact}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Event Ends at : </b>
                            <Moment
                                format="DD/MM/YYYY @ hh:mm a"
                                add={{ hours: data.event.duration }}
                            >
                                {data.event.start_time}
                            </Moment>{" "}
                            ({data.event.duration} hours)
                        </MDBCol>
                    </MDBRow>
                    <MDBRow>
                        <MDBCol>
                            <b>Event Description : </b>
                            <br></br>
                            {data.event.description}
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
                <MDBCol size="5">
                    <h5 className="mt-2 font-weight-bold">
                        Host Organization Details
                    </h5>
                    <hr />
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Organization : </b>
                            {data.org_unit.name}
                        </MDBCol>
                        <MDBCol>
                            <b>Contact : </b>
                            {data.org_unit.contact}
                        </MDBCol>
                    </MDBRow>
                    <MDBRow className="mb-2">
                        <MDBCol>
                            <b>Province : </b>
                            {data.org_unit.province}
                        </MDBCol>
                        <MDBCol>
                            <b>District : </b>
                            {data.org_unit.district}
                        </MDBCol>
                    </MDBRow>
                    {data.event.org_id === currentOrg ? (
                        <b className="blue-text">
                            This is event is organized by our organization
                        </b>
                    ) : null}
                </MDBCol>
                <MDBCol className="px-3 pt-2" size="2">
                    <MDBRow className="p-2">
                        <MDBBtn block onClick={() => setLocationModal(true)}>
                            View Event Location
                        </MDBBtn>
                    </MDBRow>
                    {data.event.org_id === currentOrg ? (
                        <MDBRow className="p-2">
                            <MDBBtn
                                color="elegant"
                                block
                                onClick={() => setEventStatusModal(true)}
                            >
                                Change Event Status
                            </MDBBtn>
                        </MDBRow>
                    ) : null}
                </MDBCol>
            </MDBRow>
            <LocationModal
                isOpen={locationModal}
                setLocationModal={setLocationModal}
                latitude={data.event.location_lat}
                longitude={data.event.location_long}
            ></LocationModal>
            <EventStatusModal
                eventArray={eventArray}
                statusArray={statusArray}
                data={data}
                isOpen={eventStatusModal}
                setEventStatusModal={setEventStatusModal}
                setEventArray={setEventArray}
            ></EventStatusModal>
        </div>
    );
};

const LocationModal = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const setLocationModal = props.setLocationModal;
    const position = [props.latitude, props.longitude];

    useEffect(() => {
        setIsOpen(props.isOpen);
    });

    return (
        <MDBModal
            isOpen={isOpen}
            toggle={() => setLocationModal(false)}
            className="modal-notify modal-info text-white"
            size="md"
        >
            <MDBModalHeader>Event Location</MDBModalHeader>
            <MDBModalBody>
                <MDBRow>
                    <MDBCol>
                        <Map
                            className="map-container"
                            center={position}
                            zoom={17}
                        >
                            <TileLayer
                                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <Marker position={position}>
                                <Popup>Reported Location</Popup>
                            </Marker>
                        </Map>
                    </MDBCol>
                </MDBRow>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn
                    color="secondary"
                    onClick={() => setLocationModal(false)}
                >
                    Close
                </MDBBtn>
            </MDBModalFooter>
        </MDBModal>
    );
};

const EventStatusModal = (props) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectedStatusName, setSelectedStatusName] = useState("");
    const setEventStatusModal = props.setEventStatusModal;
    const setEventArray = props.setEventArray;
    const data = props.data;
    const statusArray = props.statusArray;
    useEffect(() => {
        setIsOpen(props.isOpen);
    });

    const availableDropdownItems = statusArray.map((item, index) => {
        if (item) {
            // event can't be set to pending as it is set by default
            if (item.id <= data.status.id || item.id === 4) {
                return null;
            }
            return (
                <MDBDropdownItem
                    key={index}
                    onClick={() => {
                        setSelectedStatus(item.id);
                        setSelectedStatusName(item.status);
                    }}
                >
                    {item.status}
                </MDBDropdownItem>
            );
        }
    });

    const changeEventStatus = () => {
        const eventService = new EventService();
        setEventStatusModal(false);
        let event = [...props.eventArray];

        const updatedEventArray = event.map((eventRow, index) => {
            if (eventRow.event.id === data.event.id) {
                eventRow.event.status_id = selectedStatus;
                eventRow.status.id = selectedStatus;
                eventRow.status.status = selectedStatusName;
                return eventRow;
            }
            return eventRow;
        });
        // updating the state
        eventService
            .updateEventStatus(data.event.id, selectedStatus)
            .then((res) => {
                if (res) {
                    setEventArray(updatedEventArray);
                }
            });
    };

    return (
        <MDBModal
            isOpen={isOpen}
            toggle={() => setEventStatusModal(false)}
            className="modal-notify text-white"
            size="md"
        >
            <MDBModalHeader className="modal-custom-dark-header">
                Event Status
            </MDBModalHeader>
            <MDBModalBody>
                <MDBRow>
                    <MDBCol>
                        <b>Current Status : </b> {data.status.status}
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol>
                        <b>New Status : </b> {selectedStatusName}
                    </MDBCol>
                </MDBRow>
                <MDBRow className="mt-3">
                    <MDBCol>
                        Select the new status of the event from below
                        <hr />
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol>
                        <MDBDropdown className="w-100">
                            <MDBDropdownToggle
                                className="w-100"
                                caret
                                color="white"
                            >
                                Select Status
                            </MDBDropdownToggle>
                            <MDBDropdownMenu className="w-100" basic>
                                {availableDropdownItems}
                            </MDBDropdownMenu>
                        </MDBDropdown>
                    </MDBCol>
                </MDBRow>
            </MDBModalBody>
            <MDBModalFooter>
                <MDBBtn color="primary" onClick={() => changeEventStatus()}>
                    Change Status
                </MDBBtn>
                <MDBBtn
                    color="secondary"
                    onClick={() => setEventStatusModal(false)}
                >
                    Close
                </MDBBtn>
            </MDBModalFooter>
        </MDBModal>
    );
};

export default EventList;
