import React, { useEffect, useContext, useState } from 'react';
import { useRouter } from 'next/router';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
//ANIMATED
import {
    CSSTransition,
    TransitionGroup,
} from 'react-transition-group';
//MATERIAL UI
import Avatar from '@material-ui/core/Avatar';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import CircularProgress from '@material-ui/core/CircularProgress';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import Chip from '@material-ui/core/Chip';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import StarsIcon from '@material-ui/icons/Stars';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

import ShareIcon from '@material-ui/icons/Share';


import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';
import Button from '@material-ui/core/Button';

import Layout from '../../components/layout/Layout';
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/Error404';
import { Campo, InputSubmit } from '../../components/UI/Formulario';
import Boton from '../../components/UI/Boton';
import transitions from '@material-ui/core/styles/transitions';

const ContenedorProducto = styled.div`
    @media (min-width:768px){
        display:grid;
        grid-template-columns:2fr 1fr;
        column-gap:2rem;
    }
`;

const QuienComento = styled.div`
    background-color:#fff;
    padding:2rem;
    border-radius:15px;
    margin:2rem 0 ;
`;

const ListaComentario = styled.div`
    border : 1px solid #e1e1e1;
    margin : 2rem 0;
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
        if (!usuario) return false;

        if (creador && creador.id === usuario.uid) {
            return true;
        }
    }

    //ELIMINAR UN PRODUCTO DE LA BASE DE DATOS
    const eliminarProducto = async () => {
        if (!usuario) {
            return router.push('/login');
        }

        if (creador && creador.id !== usuario.uid) {
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
                                <TransitionGroup

                                >
                                    {comentarios && comentarios.map((comentario, i) => (
                                        <CSSTransition
                                            key={`${comentario.usuarioId}-${i}`}
                                            timeout={500}
                                            css={css`
                                                border : 1px solid #e1e1e1;
                                                padding:2rem;
                                                background-color:#e2e2e2;
                                                border-radius:15px;
                                            `}
                                        >
                                            <ListaComentario>
                                                <div style={{display:'flex', alignContent:'center', alignItems:'center'}}>
                                                    <Avatar >{comentario.usuarioNombre.charAt(0)}</Avatar>
                                                    <p style={{marginLeft:'1.5rem'}}>{comentario.usuarioNombre}</p>
                                                </div>
                                                <p
                                                    css={css`
                                                        background-color:#fff;
                                                        padding:2rem;
                                                        border-radius:15px;
                                                        border:1px solid #e1e1e1;
                                                    `}
                                                >
                                                    {comentario.mensaje}
                                                </p>

                                                {esCreador(comentario.usuarioId) ?
                                                    <Chip
                                                        label="Autor"
                                                        clickable
                                                        color="primary"
                                                        icon={<StarsIcon />}
                                                    />
                                                    :
                                                    null
                                                }
                                            </ListaComentario>
                                        </CSSTransition>
                                    ))}
                                </TransitionGroup>
                            </div>

                            <aside>
                                <Chip
                                    style={{
                                        width:"100%",
                                        fontSize:"1.5rem",
                                        margin:"2rem 0"
                                    }}
                                    icon={<QueryBuilderIcon />}
                                    label={<p>Publicado hace {creado && formatDistanceToNow(new Date(creado), { locale: es })}</p>}
                                />
                                {creador &&
                                <>
                                    <Card
                                        style={{margin : "1.5rem 0rem"}}
                                    >
                                        <CardHeader
                                            avatar={
                                                <Avatar aria-label="recipe">
                                                    {creador.nombre.charAt(0)}
                                                </Avatar>
                                            }
                                            title={<p style={{fontSize:'2rem',  margin:'0'}}>Creado por {creador.nombre}</p>}
                                            subheader={<p style={{fontSize:'1.5rem', margin:'0'}}>{empresa}</p>}
                                        />
                                        <CardContent>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                                <p style={{fontSize:'1.5rem'}}>{descripcion}</p>
                                            </Typography>
                                        </CardContent>
                                        {/* <CardActions disableSpacing>
                                            <IconButton aria-label="add to favorites">
                                                <FavoriteIcon />
                                            </IconButton>
                                            <IconButton aria-label="share">
                                                <ShareIcon />
                                            </IconButton>
                                        </CardActions> */}
                                    </Card>
                                </>
                                }

                                <BottomNavigation
                                    style={{ 
                                        padding: '2rem', 
                                        borderRadius: '15px'
                                    }}
                                    showLabels
                                >
                                    {usuario ?
                                        <BottomNavigationAction onClick={votarProducto} label={`${votos} Votos`} icon={<FavoriteIcon style={{ color: 'red', fontSize: 40 }} />} />
                                        :
                                        <BottomNavigationAction href='/login' label={`${votos} Votos`} icon={<FavoriteIcon style={{ fontSize: 40 }} />} />
                                    }
                                    <BottomNavigationAction href={url} label="Visitar URL" icon={<LocationOnIcon style={{ color: 'orange', fontSize: 40 }} />} />
                                </BottomNavigation>

                                <QuienComento>
                                    <p>Quienes Comentaron: </p>
                                    <AvatarGroup max={4}>
                                        {comentarios && comentarios.map((comentario, i) => (
                                            <Avatar key={i}>{comentario.usuarioNombre.charAt(0)}</Avatar>
                                        ))}
                                    </AvatarGroup>
                                </QuienComento>
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