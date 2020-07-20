import React, { useContext } from 'react';
import Link from 'next/link';
import Router from 'next/router';
//MATERIAL UI
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';

import HomeIcon from '@material-ui/icons/Home';
import StarIcon from '@material-ui/icons/Star';
import AddBoxIcon from '@material-ui/icons/AddBox';
import PersonIcon from '@material-ui/icons/Person';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import MenuIcon from '@material-ui/icons/Menu';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import LockOpenIcon from '@material-ui/icons/LockOpen';

//API CONTEXT
import { FirebaseContext } from '../../firebase';

const useStyles = makeStyles({
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
});

const TemporaryDrawer = () => {
    const classes = useStyles();

    const { usuario, firebase } = useContext(FirebaseContext);

    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const handleClick = () => {
        firebase.cerrarSesion();
        Router.push('/login');
    }

    const ListMenu = ({anchor}) => (
        <div
            className={clsx(classes.list, {
                [classes.fullList]: anchor === 'top' || anchor === 'bottom',
            })}
            role="presentation"
            onClick={toggleDrawer(anchor, false)}
            onKeyDown={toggleDrawer(anchor, false)}
        >
            <ListItem>
                <ListItem button key="Avatar">
                    <ListItemAvatar>
                        {usuario ? 
                        <Avatar>
                            {usuario.displayName.charAt(0)}
                        </Avatar>:
                        <Avatar>
                            I
                        </Avatar>}
                    </ListItemAvatar>
                    {usuario ? 
                        <ListItemText>Bienvenido {usuario.displayName}</ListItemText> 
                    : 
                        <ListItemText>Usuario Invitado</ListItemText>
                    }
                </ListItem> 
            </ListItem>
            <Divider />
            <List>
                <ListItem button key="Inicio">
                    <ListItemIcon><HomeIcon /></ListItemIcon>
                    <ListItemText><Link href="/">Inicio</Link></ListItemText>
                </ListItem>
                <ListItem button key="Populares">
                    <ListItemIcon><StarIcon /></ListItemIcon>
                    <ListItemText><Link href="/populares">Populares</Link></ListItemText>
                </ListItem>
                <ListItem button key="Crear Producto">
                    <ListItemIcon><AddBoxIcon /></ListItemIcon>
                    <ListItemText><Link href="/nuevo-producto">Crear producto</Link></ListItemText>
                </ListItem>
            </List>
            <Divider />
            {usuario ? 
            <List>
                <ListItem button key="Perfil">
                    <ListItemIcon><PersonIcon /></ListItemIcon>
                    <ListItemText><Link href="/perfil">Perfil</Link></ListItemText>
                </ListItem>
                <ListItem button key="Cerrar Sesion">
                    <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                    <ListItemText><Button onClick={handleClick}>Cerrar Sesion</Button></ListItemText>
                </ListItem>
            </List>
            :
            <List>
                <ListItem button key="Crear Cuenta">
                    <ListItemIcon><PersonAddIcon /></ListItemIcon>
                    <ListItemText><Link href="/crear-cuenta">Crear una Cuenta</Link></ListItemText>
                </ListItem>
                <ListItem button key="Iniciar Sesion">
                    <ListItemIcon><LockOpenIcon /></ListItemIcon>
                    <ListItemText><Button href="/login">Iniciar Sesion</Button></ListItemText>
                </ListItem>
            </List>
            }
        </div>
    );

    return (
        <div>
            <React.Fragment key="left">
                <Button onClick={toggleDrawer("left", true)}><MenuIcon /></Button>
                <Drawer anchor="left" open={state["left"]} onClose={toggleDrawer("left", false)}>
                    <ListMenu anchor="left" />
                </Drawer>
            </React.Fragment>
        </div>
    );
}

export default TemporaryDrawer;
