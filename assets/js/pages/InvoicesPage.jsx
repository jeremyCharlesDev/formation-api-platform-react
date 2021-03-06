import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import TableLoader from '../components/loaders/TableLoader';
import Pagination from '../components/Pagination';
import InvoicesAPI from '../services/invoicesAPI';

const STATUS_CLASSES = {
    PAID: "success",
    SENT: "primary",
    CANCELLED: "danger"
}

const STATUS_LABELS = {
    PAID: "Payée",
    SENT: "Envoyée",
    CANCELLED: "Annulée"
}



const InvoicesPage = () => {
    const [invoices, setInvoices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);

    
    // Récupération des invoices auprès de l'api
    const fetchInvoices = async () => {
        try {
            const data = await InvoicesAPI.findAll()
            setInvoices(data);
            setLoading(false);
        } catch (error){
            console.log(error.response);
            toast.error("Erreur lors du chargement des factures !");
        }
    }

    // Gestion de la suppression d'une invoice
    const handleDelete = async id => {
        const originalInvoices = [...invoices];

        // 1. L'approche optimiste
        setInvoices(invoices.filter(invoice => invoice.id !== id));

        const chrono = invoices.filter(invoice => invoice.id === id);

        // 2. L'approche pessimiste
        try {
            await InvoicesAPI.delete(id);
            toast.success(`La facture n°${chrono[0].chrono} a bien été supprimée !`);
        } catch(error) {
            console.log(error.response);
            setInvoices(originalInvoices);
            toast.error("Une erreur est survenue !");
        }
    }
    

    useEffect(() => {
        fetchInvoices();
    }, []);

    // Gestion de la recherche
    const handleSearch = (event) => {
        const value = event.currentTarget.value;
        setSearch(value);
        setCurrentPage(1);
    }

    // Filtrage des invoices en fonction de la recherche
    const filteredInvoices = invoices.filter(i => 
        i.customer.firstName.toLowerCase().includes(search.toLowerCase()) || 
        i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
        i.amount.toString().startsWith(search.toLowerCase()) ||
        i.chrono.toString().startsWith(search.toLowerCase()) ||
        STATUS_LABELS[i.status].toLowerCase().includes(search.toLowerCase())
    );

    // Gestion du changement de page
    const handlePageChange = page => setCurrentPage(page);

    const itemsPerPage = 10;

    // Gestion du format de date
    const formatDate = (str) => moment(str).format('DD/MM/YYYY');

    const paginatedInvoices = Pagination.getData(filteredInvoices, currentPage, itemsPerPage);

    return ( 
        <>
            <div className="mb-3 d-flex justify-content-between align-items-center">
                <h1>Liste des factures</h1>
                <Link to="/invoices/new" className="btn btn-primary">Créer une facture</Link>
            </div>


            <div className="form-group">
                <input type="text" onChange={handleSearch} value={search} className="form-control" placeholder="Rechercher ..."/>
            </div>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Numéro</th>
                        <th>Client</th>
                        <th className="text-center">Date d'envoi</th>
                        <th className="text-center">Statut</th>
                        <th className="text-center">Montant</th>
                        <th></th>
                    </tr>
                </thead>
                {!loading && (
                    <tbody>
                        {paginatedInvoices.map(invoice => 
                            <tr key={invoice.id}>
                                <td>{invoice.chrono}</td>
                                <td>
                                    <Link to={"/customers/"+invoice.customer.id}>{invoice.customer.firstName} {invoice.customer.lastName}</Link>
                                </td>
                                <td className="text-center">{formatDate(invoice.sentAt)}</td>
                                <td className="text-center">
                                    <span className={"badge badge-" + STATUS_CLASSES[invoice.status]}>{STATUS_LABELS[invoice.status]}</span>
                                </td>
                                <td className="text-center">{invoice.amount.toLocaleString()} €</td>
                                <td>
                                    <Link to={"/invoices/" + invoice.id} className="btn btn-sm btn-primary mr-1">Editer</Link>
                                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(invoice.id)}>Supprimer</button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                )}

            </table>
            {loading && <TableLoader/> }

            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} onPageChanged={handlePageChange} length={filteredInvoices.length}/>
        </>
     );
}
 
export default InvoicesPage;