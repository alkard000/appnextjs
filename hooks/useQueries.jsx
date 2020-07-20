import {useState, useEffect} from 'react';
import useMediaQuery from '@material-ui/core/useMediaQuery';


const useQueries = (getMobile, getTablet, getComputer) => {

    const [mediaQuery, setmediaQuery] = useState('0');
    const mobile = useMediaQuery('(max-width:600px)');
    const tablet = useMediaQuery('(max-width:600px) and (max-width:992px)');
    const computer = useMediaQuery('(min-width:992px)');

    useEffect(() => {
        if(mobile){
            return setmediaQuery(getMobile);
        }
        if(tablet){
            return setmediaQuery(getTablet);
        }
        if(computer){
            return setmediaQuery(getComputer);
        }
    }, [mobile, tablet, computer]);

    return{  
        mediaQuery,
        mobile,
        tablet,
        computer,
        setmediaQuery
    };
}
 
export default useQueries;