import { useEffect, useState } from "react";
import { Button, Col, Container, Nav, Row, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Patient = () => {

    const [patients, setPatients] = useState([]);

    const navigate = useNavigate();

    useEffect( ()=> {
        const fetchPatients = async() => {
            try {
                const response = await fetch("http://localhost:8080/api/patient");
                const data = await response.json();

                setPatients(data);
                setPatients((prevPatients) => {
                    return prevPatients.map(item => {
                        let date = new Date(item.dob);
                        const options = { year: 'numeric', month: 'long', day: 'numeric' };
                        const formattedDate = date.toLocaleDateString('en-US', options);
                        
                        item.dob = formattedDate;
                        return item;
                    })
                });

            } catch (err) {
                console.error("Error fetching employees: ", err.message);
            }
        }

        fetchPatients();

    }, []);

    const handleDelete = async (patientId) => {
        try {
         const response = await fetch('http://localhost:8080/api/patient/'+patientId, {
            method: "DELETE"
         });

         if (response.ok) {
            setPatients((prevPatients) => {
                return prevPatients.filter((data) => data.id !== patientId);
            })
            console.log(patients);
            
         }
        //  fetchPatients();

        }
        catch (err) {

        }
    }

    const handleUpdate = (patientId) => {
        navigate("/updatepatient/"+patientId);
    }

    return (
        <>
            <Container className="mt-5">
                <Row>
                    <Col>
                        <h1 className="text-center">Patients</h1>
                        <Nav.Link as={Link} to="/postpatient" className="nav-link">
                            <Button className="float-right">
                                    Add Patients
                                </Button>
                        </Nav.Link>

                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Address</th>
                                    <th>Email</th>
                                    <th>Date Of Birth</th>
                                </tr>
                            </thead>
                            <tbody>
                                { patients && patients.length>0 ? patients.map((patientdata) => (
                                    <tr key={patientdata.id}>
                                        <td>{patientdata.name}</td>
                                        <td>{patientdata.address}</td>
                                        <td>{patientdata.email}</td>
                                        <td>{patientdata.dob}</td>
                                        <td className="d-flex justify-content-evenly" >
                                            <Button variant="outline-secondary" onClick={() => { handleUpdate(patientdata.id) }}>Update</Button>
                                            <Button variant="outline-danger" onClick={() => {handleDelete(patientdata.id)}} >Delete</Button>
                                        </td>
                                    </tr>
                                )): <tr className="text-center" ><td colSpan={5} >No Data</td></tr>}
                            </tbody>
                        </Table>
                    </Col>
                </Row>
            </Container>
        </>
    )
}

export default Patient;