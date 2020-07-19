import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Button from '@material-ui/core/Button';

import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/Error404';
import { Campo, InputSubmit } from '../../components/UI/Formulario';
import Boton from '../../components/UI/Boton';

const ContenedorProducto = styled.div`
    @media (min-width:768px){
        display:grid;
        grid-template-columns:2fr 1fr;
        column-gap:2rem;
    }
`;

const CreadorProducto = styled.p`
    padding:.5rem 2rem;
    background-color:#da552f;
    color:#fff;
    text-transform:uppercase;
    font-weight:bold;
    display:inline-block;
    text-align:center;
`;

const Producto = () => {

    //STATE DEL COMPONENTE
    const [producto, setProducto] = useState({});
    const [error, setError] = useState(false);
    const [comentario, setComentario] = useState({});
    const [consultarDB, setConsultarDB] = useState(true);
    //ROUTING PARA OBTENR LA URL ACTUAL
    const router = useRouter();
    const { query: { id } } = router;

    const { firebase, usuario } = useContext(FirebaseContext);

    useEffect(() => {
        if (id && consultarDB) {
            const obtenerProducto = async () => {
                const productoQuery = await firebase.db.collection('producto').doc(id)
                const producto = await productoQuery.get();

                if (producto.exists) {
                    setProducto(producto.data());
                    setConsultarDB(false);
                } else {
                    setError(true);
                    setConsultarDB(false);
                }
            }
            obtenerProducto();
        }
    }, [id]);

    const { comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos, creador, haVotado } = producto;

    //AMINISTRAR Y VALIDAR OS VOTOS
    const votarProducto = () => {

        console.log(haVotado.includes(usuario.uid));

        if (!usuario) {
            return router.push('/login')
        }

        // obtener y sumar un nuevo voto
        const nuevoTotal = votos + 1;

        // Verificar si el usuario actual ha votado
        if (haVotado.includes(usuario.uid)) return;

        // guardar el ID del usuario que ha votado
        const nuevoHaVotado = [...haVotado, usuario.uid];

        //  Actualizar en la BD
        firebase.db.collection('producto').doc(id).update({
            votos: nuevoTotal,
            haVotado: nuevoHaVotado
        })

        // Actualizar el state
        setProducto({
            ...producto,
            votos: nuevoTotal
        })

        setConsultarDB(true); //EXISTE UN VOTO ===> CONSULTAR A LA BASE DE DATOS
    }

    //FUNCIONES PARA CREAR COMENTARIOS
    const comentarioChange = e => {
        setComentario({
            ...comentario,
            [e.target.name]: e.target.value
        })
    }

    //IDNETIFICA SI EL DEL COMENTARIO ES EL DUEÑO
    const esCreador = id => {
        if (creador.id === id) {
            return true;
        }
    }

    //AGREGAR EL COMENTARIO
    const agregarComentario = e => {
        e.preventDefault();

        if (!usuario) {
            return router.push('/login')
        }

        //INFORMACION EXTRA AL COMENTARIO
        comentario.usuarioId = usuario.uid;
        comentario.usuarioNombre = usuario.displayName;

        //TOMAR UNA COPIA DEL COMENTARIO Y AGREGARLO AL ARREGLO
        const nuevosComentarios = [...comentarios, comentario];

        //ACTUALIZARLA DB
        firebase.db.collection('producto').doc(id).update({
            comentarios: nuevosComentarios
        })

        //ACTUALIZAR EL STATE
        setProducto({
            ...producto,
            comentarios: nuevosComentarios
        })

        setConsultarDB(true); //EXISTE UN COMENTARIO ===> CONSULTAR A LA BASE DE DATOS
    }

    const puedeBorrar = () => {
        if(!usuario) return false;

        if(creador && creador.id === usuario.uid){
            return true;
        }
    }

    //ELIMINAR UN PRODUCTO DE LA BASE DE DATOS
    const eliminarProducto = async () => {
        if(!usuario){
            return router.push('/login');
        }

        if(creador && creador.id !== usuario.uid){
            return router.push('/');
        }

        try {  
            await firebase.db.collection('producto').doc(id).delete();
            router.push('/'); 
        } catch (error) {
            console.log(error);
        }
        
    }

    return (
        <Layout>
            <>
                {(Object.keys(producto).length === 0 && !error && !creado) &&
                    <div
                        css={css`
                        display: flex;
                        flex-wrap: wrap;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                        align-content: center
                    `}
                    >
                        <CircularProgress color="secondary" />
                    </div>}

                {error ? <Error404 /> :
                    <div className="contenedor">
                        <h1
                            css={css`
                            text-align:center;
                            margin-top:5rem;
                        `}
                        >{nombre}</h1>

                        <ContenedorProducto>
                            <div>
                                <p>Publicado hace {creado && formatDistanceToNow(new Date(creado), { locale: es })}</p>
                                {creador && <p>Publicado por : {creador.nombre} | {empresa}</p>}

                                {urlImagen ?
                                    <img src={urlImagen} />
                                    :
                                    <div
                                        css={css`
                                    display: flex;
                                    flex-wrap: wrap;
                                    flex-direction: row;
                                    justify-content: center;
                                    align-items: center;
                                    align-content: center
                                `}
                                    ><CircularProgress color="secondary" /></div>}

                                <p>{descripcion}</p>

                                {usuario && (
                                    <>
                                        <h1>Agrega tu comentario</h1>
                                        <form
                                            onSubmit={agregarComentario}
                                        >
                                            <Campo>
                                                <input
                                                    type="text"
                                                    name="mensaje"
                                                    onChange={comentarioChange}

                                                />
                                            </Campo>
                                            <InputSubmit
                                                type="submit"
                                                value="Agregar comentario"
                                            />
                                        </form>
                                    </>
                                )}

                                <h2
                                    css={css`
                                    margin:2rem 0;
                                `}
                                >Comentarios</h2>

                                <ul>
                                    {comentarios && comentarios.map((comentario, i) => (
                                        <li
                                            key={`${comentario.usuarioId}-${i}`}
                                            css={css`
                                            border : 1px solid #e1e1e1;
                                            padding:2rem;
                                        `}
                                        >
                                            <p>{comentario.mensaje}</p>
                                            <p>Escrito por :
                                            <span
                                                    css={css`
                                                    font-weight:bold;
                                                `}
                                                > {comentario.usuarioNombre}</span>
                                            </p>
                                            {esCreador(comentario.usuarioId) && <CreadorProducto>Es Creador</CreadorProducto>}
                                        </li>
                                    ))}
                                </ul>

                            </div>

                            <aside>
                                <Boton
                                    target="_blank"
                                    bgColor="true"
                                    href={url}
                                >
                                    Visitar URL
                            </Boton>
                                {usuario && (
                                    <button
                                        onClick={votarProducto}
                                        id="desactivar"
                                    // css={css`
                                    //     ${!pointer ? 'pointer-events: none;' : null}
                                    // `}
                                    >
                                        Votar
                                    </button>
                                )}

                                <p
                                    css={css`
                                    text-align:center;
                                `}
                                >{votos} Votos</p>
                            </aside>
                        </ContenedorProducto>

                        {puedeBorrar() && (
                            <Boton
                                onClick={eliminarProducto}
                            >Elminar Producto</Boton>
                        )}
                    </div>

                }

            </>
        </Layout>

    );
}

export default Producto;