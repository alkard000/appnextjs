import React from 'react';
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

import GridList from '@material-ui/core/GridList';


const Home = (props) => {

  const {productos} = useProductos('creado');


  return (  
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <GridList cellHeight={180} style={{display : 'flex', width : '100%', justifyContent : 'center'}}>
              {productos.map(producto => (
                <DetallesProducto
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </GridList>
          </div>
        </div>
      </Layout>
    </div>
  );
}
 
export default Home;