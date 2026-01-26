import { useEffect, useMemo, useState } from "react";
import { Card, Table, Spinner, Alert, Button } from "react-bootstrap";
import GlobalLoaderOverlay from "../ui/spinner/GlobalLoaderOverlay";
import "./adminTable.css";


const AdminTable = (
  { 
    title, 
    columns, 
    data, 
    loading, 
    error, 
    pageSize = 10,

    rowKey = (row) => row.id,
    selectedId = null,
    onRowSelect = null,
    headerActions = null
  }
) => {
  const [currentPage, setCurrentPage] = useState(1);

  const safeData = Array.isArray(data) ? data : [];

  const totalItems = safeData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageData = useMemo(() => safeData.slice(startIndex, endIndex), [safeData, startIndex, endIndex]);

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  useEffect(() => {
    if(currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const isSelectable = typeof onRowSelect === "function";

  return (
    <Card className="mb-4 shadow-sm border-0">
      <Card.Body>
        <div className="d-flex align-items-center justify-content-between mb-3">
          <Card.Title className="m-0" style={{ fontFamily: "Playfair Display, serif" }}>
            {title}
          </Card.Title>

          {headerActions ? <div className="d-flex gap-2">{headerActions}</div> : null}
        </div>

        {loading && (
          <div className="d-flex justify-content-center my-3">
            <GlobalLoaderOverlay />
          </div>
        )}

        {error && <Alert variant="danger" className="my-2">{error}</Alert>}

        {!loading && !error && (
          <>
            <Table responsive hover size="sm" className="mb-2">
              <thead>
                <tr>
                  {columns.map((col, idx) => <th key={idx}>{col.header}</th>)}
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
                  pageData.map((row, rowIndex) => {
                    const id = rowKey(row);
                    const isSelected = selectedId != null && String(selectedId) === String(id);

                    return (
                      <tr
                        key={id ?? rowIndex}
                        onClick={isSelectable ? () => onRowSelect(row) : undefined}
                        style={{
                          cursor: isSelectable ? "pointer" : "default",
                          backgroundColor: isSelected ? "#eef5ff" : "transparent",
                        }}
                      >
                        {columns.map((col, colIndex) => (
                          <td key={colIndex}>{col.accessor(row)}</td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>

            {totalItems > 0 && (
              <div className="d-flex justify-content-between align-items-center">
                <small>
                  Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems} registros
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
