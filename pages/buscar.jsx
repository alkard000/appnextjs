import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import { useRouter } from 'next/router';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Buscar = () => {

    const router = useRouter();
    const { query: { q } } = router;

    //TODOS LOS PRDUCTOS
    const { productos } = useProductos('creado');
    const [resultado, setResultado] = useState([]);

    useEffect(() => {
        const busqueda = q.toLowerCase();
        const filtro = productos.filter(producto => {
            return (
                producto.nombre.toLowerCase().includes(busqueda) ||
                producto.descripcion.toLowerCase().includes(busqueda)
            )
        })
        setResultado(filtro);
    }, [q, productos]);

    return (
        <div>
            <Layout>
                <div className="listado-productos">
                    <div className="contenedor">
                        <ul>
                            {resultado.map(producto => (
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

export default Buscar;