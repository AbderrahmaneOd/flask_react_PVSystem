import React, { useState } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import config from "../../config.json";
import './ContactUsForm.scss';
function ContactUsForm() {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [formStatus, setFormStatus] = useState(""); 

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = {
            nom: nom,
            prenom: prenom,
            email: email,
            subject: subject,
            message_body: message
        };

        try {
            const response = await fetch(`${config.apiUrl}/send-email`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json(); 

            if (response.ok) {
                setFormStatus(responseData.message); 
                setNom("");
                setPrenom("");
                setEmail("");
                setSubject("");
                setMessage("");
            } else {
                setFormStatus(responseData.message); 
            }
        } catch (error) {
            console.error("Une erreur s'est produite :", error);
            setFormStatus("Une erreur s'est produite lors de l'envoi de l'email"); 
        }
    };

    return (
        <Container className="mt-5">
            <h2 className="mb-3 text-center" style={{ fontSize: '32px', fontWeight: 'bold', color: '#333', marginBottom: '20px' }}>Contactez-nous</h2><br/><br/>
            <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                    <Col>
                        <Form.Group controlId="formName">
                            <Form.Control type="text" placeholder="Entrez votre nom" value={nom} onChange={(e) => setNom(e.target.value)} required className="rounded-3 bg-light" /><br/>
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId="formLastName">
                            <Form.Control type="text" placeholder="Entrez votre prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required className="rounded-3 bg-light" /><br/>
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group controlId="formEmail">
                    <Form.Control type="email" placeholder="Entrez votre email" value={email} onChange={(e) => setEmail(e.target.value)} required className="rounded-3 bg-light" /><br/>
                </Form.Group>
                <Form.Group controlId="formSubject">
                    <Form.Control type="text" placeholder="Entrez le sujet" value={subject} onChange={(e) => setSubject(e.target.value)} required className="rounded-3 bg-light" /><br/>
                </Form.Group>
                <Form.Group controlId="formMessage">
                    <Form.Control as="textarea" rows={5} placeholder="Entrez votre message" value={message} onChange={(e) => setMessage(e.target.value)} required className="rounded-3 bg-light" />
                </Form.Group>
                <Button style={{backgroundColor:"#3bb19b",borderColor:"#3bb19b"}} className= "btn btn-primary d-block mx-auto my-4" type="submit">Envoyer</Button>
                {formStatus && <p className="text-center">{formStatus}</p>}
            </Form>
        </Container>
    );
}

export default ContactUsForm;
