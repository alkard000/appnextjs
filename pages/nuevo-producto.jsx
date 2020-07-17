import React, { useState, useContext } from 'react';
import { css } from '@emotion/core';
import Router, {useRouter} from 'next/router';
import FileUploader from 'react-firebase-file-uploader'
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';

import {FirebaseContext} from '../firebase';
//VALIDACIONES
import useValidacion from '../hooks/useValidacion';
import validarCrearProducto from '../validacion/validarCrearProducto';

const STATE_INICIAL = {
    nombre: '',
    empresa: '',
    imagen: '',
    url: '',
    descripcion: ''
}

const NuevoProducto = () => {

    //STATE DE LAS IMAGENES
    const [nombreImagen, setNombreImagen  ] = useState('');
    const [subiendo, setSubiendo] = useState(false);
    const [progreso, setProgreso] = useState(0);
    const [urlImagen, setUrlImagen] = useState('');

    const [error, setError] = useState(false);

    
    const { valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur } = useValidacion(STATE_INICIAL, validarCrearProducto, crearProducto);

    const { nombre, empresa, imagen, url, descripcion } = valores;
    const router = useRouter();

    //API CONTEXT PARA LA OPERACION CRUD DE FIREBASE
    const {usuario, firebase} = useContext(FirebaseContext)

    async function crearProducto() {
        //HOOK DE ROUTING PARA REDIRECCIONAR LUEGO DE CREAR EL PRODUCTO
        if(!usuario){
            return router.push('/login');
        }

        //ARREGLO INICAL PARA EL NUEVO PRODUCTO CREADO
        const producto = {
            nombre,
            empresa, 
            url, 
            urlImagen,
            descripcion,
            votos : 0,
            comentarios : [],
            creado : Date.now()
        }

        //INSERTAR EN LA BASE DE DATOS
        firebase.db.collection('producto').add(producto);

        return router.push('/');
    }

    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    }

    const handleProgress = progreso => setProgreso({progreso});

    const handleUploadError = error => {
        setSubiendo(error);
        console.log(error);
    }

    const handleUploadSuccess = nombreImagen => {
        setProgreso(100);
        setSubiendo(false);
        setNombreImagen(nombreImagen)
        firebase
            .storage
            .ref('producto')
            .child(nombreImagen)
            .getDownloadURL()
            .then(url => {
                console.log(url);
                setUrlImagen(url);
            });
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
                    >Nuevo Producto</h1>
                    <Formulario
                        onSubmit={handleSubmit}
                        noValidate
                    >
                        <fieldset>
                            <legend>Informacion general</legend>
                            <Campo>
                                <label htmlFor="nombre">Nombre</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    placeholder="Coloca tu nombre"
                                    name="nombre"
                                    value={nombre}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.nombre && <Error>{errores.nombre}</Error>}
                            <Campo>
                                <label htmlFor="empresa">Empresa</label>
                                <input
                                    type="text"
                                    id="empresa"
                                    placeholder="Coloca tu Empresa o  Compañia"
                                    name="empresa"
                                    value={empresa}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.empresa && <Error>{errores.empresa}</Error>}
                            <Campo>
                                <label htmlFor="imagen">Imagen</label>
                                <FileUploader
                                    accept="image/*"
                                    id="imagen"
                                    name="imagen"
                                    randomizeFilename
                                    storageRef={firebase.storage.ref("producto")}
                                    onUploadStart={handleUploadStart}
                                    onUploadError={handleUploadError}
                                    onUploadSuccess={handleUploadSuccess}
                                    onProgress={handleProgress}
                                />
                            </Campo>

                            <Campo>
                                <label htmlFor="url">URL</label>
                                <input
                                    type="url"
                                    id="url"
                                    placeholder="Url del producto"
                                    name="url"
                                    value={url}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.url && <Error>{errores.url}</Error>}
                        </fieldset>

                        <fieldset>
                            <legend>Sobre tu producto</legend>
                            <Campo>
                                <label htmlFor="descripcion">Descripcion</label>
                                <textarea
                                    id="descripcion"
                                    placeholder="Sube tu descripcion"
                                    name="descripcion"
                                    value={descripcion}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                            </Campo>
                            {errores.descripcion && <Error>{errores.descripcion}</Error>}
                        </fieldset>
                        {error && <Error>{error}</Error>}
                        <InputSubmit
                            type="submit"
                            value="Crear Producto"
                        />
                    </Formulario>
                </>
            </Layout>
        </div>
    );
}

export default NuevoProducto;