import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Field from "../components/forms/Field";
import FormContentLoader from "../components/loaders/FormContentLoader";
import customersAPI from "../services/customersAPI";

const CustomerPage = ({history, match}) => {

  const {id = "new"} = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    email: "",
    company: "",
  });

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Récupération du customer en fonction de son id
  const fetchCustomer = async (id) => {
    try {
        const {lastName, firstName, email, company} = await customersAPI.find(id);
        setCustomer({lastName, firstName, email, company});
        setLoading(false);
    } catch (error){
        console.log(error.response);
        toast.error("Le client n'a pas pu être chargé");
        history.replace('/customers');
    }
  }

  // Chargement du customer si besoin au chargement du composant ou au chargement de l'identifiant
  useEffect(() => {
    if(id !== "new") {
        setLoading(true);
        setEditing(true);
        fetchCustomer(id);
    }
  }, [id])

  


  // Gestion des changements des inputs dans le formlaire
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (event) => {
    event.preventDefault();
    try{
        setErrors({});

        if(editing){
            await customersAPI.update(id, customer);
            toast.success("Le client a bien été modifiée !");
        } else {
            await customersAPI.create(customer);
            toast.success("Le client a bien été créé !");
            history.replace("/customers");
        }
    } catch({response}){
        const {violations} = response.data;
        if(violations){
            const apiErrors = {};
            violations.forEach(({propertyPath, message}) => {
                apiErrors[propertyPath] = message
            })
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
        }
    }
  };

  return (
    <>
      { !editing && <h1>Création d'un client</h1> || <h1>Modification du client</h1> }

      { loading && <FormContentLoader number={4}/>}

      { !loading && (

        <form onSubmit={handleSubmit}>
          <Field
            name="lastName"
            label="Nom de famille"
            placeholder="Nom de famille du client"
            value={customer.lastName}
            onChange={handleChange}
            error={errors.lastName}
          />
          <Field
            name="firstName"
            label="Prénom"
            placeholder="Prénom du client"
            value={customer.firstName}
            onChange={handleChange}
            error={errors.firstName}
          />
          <Field
            name="email"
            label="Email"
            placeholder="Adresse email du client"
            type="email"
            value={customer.email}
            onChange={handleChange}
            error={errors.email}
          />
          <Field
            name="company"
            label="Entreprise"
            placeholder="Entreprise du client"
            value={customer.company}
            onChange={handleChange}
            error={errors.company}
          />

          <div className="form-group">
            <button type="submit" className="btn btn-success">
              Enregistrer
            </button>
            <Link to="/customers" className="btn btn-link">
              Retour à la liste
            </Link>
          </div>
        </form>
      )}

    </>
  );
};

export default CustomerPage;
