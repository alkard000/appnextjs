import {useState, useEffect} from 'react';

const useValidacion = (stateInicial, validar, fn) => {

    const [valores, setValores] = useState(stateInicial);
    const [errores, setErrores] = useState({});
    const [submitForm, setSubmitForm] = useState(false);

    useEffect(() => {
        if(submitForm){
            const noErrores = Object.keys(errores).length === 0;

            if(noErrores){
                fn();//==> FUNCION QUE SE EJECUTA EN EL COMPONENTE
            }
            setSubmitForm(false);
        }
    }, [errores]);

    //FUNCIONQ UE SE EJECUTA CUANDO SE ECRIBE ALGO
    const handleChange = e => {
        setValores({
            ...valores,
            [e.target.name] : e.target.value
        })
    }  
    
    //FUNCION QUE SE EJECUTA CUANDO S EHACE SUBMIT
    const handleSubmit = e => {
        e.preventDefault();
        
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
        setSubmitForm(true);
    }

    //CUANDO EL UUSARIO SE SALE DEL INPUT
    const handleBlur = () => {
        const erroresValidacion = validar(valores);
        setErrores(erroresValidacion);
    }

    return{  
        valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange,
        handleBlur
    };
}
 
export default useValidacion;