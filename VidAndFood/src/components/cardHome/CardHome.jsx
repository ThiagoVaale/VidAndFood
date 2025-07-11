import { Card, Col } from 'react-bootstrap'
import { Star, StarFill } from "react-bootstrap-icons";

import './cardHome.css'


const CardHome = ({
  id,
  img,
  nombre,
  anio_cosecha,
  bodega,
  rating
}) => {

  const filledStars = Array.from({ length: Math.min(rating, 5) }, (_, i) =>
    (<StarFill key={`filled-${i}`} color="#a52a2a" />));

  const emptyStars = Array.from({ length: 5 - Math.min(rating, 5) }, (_, i) =>
    (<Star key={`empty-${i}`} color="#a52a2a" />));

  return (
    <Col lg={3} md={3} sm={3} xs={12}>
      <Card className='h-100 d-flex flex-column w-100'>
        <Card.Img
          className='card-img'
          src={img}
          variant='top'
        />
        <Card.Body className='d-flex flex-column justify-content-between'>
          <Card.Title className='fs-8'>{nombre}</Card.Title>
          <Card.Subtitle className='text-muted'>{bodega}, {anio_cosecha}</Card.Subtitle>
          <div className='rating-stars'>
            {filledStars}
            {emptyStars}
          </div>
        </Card.Body>
      </Card>
    </Col>
  )
}

export default CardHome