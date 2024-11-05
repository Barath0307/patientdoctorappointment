import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./UpdatePatient.css"

const UpdatePatient = () => {

    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        email: "",
        dob: "",
        password: ""
    });

    const handleInputChange = (event) => {
        const {name, value} = event.target;

        setFormData({
            ...formData,
            [name]:value,
        })
    }

    useEffect(() => {
        const fetchPatient = async () => {
            try {
                 const response = await fetch("http://localhost:8080/api/patient/"+id);

                 const data = await response.json();

                 data.dob = new Date(data.dob);
                 data.dob = data.dob.toISOString().split('T')[0]; // Format to YYYY-MM-DD

                 console.log(data);
                 setFormData(data);
            }
            catch (err) {
                console.error("error fetching");
            }
        }

        fetchPatient();

    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.email || !formData.name || !formData.address || !formData.dob || !formData.password) {
                alert("Fill the details.");
                return;
            }
            const response = await fetch('http://localhost:8080/api/patient/'+id, 
            {
                method: "PUT",
               headers: { "content-type": "application/json"},
               body: JSON.stringify(formData),
           });

           const data = await response.json();

           navigate('/patients');
           
        } catch (err) {
            console.error("error updating...");
            
        }
    }

    return (
        <>
        <div className="center-form">
            <h1>Edit Patient</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Control type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicAddress">
                    <Form.Control type="text" name="address" placeholder="Enter address" value={formData.address} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="text" name="email" placeholder="Enter email" value={formData.email} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Control type="date" name="dob" placeholder="Enter dob" value={formData.dob} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicDepartment">
                    <Form.Control type="text" name="password" placeholder="Enter password" value={formData.password} onChange={handleInputChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">Edit Patient</Button>
            </Form>
        </div>
        </>
    )
}

export default UpdatePatient;