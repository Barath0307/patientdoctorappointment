import Form from "react-bootstrap/Form";
import "./PostDoctor.css"
import { Alert, AlertHeading, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostDoctor = () => {

    const [formData, setFormData] = useState({
        name: "",
        specialization: "",
        degree: "",
        state: "",
        city: "",
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
            if (!formData.degree || !formData.name || !formData.specialization || !formData.state || !formData.city || !formData.password) {
                alert("Fill the details.");
                return;
            }
            const response = await fetch("http://localhost:8080/api/doctor", {
                method: "POST",
                headers: { "content-type": "application/json"},
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            console.log("doctor created: ", data);
            navigate("/doctors");
        } catch (err) {
            console.log("Error creating doctor: ", err.message);
        }
    }
    return (
        <>
        <div className="center-form">
            <h1>Post New Doctor</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicName">
                    <Form.Control type="text" name="name" placeholder="Enter name" value={formData.name} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicAddress">
                    <Form.Control type="text" name="specialization" placeholder="Enter specialization" value={formData.specialization} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicEmail">
                    <Form.Control type="text" name="degree" placeholder="Enter degree" value={formData.degree} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPhone">
                    <Form.Control type="text" name="state" placeholder="Enter state" value={formData.state} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicDepartment">
                    <Form.Control type="text" name="city" placeholder="Enter city" value={formData.city} onChange={handleInputChange} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" name="password" placeholder="Enter password" value={formData.password} onChange={handleInputChange} />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">Post Doctor</Button>
            </Form>
        </div>
        </>
    )
}

export default PostDoctor;