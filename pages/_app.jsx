import App from 'next/app';
import firebase, {FirebaseContext} from '../firebase';
import useAuth from '../hooks/useAuth';
import AlertaState from '../context/alertas/AlertaState';



const MyApp = ({Component, pageProps}) => {

    const usuario = useAuth();


    return(
        <AlertaState>
            <FirebaseContext.Provider
                value={{
                    firebase,
                    usuario
                }}
            >
                <Component {...pageProps} />
            </FirebaseContext.Provider>
        </AlertaState>

    )
}

export default MyApp;