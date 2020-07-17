import React, {useState} from 'react';
import { css } from '@emotion/core';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import {Formulario, Campo, InputSubmit, Error} from '../components/UI/Formulario';

import firebase from '../firebase';
//VALIDACIONES
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
    email : '',
    password : ''
}

const Login = () => {

const [error, setError] = useState(false);


const {valores,
    errores,
    submitForm,
    handleSubmit,
    handleChange, 
    handleBlur} = useValidacion(STATE_INICIAL, validarIniciarSesion, iniciarSesion);

const {email, password} = valores;


async function iniciarSesion(){
    try {
        await firebase.login(email, password);
        Router.push('/');
    } catch (error) {
        console.error('Hubo un error al autenticar el usuario', error.message);
        setError(error.message);
    }
}

return ( 
    <div>
        <Layout>
            <>
                <h1
                    css={css`
                        text-align:center;
                        margin-top:5rem;
                    `}
                >Iniciar Sesion</h1>
                <Formulario
                    onSubmit={handleSubmit}
                    noValidate
                >
                    <Campo>
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            id="email"
                            placeholder="Coloca tu Email"
                            name="email"
                            value={email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.email && <Error>{errores.email}</Error>}
                    <Campo>
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Coloca tu Password"
                            name="password"
                            value={password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                    </Campo>
                    {errores.password && <Error>{errores.password}</Error>}
                    {error && <Error>{error}</Error>}
                    <InputSubmit
                        type="submit"
                        value="Iniciar Sesion"
                    />
                </Formulario>
            </>
        </Layout> 
    </div>
);
}
 
export default Login;