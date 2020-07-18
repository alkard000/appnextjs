import React, {useState, useEffect, useContext} from 'react';
import Layout from '../components/layout/Layout';
import DetallesProducto from '../components/layout/DetallesProducto';
import {FirebaseContext} from '../firebase';

const Home = () => {

  const [productos, setProductos] = useState([]);

  const {firebase} = useContext(FirebaseContext);

  useEffect(() => {
    const obtenerProductos = () => {
      firebase.db.collection('producto').orderBy('creado', 'desc').onSnapshot(manejarSnapshot)
    }
    obtenerProductos();
  }, [])

  function manejarSnapshot(snapshot){
    const productos = snapshot.docs.map(doc => {
      return{
        id : doc.id,
        ...doc.data()
      }
    });

    setProductos(productos);
  }

  return (  
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul>
              {productos.map(producto => (
                <DetallesProducto
                  key={producto.id}
                  producto={producto}
                />
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </div>
  );
}
 
export default Home;