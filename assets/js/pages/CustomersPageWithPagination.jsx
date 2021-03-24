import React, { useEffect, useState } from 'react';
import axios from "axios";
import Pagination from '../components/Pagination';

const CustomersPageWithPagination = () => {
    const [customers, setCustomers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 10;

    useEffect(() => {
        axios.get(`https://127.0.0.1:8000/api/clients?pagination=true&count=${itemsPerPage}&page=${currentPage}`)
        .then(response => {
            setCustomers(response.data['hydra:member']);
            setTotalItems(response.data['hydra:totalItems']);
            setLoading(false);
        })
        .catch(error => console.log(error.response));
    }, [currentPage]);


    const handlePageChange = (page) => {
        setCurrentPage(page);
        setLoading(true);
    }


    const handleDelete = id => {
        const originalCustomers = [...customers];

        // 1. L'approche optimiste
        setCustomers(customers.filter(customer => customer.id !== id));

        // 2. L'approche pessimiste
        axios.delete("https://127.0.0.1:8000/api/customers/" + id)
        .then(response => console.log("ok"))
        .catch(error => {
            setCustomers(originalCustomers);
            console.log(error.response);
        });
    }


    return ( 
        <>
            <h1>Liste des clients (pagination)</h1>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Id.</th>
                        <th>Client</th>
                        <th>Email</th>
                        <th>Entreprise</th>
                        <th className="text-center">Factures</th>
                        <th className="text-center">Montant total</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (<tr><td>Chargement ...</td></tr>)}
                    {!loading && customers.map(customer => 
                        <tr key={customer.id}>
                            <td>{customer.id}</td>
                            <td>
                                <a href="#">{customer.firstName} {customer.lastName}</a>
                            </td>
                            <td>{customer.email}</td>
                            <td>{customer.company}</td>
                            <td className="text-center">
                                <span className="badge badge-info">
                                    {customer.invoices.length}
                                </span>
                            </td>
                            <td className="text-center">{customer.totalAmount.toLocaleString()} €</td>
                            <td>
                                <button 
                                    onClick={() => handleDelete(customer.id)}
                                    disabled={customer.invoices.length > 0} 
                                    className="btn btn-sm btn-danger"
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ) }
                    
                </tbody>
            </table>
            
            <Pagination currentPage={currentPage} itemsPerPage={itemsPerPage} length={totalItems} onPageChanged={handlePageChange}/>

        </>
     );
}
 
export default CustomersPageWithPagination;