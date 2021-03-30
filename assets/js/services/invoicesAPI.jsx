import axios from 'axios';
import { INVOICES_API } from '../config';


function find(id){
    return axios
    .get(INVOICES_API + "/" + id)
    .then(response => response.data);
}


function findAll(){
    return axios
    .get(INVOICES_API)
    .then(response => response.data['hydra:member']);
}

function update(id, invoice){
    return axios.put(INVOICES_API + "/" + id, 
    {...invoice, customer: `/api/customers/${invoice.customer}`, amount: Number(invoice.amount)}
    );
}


function deleteInvoice(id){
    return axios
    .delete(INVOICES_API + "/" + id)
}

function create(invoice){
    return axios.post(INVOICES_API, {...invoice, customer: `/api/customers/${invoice.customer}`, amount: Number(invoice.amount)});
}


export default {
    findAll,
    delete: deleteInvoice,
    create,
    find,
    update
};