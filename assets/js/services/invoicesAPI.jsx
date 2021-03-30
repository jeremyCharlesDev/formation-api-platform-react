import axios from 'axios';


function find(id){
    return axios
    .get("https://127.0.0.1:8000/api/invoices/" + id)
    .then(response => response.data);
}


function findAll(){
    return axios
    .get("https://127.0.0.1:8000/api/invoices")
    .then(response => response.data['hydra:member']);
}

function update(id, invoice){
    return axios.put("https://127.0.0.1:8000/api/invoices/" + id, 
    {...invoice, customer: `/api/customers/${invoice.customer}`, amount: Number(invoice.amount)}
    );
}


function deleteInvoice(id){
    return axios
    .delete("https://127.0.0.1:8000/api/invoices/" + id)
}

function create(invoice){
    return axios.post("https://127.0.0.1:8000/api/invoices", {...invoice, customer: `/api/customers/${invoice.customer}`, amount: Number(invoice.amount)});
}


export default {
    findAll,
    delete: deleteInvoice,
    create,
    find,
    update
};