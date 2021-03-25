import axios from 'axios';
import jwtDecode from 'jwt-decode';


/**
 *  Déconnexion (suppression du token du localStorage et sur Axios)
 */
function logout(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers["Authorization"];
    console.log("Déconnexion");
}


/**
 * Requête HTTP d'authentification et stockage du token dans le storage et sur Axios
 * @param {object} credentials 
 */
function authenticate(credentials){
    return axios
        .post("https://127.0.0.1:8000/api/login_check", credentials)
        .then(response => response.data.token)
        .then(token => {
            // Je stocke le token dans mon localStorage
            window.localStorage.setItem("authToken", token);
            // On prévient axios qu'on a maintenant un header par défaut sur toutes nos futures requetes HTTP
            setAxiosToken(token);

        });
}


/**
 * Positionne le token jwt sur Axios
 * @param {string} token le token JWT
 */
function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer " + token;
}


/**
 * Mise en place lors du chargement de l'application
 */
function setup(){
    // Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    // Si le token est encore valide
    if(token){
        // const jwtData = jwtDecode(token);
        const {exp: expiration} = jwtDecode(token);
        // Donner le token à axios
        if(expiration  * 1000 > new Date().getTime()){
            setAxiosToken(token);
        } 
    }
}


/**
 * Permet de savoir si on est authentifié ou pas
 * @returns boolean
 */
function isAuthenticated(){
    // Voir si on a un token ?
    const token = window.localStorage.getItem("authToken");
    // Si le token est encore valide
    if(token){
        const {exp: expiration} = jwtDecode(token);
        // Donner le token à axios
        if(expiration  * 1000 > new Date().getTime()){
            return true;
        } 
        return false;
    }
    return false;
}


export default {
    authenticate,
    logout,
    setup,
    isAuthenticated
};