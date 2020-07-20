import React, { useState, useContext } from 'react';
import { css } from '@emotion/core';
import Router, { useRouter } from 'next/router';
import FileUploader from 'react-firebase-file-uploader'
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/UI/Formulario';
import Error404 from '../components/layout/Error404';
import FadeIn from 'react-fade-in';

//MATERIAL UI
import TextField from '@material-ui/core/TextField';
//API CONTEXT
import { FirebaseContext } from '../firebase';
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
    const [nombreImagen, setNombreImagen] = useState('');
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
    const { usuario, firebase } = useContext(FirebaseContext);

    async function crearProducto() {
        //HOOK DE ROUTING PARA REDIRECCIONAR LUEGO DE CREAR EL PRODUCTO
        if (!usuario) {
            return router.push('/login');
        }

        //ARREGLO INICAL PARA EL NUEVO PRODUCTO CREADO
        const producto = {
            nombre,
            empresa,
            url,
            urlImagen,
            descripcion,
            votos: 0,
            comentarios: [],
            creado: Date.now(),
            creador: {
                id: usuario.uid,
                nombre: usuario.displayName
            },
            haVotado : []
        }

        //INSERTAR EN LA BASE DE DATOS
        firebase.db.collection('producto').add(producto);

        return router.push('/');
    }

    const handleUploadStart = () => {
        setProgreso(0);
        setSubiendo(true);
    }

    const handleProgress = progreso => setProgreso({ progreso });

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
                {!usuario ? <Error404 /> : (
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
                            
                                {/*INGRESAR NOMBRE */}
                                {!errores.nombre ?
                                    <Campo>
                                        <TextField
                                            fullWidth
                                            label="Nombre del Producto"
                                            id="nombre"
                                            placeholder="Coloca el Nombre del Producto"
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
                                            label="Nombre del Producto"
                                            id="nombre"
                                            placeholder="Coloca el Nombre del Producto"
                                            name="nombre"
                                            helperText={errores.nombre}
                                            value={nombre}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Campo>
                                }
                                {/*INGRESAR EMPRESA */}
                                {!errores.empresa ?
                                    <Campo>
                                        <TextField
                                            fullWidth
                                            label="Empresa"
                                            id="empresa"
                                            placeholder="Coloca tu empresa"
                                            name="empresa"
                                            value={empresa}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Campo>
                                    :
                                    <Campo>
                                        <TextField
                                            fullWidth
                                            error
                                            label="Empresa"
                                            id="empresa"
                                            placeholder="Coloca tu empresa"
                                            name="empresa"
                                            helperText={errores.empresa}
                                            value={empresa}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Campo>
                                }
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

                                {/*INGRESAR URL */}
                                {!errores.url ?
                                    <Campo>
                                        <TextField
                                            fullWidth
                                            type="url"
                                            label="Url"
                                            id="url"
                                            placeholder="Coloca la URL del Producto"
                                            name="url"
                                            value={url}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Campo>
                                    :
                                    <Campo>
                                        <TextField
                                            fullWidth
                                            error
                                            type="url"
                                            label="Url"
                                            id="url"
                                            placeholder="Coloca la URL del Producto"
                                            name="url"
                                            helperText={errores.url}
                                            value={url}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                        />
                                    </Campo>
                                }

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
                                {errores.descripcion && <FadeIn><Error>{errores.descripcion}</Error></FadeIn> }
                            <InputSubmit
                                type="submit"
                                value="Crear Producto"
                            />
                        </Formulario>
                    </>
                )}
            </Layout>
        </div>
    );
}

export default NuevoProducto;