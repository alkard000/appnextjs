export default  function validarCrearProducto(valores){
    let errores = {};

    //VALIDAR NOMBRE
    if(!valores.nombre){
        errores.nombre = 'El nombre es Obligatorio';
    };

    //VALIDAR EMPRESA
    if(!valores.empresa){
        errores.empresa = 'El nombre de la empresa es Obligatorio';
    };

    //VALIDAR LA URL
    if(!valores.url){
        errores.url = 'La url es obligtoria';
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url = 'URL no valida'
    };

    //VALIDAR DESCRIPCION
    if(!valores.descripcion){
        errores.descripcion = 'Describe tu producto'
    }

    return errores;
}