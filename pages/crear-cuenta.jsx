import React, { useState, useContext } from 'react';
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

//FIREBASE
import firebase from '../firebase';
//VALIDACIONES
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';

const CrearCuenta = () => {


    const [error, setError] = useState(false);
    const [viewPass, setViewPass] = useState(false);


    const STATE_INICIAL = {
        nombre: '',
        email: '',
        password: '',
        repetirPassword : ''
    }
    const { valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur } = useValidacion(STATE_INICIAL, validarCrearCuenta, crearCuenta);

    const { nombre, email, password, repetirPassword } = valores;


    function crearCuenta() {
        if(password === repetirPassword){
            registrarUsuario(nombre, email, password, {imagenUrl : ''});
            Router.push('/');
        }else{
            return;
        }
    }

    const handleClickShowPassword = () => {
        setViewPass(!viewPass);
    };


    return (
        <div>
            <Layout>
                <>
                    <h1
                        css={css`
                            text-align:center;
                            margin-top:5rem;
                        `}
                    >Crear Cuenta</h1>
                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        {/*INGRESAR NOMBRE */}
                        {!errores.nombre ?
                            <Campo>
                                <TextField
                                    fullWidth
                                    label="Nombre"
                                    id="nombre"
                                    placeholder="Coloca tu nombre"
                                    name="nombre"
                                    value={nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            :
                            <Campo>
                                <TextField
                                    fullWidth
                                    error
                                    label="Nombre"
                                    id="nombre"
                                    placeholder="Coloca tu nombre"
                                    name="nombre"
                                    helperText={errores.nombre}
                                    value={nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                        }
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
                                    endAdornment :
                                        (<InputAdornment style={{margin:'10px'}} position="end">
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
                                        endAdornment :
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
                                    endAdornment :
                                        (<InputAdornment style={{margin:'10px'}} position="end">
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
                                        endAdornment :
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

                        {error && <Error>{error}</Error>}
                        <InputSubmit
                            type="submit"
                            value="Crear Cuenta"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    );
}

export default CrearCuenta;