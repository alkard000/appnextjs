export default  function validarCrearCuenta(valores){
    let errores = {};

    //VALIDAR NOMBRE
    if(!valores.nombre){
        errores.nombre = 'El nombre es Obligatorio'
    }
    //VALIDAR EMAIL
    if(!valores.email){
        errores.email = 'El email es Obligatorio'
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)){
        errores.email = 'Email no valido'
    }
    //VALIDAR PASSWORD
    if(!valores.password){
        errores.password = 'El password es Obligatorio'
    }else if(valores.password.length <= 6){
        errores.password = 'El password debe tener al menos 6 caracteres'
    }else if(valores.password !== valores.repetirPassword){
        errores.repetirPassword = 'Las Contraseñas con coinciden'
    }

    //REPETIR PASSWORD{
    if(!valores.repetirPassword){
        errores.repetirPassword = 'Ingresa de nuevo la Contraseña'
    }


    return errores;
}