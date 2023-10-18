import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";

const NewContactModal = (props) => {
    // Set incoming/outgoing props
    const {
        user,
        show,
        handleClose,
        afterSubmit,
        setFormData,
        opportunities,  // Pass opportunities as a prop
        setOpportunities,
        token,  // Pass setOpportunities as a prop
        oppId,
        contactId,
        selectedContact
    } = props;

    // const token = Cookies.get("token");

    // Set Form Data state
    const [contactFormData, setContactFormData] = useState({
        first_name: '',
        last_name: '',
        cell_phone: '',
        work_phone: '',
        email: '',
        user_id: user.id,
        company_id: user.company,
        company_title: '',
        notes: '',
    });

    useEffect(() => {
        console.log("This is my favorite cookie: ", token);
    }, [token]);

    const handleSelectContact = (contactId) => {
        setFormData((prevData) => ({
            ...prevData,
            contact_id: contactId,
        }));
        // Close the contact creation modal
        handleClose();
    };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setContactFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // // Add a contact to the opportunity
    // const addContactToOpportunity = (oppId, contactId) => {
    //     // const token = Cookies.get("token");
    //     // Make a copy of the opportunity object to be updated
    //     const oppToUpdate = opportunities.find((opp) => opp.id === oppId);
    //     if (!oppToUpdate.contacts) {
    //         oppToUpdate.contacts = [];
    //     }
    //     oppToUpdate.contacts.push(contactId);

    //     // Update the opportunity with the new contact
    //     axios
    //         .put(`http://localhost:8081/opportunities/${oppId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //             },
    //             contacts: oppToUpdate.contacts,
    //             withCredentials: true
    //         })
    //         .then(() => {
    //             // Handle success, you can update the state or perform other actions if needed
    //         })
    //         .catch((err) => {
    //             console.log("Failed to update opportunity with the new contact:", err);
    //         });
    // };

    // Handle form submission
    const handleContactSubmit = (e) => {
        e.preventDefault();
        // const token = Cookies.get("token");
        console.log("Contact Form Data: ", contactFormData);
        axios
            .post('http://localhost:8081/contacts/create', contactFormData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                withCredentials: true
            })
            .then((res) => {
                // Extract the contact ID from the response data
                const contactId = res.data.contact.id;

                // Add the contact ID to the opportunity
                // addContactToOpportunity(oppId, contactId);

                // Update the contact with the opportunity_id
                axios
                    .post(`http://localhost:8081/contacts/${contactId}/join`, 
                    {
                        opportunity_id: oppId,
                        contact_id: contactId,
                    }, 
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                    {
                        withCredentials: true
            })
            .then(() => {
                setShowContactModal(false);
                window.location.reload();
            })
            .catch((err) => {
                console.log("Failed to update contact:", err);
            });
    })
            .catch ((err) => {
    console.log("Failed to create a contact:", err);
});
    };

return (
    <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Create a New Contact</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <form onSubmit={handleContactSubmit}>
                {/* Form fields for creating a new contact */}
                <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        className="form-control"
                        required
                        value={contactFormData.first_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        className="form-control"
                        required
                        value={contactFormData.last_name}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Cell Phone</label>
                    <input
                        type="text"
                        name="cell_phone"
                        className="form-control"
                        required
                        value={contactFormData.cell_phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Work Phone</label>
                    <input
                        type="text"
                        name="work_phone"
                        className="form-control"
                        required
                        value={contactFormData.work_phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="text"
                        name="email"
                        className="form-control"
                        required
                        value={contactFormData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label">Notes</label>
                    <input
                        type="text"
                        name="notes"
                        className="form-control"
                        value={contactFormData.notes}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Create Contact
                </button>
            </form>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
);
};

export default NewContactModal;