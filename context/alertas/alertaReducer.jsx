import {
    MOSTRAR_ALERTA
} from '../../types';

export default (state, action) => {
    switch(action.type){
        case MOSTRAR_ALERTA:
            return{
                alerta : action.payload
            }
        default:
            return state;
    }
}