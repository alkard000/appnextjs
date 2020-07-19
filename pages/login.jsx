import React, { useState, useContext, useEffect } from 'react';
import { css } from '@emotion/core';
import Router from 'next/router';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';

//MATERIAL UI
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import MuiAlert from '@material-ui/lab/Alert';

//FIREBASE
import firebase from '../firebase';
//VALIDACIONES
import useValidacion from '../hooks/useValidacion';
import validarIniciarSesion from '../validacion/validarIniciarSesion';

const STATE_INICIAL = {
    email: '',
    password: ''
}


const Login = () => {

    const [viewPass, setViewPass] = useState(false);

    const { valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur } = useValidacion(STATE_INICIAL, validarIniciarSesion, submitSesion);

    const { email, password, repetirPassword } = valores;

    async function submitSesion(){
        try {
            if (password === repetirPassword) {
                await firebase.login(email, password);
                Router.push('/');
            } else {
                return;
            }
        } catch (error) {
            console.error('Hubo un error al autenticar el usuario', error.message);
        }
    } 

    const handleClickShowPassword = () => {
        setViewPass(!viewPass);
    };

    const handleClose = () => {
        setSubmitMsg(false);
    }

    return (
        <>
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
                        {/*INGRESAR EMAIL */}
                        {!errores.email ?
                            <Campo>
                                <TextField
                                    fullWidth
                                    label="Email"
                                    placeholder="Ingresa tu Email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            :
                            <Campo>
                                <TextField
                                    fullWidth
                                    error
                                    label="Email"
                                    id="email"
                                    placeholder="Ingresa tu Email"
                                    name="email"
                                    helperText={errores.email}
                                    value={email}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                        }
                        {/* INGRESAR PASSWORD */}
                        {!errores.password ?
                            <Campo>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment:
                                            (<InputAdornment style={{ margin: '10px' }} position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {viewPass ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>)
                                    }}
                                    label="Password"
                                    type={viewPass ? "text" : "password"}
                                    placeholder="Ingresa tu Password"
                                    id="password"
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            :
                            <Campo>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment:
                                            (<InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {viewPass ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>)
                                    }}
                                    error
                                    label="Password"
                                    type={viewPass ? "text" : "password"}
                                    id="password"
                                    placeholder="Ingresa tu Password"
                                    name="password"
                                    helperText={errores.password}
                                    value={password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                        }
                        {/* REPETIR PASSWORD */}
                        {!errores.repetirPassword ?
                            <Campo>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment:
                                            (<InputAdornment style={{ margin: '10px' }} position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {viewPass ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>)
                                    }}
                                    label="Repetir Password"
                                    type={viewPass ? "text" : "password"}
                                    placeholder="Ingresa tu Password"
                                    id="repetirPassword"
                                    name="repetirPassword"
                                    value={repetirPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            :
                            <Campo>
                                <TextField
                                    fullWidth
                                    InputProps={{
                                        endAdornment:
                                            (<InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={handleClickShowPassword}
                                                    edge="end"
                                                >
                                                    {viewPass ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>)
                                    }}
                                    error
                                    label="Repetir Password"
                                    type={viewPass ? "text" : "password"}
                                    id="repetirPassword"
                                    placeholder="Ingresa tu Password"
                                    name="repetirPassword"
                                    helperText={errores.repetirPassword}
                                    value={repetirPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                        }
                        <InputSubmit
                            type="submit"
                            value="Iniciar Sesion"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
        </>
    );
}

export default Login;