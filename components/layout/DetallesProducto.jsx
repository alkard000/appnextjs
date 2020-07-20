import React, {useState, useEffect} from 'react';
import Link from 'next/link';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { es } from 'date-fns/locale';

//MATERIAL UI
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Skeleton from '@material-ui/lab/Skeleton';
import GridListTile from '@material-ui/core/GridListTile';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Box from '@material-ui/core/Box';


//MATERIAL UI ICONS
import SmsIcon from '@material-ui/icons/Sms';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import VisibilityIcon from '@material-ui/icons/Visibility';
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import useQueries from '../../hooks/useQueries';


const useStyles = makeStyles((theme) => ({
    card: {
        maxWidth: 345,
        margin: theme.spacing(2),
    },
    media: {
        height: 190,
    }
}));

const DetallesProducto = ({ producto }) => {

    //HOOK PARA CONTROLAR EL DISEÑO RESPONSIVO
    const { mediaQuery } = useQueries('100%', '50%', '33.3%');

    const classes = useStyles();
    
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setTimeout(function(){
            setLoading(false)
        }, 3000);
        
    }, [])

    return (
        <>
        <GridListTile key="Subheader" cols={3} style={{width : `${mediaQuery}`}}>
                {!loading ? 
                    <Card className={classes.card}>
                        <NoLoading producto={producto} classes={classes}/>
                    </Card> 
                : 
                    <Card className={classes.card}>
                        <Loading/>
                    </Card> 
                }
            </GridListTile>

        </>
    );
}

const Loading = () => {
    return (
        <>
            <CardHeader
                avatar={<Skeleton animation="wave" variant="circle" width={40} height={40} />}
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={<Skeleton animation="wave" height={10} width="80%" style={{ marginBottom: 6 }} />}
                subheader={<Skeleton animation="wave" height={10} width="40%" />}
            />
            <Skeleton animation="wave" variant="rect" height={120}/>
            <CardContent>
                <Skeleton animation="wave" height={10} style={{ marginBottom: 6 }} />
                <Skeleton animation="wave" height={10} width="80%" />
            </CardContent>
        </>

    )
}

const NoLoading = ({producto, classes}) => {

    const { id, comentarios, creado, descripcion, empresa, nombre, url, urlImagen, votos } = producto;

    return (
        <>
            <CardHeader
                avatar={<Avatar
                    alt={nombre}
                    src={urlImagen}
                />}
                action={
                    <IconButton aria-label="settings">
                        <MoreVertIcon />
                    </IconButton>
                }
                title={nombre}
                subheader={<p>Publicado hace {formatDistanceToNow(new Date(creado), { locale: es })}</p>}
            />
            <CardMedia
                className={classes.media}
                image={urlImagen}
                title={nombre}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {descripcion}
                </Typography>
            </CardContent>
            <ButtonGroup style={{display : 'flex', justifyContent:'center', backgroundColor:'#f1f1f1', height:'50px'}} variant="text" color="primary" aria-label="outlined primary button group">
                <Button style={{border:'none'}}>
                    <SmsIcon style={{ color: '#da552f' }}/> 
                        <p style={{marginRight:'2rem' ,marginLeft:'1rem' , fontSize:"1.5rem", color: '#da552f'}}>{
                            comentarios.length}
                        </p>
                </Button>
                <Button style={{border:'none'}}>
                    <ThumbUpIcon style={{ color: '#da552f' }}/>
                        <p style={{marginRight:'2rem' ,marginLeft:'1rem' , fontSize:"1.5rem", color: '#da552f'}}>
                            {votos}
                        </p> 
                </Button>
                <Button >
                    <Link href="/producto/[id]" as={`/producto/${id}`}>
                        <VisibilityIcon style={{ color: '#da552f' }}/>
                    </Link>
                </Button>
            </ButtonGroup>
        </>
    )
}

export default DetallesProducto;