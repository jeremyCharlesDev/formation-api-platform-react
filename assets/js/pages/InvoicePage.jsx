import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import Field from '../components/forms/Field';
import Select from '../components/forms/Select';
import customersAPI from '../services/customersAPI';
import invoicesAPI from '../services/invoicesAPI';

const InvoicePage = ({history, match}) => {

    const {id = "new"} = match.params;

    const [invoice, setInvoice] = useState({
        customer: "",
        status: "SENT",
        amount: ""
    });

    const [errors, setErrors] = useState({
        customer: "",
        status: "",
        amount: ""
      });

    const [editing, setEditing] = useState(false);
    const [customers, setCustomers] = useState([]);

    //Permet d'aller récupérer les customers
    const fetchCustomers = async () => {
        try {
            const data = await customersAPI.findAll()
            setCustomers(data);
            if(!invoice.customer && id === "new"){
                setInvoice({...invoice, customer: data[0].id});
            }
        } catch(error){
            console.log(error.response)
            // TODO : Notification flash message d'erreur
            history.replace('/invoices');
        }
    }

    // Récupération de la facture en fonction de son id
    const fetchInvoice = async (id) => {
        try {
            const {amount, status, customer} = await invoicesAPI.find(id);
            setInvoice({amount, status, customer: customer.id});
        } catch (error){
            console.log(error.response);
            // TODO : Notification flash message d'erreur
            history.replace('/invoices');
        }
    }
    
    //Au chargement du composant, on va chercher la liste des clients
    useEffect(() => {
        fetchCustomers();
    }, []);

    //Au chargement du composant, on va chercher les infos de la facture quand l'url change
    useEffect(() => {
        if(id !== "new") {
            setEditing(true);
            fetchInvoice(id);
        } 
    }, [id]);
    

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setInvoice({ ...invoice, [name]: value });
    };

    
    // Gestion de la soumission du formulaire
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if(editing){
                await invoicesAPI.update(id, invoice);
                // TODO : flash notif de succès
            } else {
                await invoicesAPI.create(invoice);
                // TODO : flash notif succes
                history.replace("/invoices");
            }
            setErrors({});
        } catch({response}){
            const {violations} = response.data;
            if(violations){
                const apiErrors = {};
                violations.forEach(({propertyPath, message}) => {
                    apiErrors[propertyPath] = message
                })
                setErrors(apiErrors);
                // TODO : flash notif d'erreurs
            }
        }
    };
    

    return ( 
        <>
            { !editing && <h1>Création d'une facture</h1> || <h1>Modification d'une facture</h1> }

            <form onSubmit={handleSubmit}>

                <Field
                    name="amount"
                    type="number"
                    label="Montant"
                    placeholder="Montant de la facture"
                    value={invoice.amount}
                    onChange={handleChange}
                    error={errors.amount}
                />

                <Select name="customer" label="Client" error={errors.customer} onChange={handleChange} value={invoice.customer}>
                    {customers.map(customer => 
                        <option key={customer.id} value={customer.id}>{customer.firstName} {customer.lastName}</option>
                    )}
                </Select>

                <Select name="status" label="Statut" error={errors.status} onChange={handleChange} value={invoice.status}>
                    <option value="SENT">Envoyée</option>
                    <option value="PAID">Payée</option>
                    <option value="CANCELLED">Annulée</option>
                    {/* <option value="CANCELLED" selected={invoice.status === "CANCELLED" && true}>Annulée</option> */}
                </Select>
                
                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Enregistrer
                    </button>
                    <Link to="/invoices" className="btn btn-link">
                        Retour aux factures
                    </Link>
                </div>
            </form>
        </>
     );
}
 
export default InvoicePage;