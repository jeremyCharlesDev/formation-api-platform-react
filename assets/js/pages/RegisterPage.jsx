import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import Field from '../components/forms/Field';
import usersAPI from '../services/usersAPI';

const RegisterPage = ({history}) => {

    const [user, setUser] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirm: ""
    });

    // Gestion des changements des inputs dans le formulaire
    const handleChange = ({ currentTarget }) => {
        const { value, name } = currentTarget;
        setUser({ ...user, [name]: value });
    };
    
    // Gestion de la soumission
    const handleSubmit = async (event) => {
        event.preventDefault();
        const apiErrors = {};
        if(user.password !== user.passwordConfirm){
            apiErrors.passwordConfirm = "Votre confirmation de mot de passe n'est pas conforme avec le mot de passe original";
            setErrors(apiErrors);
            toast.error("Des erreurs dans votre formulaire !");
            return;
        }

        try{
            await usersAPI.create(user);
            // TODO : flash success
            toast.success("Vous êtes désormais inscrit, vous pouvez vous connecter !");
            setErrors({});
            history.replace("/login");
        } catch(error){
            console.log(error.response);
            const {violations} = error.response.data;
            if(violations){
                violations.forEach(violation => {
                    apiErrors[violation.propertyPath] = violation.message;
                });
                setErrors(apiErrors);
            }
            toast.error("Des erreurs dans votre formulaire !");
        }
    }



    return ( 
        <>
            <h1>Inscription</h1>

            <form onSubmit={handleSubmit}>
                <Field
                    name="firstName"
                    label="Prénom"
                    placeholder="Votre prénom"
                    value={user.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                />
                <Field
                    name="lastName"
                    label="Nom de famille"
                    placeholder="Votre nom de famille"
                    value={user.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                />
                <Field
                    name="email"
                    label="Email"
                    type="email"
                    placeholder="Votre email"
                    value={user.email}
                    onChange={handleChange}
                    error={errors.email}
                />
                <Field
                    name="password"
                    label="Mot de passe"
                    type="password"
                    placeholder="Votre mot de passe"
                    value={user.password}
                    onChange={handleChange}
                    error={errors.password}
                />
                <Field
                    name="passwordConfirm"
                    label="Confirmez votre mot de passe"
                    type="password"
                    placeholder="Confirmez votre mot de passe"
                    value={user.passwordConfirm}
                    onChange={handleChange}
                    error={errors.passwordConfirm}
                />

                <div className="form-group">
                    <button type="submit" className="btn btn-success">
                        Confirmation
                    </button>
                    <Link to="/login" className="btn btn-link">
                        J'ai déjà un compte
                    </Link>
                </div>


            </form>
            
        </>
     );
}
 
export default RegisterPage;