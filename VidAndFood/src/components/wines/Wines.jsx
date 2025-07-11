import React from 'react'
import CardHome from '../cardHome/CardHome'
import { Col, Container, Row } from 'react-bootstrap'


const Wines = ({ wines }) => {
  return (
    <Container>
      <Row className='g-5'>
        {wines.map(wine => (
          <CardHome
            key={wine.id}
            id={wine.id}
            img={wine.img}
            nombre={wine.nombre}
            anio_cosecha={wine.anio_cosecha}
            bodega={wine.bodega}
            rating={wine.rating}
          />
        ))}
      </Row>
    </Container>
  )
}

export default Wines