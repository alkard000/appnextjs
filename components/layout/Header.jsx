import React, {useState, useContext} from 'react';
import Buscar from '../UI/Buscar';
import Navegacion from './Navegacion';
import Link from 'next/link';
import styled from '@emotion/styled';
import { css } from '@emotion/core';
import Router from 'next/router';
//MATERIAL UI
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import MenuMobile from './MenuMobile';
import Boton from '../UI/Boton';
//API CONTEXT
import {FirebaseContext} from '../../firebase';
//CUSTOM HOOKS
import useQueries from '../../hooks/useQueries';

const ContenedorHeader = styled.div`
    max-width:1200px;
    width:95%;
    margin:0 auto;
    @media (min-width:768px){
        display:flex;
        justify-content:space-between;
    }
`;

const ContenedorMobile = styled.div`
    display:flex;
    justify-content:space-between;
`;

const Logo = styled.a`
    color: var(--naranja);
    font-size : 4rem;
    line-height:0;
    font-weight:700;
    font-family:'Roboto Slab', serif;
    margin-right:2rem;
    
    &:hover{
        cursor:pointer
    }
`;

const Header = () => {

    const {mobile, tablet, computer} = useQueries();

    const {usuario, firebase} = useContext(FirebaseContext);
    console.log(usuario);

    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = () => {
        firebase.cerrarSesion();
        Router.push('/login');
    }

    const handleClickPop = e => {
        setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);

    return (
        <header
            css={css`
            border-bottom : 2px solid var(--gris3);
            padding : 1rem 0;
            background-color:#fff;
            width:100%
        `}
        >
            {(computer)?<ContenedorHeader>
                <div
                    css={css`
                        display:flex;
                        align-items:center;
                    `}
                >
                    <Link href='/'>
                        <Logo>P</Logo>
                    </Link>
                    <Buscar />
                    <Navegacion />
                </div>

                <div
                    css={css`
                        display:flex;
                        align-items:center;
                    `}
                >
                    {usuario
                        ?
                        (<>
                            <div>
                                <Button 
                                    aria-describedby={open ? 'simple-popover' : undefined} 
                                    color="primary" 
                                    onClick={handleClickPop}
                                >
                                    Mi Perfil
                                </Button>
                                <Popover
                                    id={open ? 'simple-popover' : undefined}
                                    open={open}
                                    anchorEl={anchorEl}
                                    onClose={handleClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'center',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'center',
                                    }}
                                >
                                    <Card>
                                        <CardActionArea>
                                            <CardContent >
                                            <Typography  gutterBottom variant="h5" component="h2">
                                                Hola : <span>{usuario.displayName}</span>
                                            </Typography>
                                            <Typography variant="body2" color="textSecondary" component="p">
                                            </Typography>
                                            </CardContent>
                                        </CardActionArea>
                                        <CardActions>
                                            <Button href="/perfil" size="small" color="primary">
                                            Mi Perfil
                                            </Button>
                                        </CardActions>
                                    </Card>
                                </Popover>
                            </div>

                            <Boton 
                                bgColor='true' 
                                type="button"
                                onClick={handleClick}
                            >Cerrar Sesion</Boton>
                        </>)
                        :
                        (<>
                            <Link href="/login">
                                <Boton bgColor='true'>
                                    Login
                                </Boton>
                            </Link>
                            <Link href="/crear-cuenta">
                                <Boton>
                                    Crear
                                </Boton>
                            </Link>
                        </>)
                    }

                </div>
            </ContenedorHeader>
            :<ContenedorMobile><MenuMobile/>
            <Buscar/></ContenedorMobile>}
        </header>
    );
}

export default Header;