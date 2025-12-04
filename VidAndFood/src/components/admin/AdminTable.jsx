import { useState } from "react";
import { Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import GlobalLoaderOverlay from "../ui/spinner/GlobalLoaderOverlay";
import "./adminTable.css";


const AdminTable = ({ title, columns, data, loading, error, pageSize = 10 }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = data.slice(startIndex, endIndex);

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Body>
        <Card.Title
          className="mb-3"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {title}
        </Card.Title>

        {loading && (
          <div className="d-flex justify-content-center my-3">
            <GlobalLoaderOverlay/>
          </div>
        )}

        {error && (
          <Alert variant="danger" className="my-2">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <Table responsive hover size="sm" className="mb-2">
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx}>{col.header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-3">
                      No hay registros para mostrar.
                    </td>
                  </tr>
                ) : (
                  pageData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col, colIndex) => (
                        <td key={colIndex}>{col.accessor(row)}</td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </Table>

            {totalItems > 0 && (
              <div className="d-flex justify-content-between align-items-center">
                <small>
                  Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de{" "}
                  {totalItems} registros
                </small>
                <div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2 admin-btn"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                  >
                    Anterior
                  </Button>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                    className="admin-btn"
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default AdminTable;
