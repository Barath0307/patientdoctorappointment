import { useEffect, useState } from "react";
import { Button, Col, Container, Nav, Row, Table, Modal, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Doctor = () => {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showAppointmentModal, setShowAppointmentModal] = useState(false);
    const [showUpdateAppointmentModal, setShowUpdateAppointmentModal] = useState(false);
    const [appointmentForm, setAppointmentForm] = useState({
        date: '',
        slot: '',
        status: 'Y',
    });
    const [selectedAppointment, setSelectedAppointment] = useState(null); // For selected appointment to update
    const navigate = useNavigate();

    // Fetch doctors list
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/doctor");
                const data = await response.json();
                setDoctors(data);
            } catch (err) {
                console.error("Error fetching doctors: ", err.message);
            }
        };

        fetchDoctors();
    }, []);

    // Fetch appointments for a selected doctor
    const fetchAppointments = async (doctorId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/appointment/doctor/${doctorId}`);
            const data = await response.json();
            setAppointments(data);
        } catch (err) {
            console.error("Error fetching appointments: ", err.message);
        }
    };

    // Handle delete appointment
    const handleDeleteAppointment = async (appointmentId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/appointment/${appointmentId}`, {
                method: "DELETE",
            });

            if (response.ok) {
                setAppointments((prevAppointments) =>
                    prevAppointments.filter((appointment) => appointment.id !== appointmentId)
                );
            }
        } catch (err) {
            console.error("Error deleting appointment: ", err.message);
        }
    };

    // Handle add appointment
    const handleAddAppointment = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("http://localhost:8080/api/appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...appointmentForm,
                    docid: selectedDoctor.id,
                    docname: selectedDoctor.name,
                    docspecialization: selectedDoctor.specialization,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setAppointments((prevAppointments) => [...prevAppointments, data]);
                setShowAppointmentModal(false);
            }
        } catch (err) {
            console.error("Error adding appointment: ", err.message);
        }
    };

    // Handle update appointment
    const handleUpdateAppointment = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`http://localhost:8080/api/appointment/${selectedAppointment.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...appointmentForm,
                    docid: selectedDoctor.id,
                    docname: selectedDoctor.name,
                    docspecialization: selectedDoctor.specialization,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update the state with the modified appointment
                setAppointments((prevAppointments) =>
                    prevAppointments.map((appointment) =>
                        appointment.id === selectedAppointment.id ? { ...appointment, ...data } : appointment
                    )
                );

                setShowUpdateAppointmentModal(false); // Close modal after update
            }
        } catch (err) {
            console.error("Error updating appointment: ", err.message);
        }
    };

    // Handle the selection of a doctor to show appointments
    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
        fetchAppointments(doctor.id);
    };

    // Handle the selection of an appointment for update
    const handleAppointmentSelect = (appointment) => {
        setSelectedAppointment(appointment);
        setAppointmentForm({
            date: appointment.date,
            slot: appointment.slot,
            status: appointment.status,
        });
        setShowUpdateAppointmentModal(true);
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <h1 className="text-center">Doctors</h1>

                    <Nav.Link as={Link} to="/postdoctor" className="nav-link">
                        <Button className="float-right">Add Doctor</Button>
                    </Nav.Link>

                    <Table striped bordered hover responsive>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Specialization</th>
                                <th>Degree</th>
                                <th>State</th>
                                <th>City</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.length > 0 ? (
                                doctors.map((doctor) => (
                                    <tr key={doctor.id}>
                                        <td>{doctor.name}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>{doctor.degree}</td>
                                        <td>{doctor.state}</td>
                                        <td>{doctor.city}</td>
                                        <td className="d-flex justify-content-evenly">
                                            <Button
                                                variant="outline-secondary"
                                                onClick={() => handleDoctorSelect(doctor)}
                                            >
                                                View Appointments
                                            </Button>
                                            <Button variant="outline-danger">Delete</Button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className="text-center">
                                    <td colSpan={6}>No Data</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>

                    {selectedDoctor && (
                        <div className="mt-5">
                            <h3>Appointments for {selectedDoctor.name}</h3>

                            <Button
                                variant="primary"
                                onClick={() => setShowAppointmentModal(true)}
                            >
                                Add Appointment
                            </Button>

                            <Table striped bordered hover responsive className="mt-3">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Slot</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments.length > 0 ? (
                                        appointments.map((appointment) => (
                                            <tr key={appointment.id}>
                                                <td>{new Date(appointment.date).toLocaleDateString()}</td>
                                                <td>{appointment.slot}</td>
                                                <td>{appointment.status == 'Y' ? 'Available' : 'Booked'}</td>
                                                <td className="d-flex justify-content-evenly">
                                                    <Button
                                                        variant="outline-secondary"
                                                        onClick={() => handleAppointmentSelect(appointment)}
                                                    >
                                                        Update
                                                    </Button>
                                                    <Button
                                                        variant="outline-danger"
                                                        onClick={() => handleDeleteAppointment(appointment.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4}>No Appointments</td>
                                        </tr>
                                    )}
                                </tbody>
                            </Table>
                        </div>
                    )}
                </Col>
            </Row>

            {/* Appointment Modal */}
            <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleAddAppointment}>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={appointmentForm.date}
                                onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formSlot">
                            <Form.Label>Slot</Form.Label>
                            <Form.Control
                                as="select"
                                value={appointmentForm.slot}
                                onChange={(e) => setAppointmentForm({ ...appointmentForm, slot: e.target.value })}
                                required
                            >
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={appointmentForm.status}
                                onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
                                required
                            >
                                <option>Y</option>
                                <option>N</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Save Appointment
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Update Appointment Modal */}
            <Modal show={showUpdateAppointmentModal} onHide={() => setShowUpdateAppointmentModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Appointment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateAppointment}>
                        <Form.Group controlId="formDate">
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                value={appointmentForm.date}
                                onChange={(e) => setAppointmentForm({ ...appointmentForm, date: e.target.value })}
                                required
                            />
                        </Form.Group>

                        <Form.Group controlId="formSlot">
                            <Form.Label>Slot</Form.Label>
                            <Form.Control
                                as="select"
                                value={appointmentForm.slot}
                                onChange={(e) => setAppointmentForm({ ...appointmentForm, slot: e.target.value })}
                                required
                            >
                                <option>Morning</option>
                                <option>Afternoon</option>
                                <option>Evening</option>
                            </Form.Control>
                        </Form.Group>

                        <Form.Group controlId="formStatus">
                            <Form.Label>Status</Form.Label>
                            <Form.Control
                                as="select"
                                value={appointmentForm.status}
                                onChange={(e) => setAppointmentForm({ ...appointmentForm, status: e.target.value })}
                                required
                            >
                                <option>Y</option>
                                <option>N</option>
                            </Form.Control>
                        </Form.Group>

                        <Button variant="primary" type="submit" className="mt-3">
                            Update Appointment
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default Doctor;
