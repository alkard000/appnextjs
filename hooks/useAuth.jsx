import React, {useEffect, useState} from 'react';
import firebase from '../firebase';

const useAuth = () => {
    
    const [usuarioAuth, setUsuarioAuth] = useState(null);

    useEffect(() => {
        const unsuscribe = firebase.auth.onAuthStateChanged(usuario => {
            if(usuario){
                setUsuarioAuth(usuario);
            }else{
                setUsuarioAuth(null);
            }
        });

        return () => unsuscribe();
    }, []);

    return usuarioAuth;
}
 
export default useAuth;