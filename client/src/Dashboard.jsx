import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { Modal, Button } from 'react-bootstrap';
import NewOpportunityForm from "./components/NewOpp";
import ContactModal from "./components/Contacts/ContactCard";
import NewContactModal from './components/Contacts/CreateContact';


function Dashboard(props) {
  const { user, setUser } = props;
  const [opportunities, setOpportunities] = useState([]);
  const [editing, setEditing] = useState({});
  const navigate = useNavigate();

  const token = Cookies.get("token");


  // State for the contact modal
  const [showContactModal, setShowContactModal] = useState(false);
  // const [selectedContact, setSelectedContact] = useState(null);
  const [contactModals, setContactModals] = useState([]);
  const contactModalsRefs = {};

  // Close the contact modal
  const closeContactModal = (modalId) => {
    setContactModals((modals) => modals.filter((modal) => modal.key !== modalId));
    setShowContactModal(false);
    window.location.reload();
  };

  // Open the contact modal
  const openContactModal = (selectedContact) => {
    const modalId = Date.now(); // Generate a unique ID for the modal
    const contactModal = (
      <ContactModal
        key={modalId}
        contact={selectedContact}
        handleClose={() => closeContactModal(modalId, closeContactModal)}
      />
    );
    setContactModals((modals) => [...modals, contactModal]);
    contactModalsRefs[modalId] = contactModal;
  };

  // Function to add a contact ID to an opportunity
  const addContactToOpportunity = (oppId, contactId) => {
    setOpportunities((opps) =>
      opps.map((opportunity) => {
        if (opportunity.id === oppId) {
          return {
            ...opportunity,
            contacts: [...opportunity.contacts, contactId],
          };
        }
        return opportunity;
      })
    );
  };

  const openCreateContactModal = (oppId) => {  // Receive oppId and selectedContact
    const modalId = Date.now(); // Generate a unique ID for the modal
    const contactModal = (
      <NewContactModal
        user={user}
        show={true}
        addContactToOpportunity={addContactToOpportunity}
        handleClose={() => closeContactModal(modalId, closeContactModal)}
        oppId={oppId}
        token={token}
        opportunities={opportunities} // Pass the opportunities
        setOpportunities={setOpportunities} // Pass the setOpportunities function
        afterSubmit={(contactId) => {
          addContactToOpportunity(oppId, contactId);
          setShowContactModal(false); // Close the modal
          window.location.reload(); // Refresh the page
        }}
        />);
          // Handle form submission for creating the contact and updating opportunities and contacts
          const openCreateContactModal = (oppId) => {
            const modalId = Date.now();

            // Define the handleContactSubmit function here
            const handleContactSubmit = (contactFormData) => {
              axios
                .post('http://localhost:8081/contacts/create', contactFormData, {
                  withCredentials: true
                })
                .then((res) => {
                  const contactId = res.data.contact.id;
                  addContactToOpportunity(oppId, contactId);

                  axios
                    .put(`http://localhost:8081/contacts/${contactId}`, {
                      opportunity_id: oppId,
                    })
                    .then(() => {
                      setShowContactModal(false);
                      window.location.reload();
                    })
                    .catch((err) => {
                      console.log("Failed to update contact:", err);
                    });
                })
                .catch((err) => {
                  console.log("Failed to create a contact:", err);
                });
            };

            const contactModal = (
              <NewContactModal
                user={user}
                show={true}
                handleClose={() => closeContactModal(modalId, closeContactModal)}
                oppId={oppId}
                opportunities={opportunities}
                setOpportunities={setOpportunities}
                afterSubmit={handleContactSubmit} // Pass the handleContactSubmit function
              />
            );

            setContactModals((modals) => [...modals, contactModal]);
            contactModalsRefs[modalId] = contactModal;
          };


          setContactModals((modals) => [...modals, contactModal]);
          contactModalsRefs[modalId] = contactModal;
        };

    useEffect(() => {
      console.log(user);
      if (user && user.company) {
        axios
          .get(`http://localhost:8081/opportunities/company/${user.company}`, { withCredentials: true })
          .then((opportunitiesRes) => {
            if (opportunitiesRes && opportunitiesRes.data) {
              const updatedOpportunities = opportunitiesRes.data.opportunities;
              setOpportunities(updatedOpportunities);
            } else {
              console.log("No data available.");
            }
          })
          .catch((err) => console.log(err));
      }
    }, [user]);

    const handleDoubleClick = (id, field) => {
      setEditing({ id, field });
    };

    const handleChange = (e, id, field) => {
      let value = e.target.value;
      if (field === "pot_rev" || field === "chance_of_winning") {
        value = parseFloat(value);
      }
      setOpportunities(
        opportunities.map((opp) =>
          opp.id === id ? { ...opp, [field]: value } : opp
        )
      );
    };

    const handleBlur = (id, field) => {
      // Make a copy of the opportunity object to be updated
      const oppToUpdate = opportunities.find((opp) => opp.id === id);

      // Clear editing state
      setEditing({});

      // If the field being updated is 'status', handle special cases
      if (field === "status") {
        if (oppToUpdate.status === "won") {
          // Set the opportunity_win_date to the current date
          oppToUpdate.opportunity_win_date = new Date().toISOString();
          oppToUpdate.chance_of_winning = 100; // Set chance_of_winning to 100% for "won"
        } else if (oppToUpdate.status === "lost") {
          oppToUpdate.chance_of_winning = 0; // Set chance_of_winning to 0% for "lost"
        }
      }

      const token = Cookies.get("token");

      axios
        .put(
          `http://localhost:8081/opportunities/${id}`,
          {
            [field]: oppToUpdate[field],
            status: oppToUpdate.status, // Include the status field in the request body
            opportunity_win_date: oppToUpdate.opportunity_win_date, // Include opportunity_win_date in the request body
            chance_of_winning: oppToUpdate.chance_of_winning, // Include chance_of_winning in the request body
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        )
        .then(() => {
          setOpportunities((opps) =>
            opps.map((opp) =>
              opp.id === id
                ? {
                  ...opp,
                  [field]: oppToUpdate[field],
                  status: oppToUpdate.status,
                  opportunity_win_date: oppToUpdate.opportunity_win_date,
                  chance_of_winning: oppToUpdate.chance_of_winning,
                }
                : opp
            )
          );
        })
        .catch((err) => console.log(err));
    };




    const handleKeyDown = (e) => {
      if (e.key === "Enter") {
        e.target.blur();
      }
    };

    const [showModal, setShowModal] = useState(false);
    const handleClose = () => setShowModal(false);
    const handleShow = () => setShowModal(true);

    const afterOpportunitySubmit = (contact) => {
      setShowModal(false); // Close the modal
      window.location.reload(); // Refresh the page
    };

    return (
      <div className="container">
        <h1>Opportunity Dashboard</h1>
        <h2 className="my-3">Welcome {user.first_name}</h2>
        <Button variant="success" onClick={handleShow}>
          Create New Opportunity
        </Button>
        <Modal show={showModal} onHide={handleClose} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Create a New Opportunity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* Pass the callback to the form */}
            <NewOpportunityForm user={user} afterSubmit={afterOpportunitySubmit} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
        <hr></hr>
        <h4 className="my-3">Current Opportunities</h4>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Opportunity Name</th>
                <th>Prospect Name</th>
                <th>Potential Revenue</th>
                <th>Chance of Winning (%)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {opportunities.map((opp, index) => (
                <tr key={index}>
                  <td>{opp.opportunity_name}</td>
                  <td>
                    {opp.contacts?.length > 0 ? (
                      opp.contacts.map((contact, i) => (
                        <span key={i}>
                          <a href="#" onClick={() => openCreateContactModal(opp.id)}>
                            + Add Contact
                          </a>
                          {i < opp.contacts.length - 1 ? ", " : ""}
                        </span>
                      ))
                    ) : (
                      <a href="#" onClick={() => openCreateContactModal(opp.id, opportunities)}>
                        + Add Contact
                      </a>
                    )}
                  </td>
                  <td>${opp.pot_rev.toLocaleString()}</td>
                  <td>{`${opp.chance_of_winning}%`}</td>
                  <td>
                    <select
                      value={opp.status || ""}
                      onChange={(e) => {
                        opp.status = e.target.value;
                        handleBlur(opp.id, "status");
                      }}
                    >
                      <option value="identified">Identified</option>
                      <option value="prospecting">Prospecting</option>
                      <option value="meeting scheduled">Meeting Scheduled</option>
                      <option value="proposal sent">Proposal Sent</option>
                      <option value="agreement sent">Agreement Sent</option>
                      <option value="won">Won</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
        {contactModals}
      </div>
    );
  }

  export default Dashboard;
