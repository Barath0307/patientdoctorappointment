import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import "./UpdateDoctor.css"

const UpdateDoctor = () => {

    const { id } = useParams();
    const navigate = useNavigate();

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

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                 const response = await fetch("http://localhost:8080/api/doctor/"+id);

                 const data = await response.json();

                 setFormData(data);
            }
            catch (err) {
                console.error("error fetching");
            }
        }

        fetchDoctor();

    }, [id])

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (!formData.degree || !formData.name || !formData.specialization || !formData.state || !formData.city || !formData.password) {
                alert("Fill the details.");
                return;
            }
            const response = await fetch('http://localhost:8080/api/doctor/'+id, 
            {
                method: "PUT",
               headers: { "content-type": "application/json"},
               body: JSON.stringify(formData),
           });

           const data = await response.json();

           navigate('/doctors');
           
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

                <Button variant="primary" type="submit" className="w-100">Edit Doctor</Button>
            </Form>
        </div>
        </>
    )
}

export default UpdateDoctor;