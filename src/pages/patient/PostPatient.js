import Form from "react-bootstrap/Form";
import "./PostPatient.css"
import { Alert, AlertHeading, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostPatient = () => {

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

    const navigate = useNavigate();

    const handleSubmit = async(e) => {
        e.preventDefault();

        console.log(formData);

        try {
            console.log(formData);
            if (!formData.email || !formData.name || !formData.address || !formData.dob || !formData.password) {
                alert("Fill the details.");
                return;
            }
            const response = await fetch("http://localhost:8080/api/patient", {
                method: "POST",
                headers: { "content-type": "application/json"},
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("patient created: ", data);
            navigate("/patients");
        } catch (err) {
            console.log("Error creating patient: ", err.message);
        }
    }
    return (
        <>
        <div className="center-form">
            <h1>Post New Patient</h1>
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
                    <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleInputChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">Post Patient</Button>
            </Form>
        </div>
        </>
    )
}

export default PostPatient;