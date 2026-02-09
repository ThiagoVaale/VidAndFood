import { useEffect, useMemo, useState } from "react";
import { Card, Table, Alert, Button } from "react-bootstrap";
import GlobalLoaderOverlay from "../ui/spinner/GlobalLoaderOverlay";
import "./adminTable.css";

const AdminTable = ({
  title,
  columns,
  data,
  loading,
  error,
  pageSize = 10,
  rowKey = (row) => row.id,
  selectedId = null,
  onRowSelect = null,
  headerActions = null,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const safeData = Array.isArray(data) ? data : [];
  const totalItems = safeData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  
  const pageData = useMemo(
    () => safeData.slice(startIndex, endIndex),
    [safeData, startIndex, endIndex]
  );

  const handlePrev = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const isSelectable = typeof onRowSelect === "function";

  return (
    <Card className="admin-card mb-5"> 
      <Card.Body className="p-0"> 
        
        <div className="d-flex align-items-center justify-content-between p-4 pb-2">
          <h3 className="admin-title m-0">
            {title}
          </h3>
          {headerActions && (
            <div className="d-flex gap-2">
                {headerActions}
            </div>
          )}
        </div>

        {loading && (
          <div className="py-5 text-center">
            <GlobalLoaderOverlay />
          </div>
        )}

        {error && (
          <Alert variant="danger" className="m-4">
            {error}
          </Alert>
        )}

        {!loading && !error && (
          <>
            <Table responsive hover className="admin-table">
              <thead>
                <tr>
                  {columns.map((col, idx) => (
                    <th key={idx} className={col.className} style={col.style}>
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageData.length === 0 ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-5 text-muted">
                      No se encontraron registros.
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
                        className="admin-table-row"
                        data-selected={isSelected} 
                        style={{ cursor: isSelectable ? "pointer" : "default" }}
                      >
                        {columns.map((col, colIndex) => (
                          <td key={colIndex} className={col.className} style={col.style}>
                            {col.accessor(row)}
                          </td>
                        ))}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>

            {totalItems > 0 && (
              <div className="admin-pagination d-flex justify-content-between align-items-center">
                <span className="pagination-text">
                  Showing {startIndex + 1} - {Math.min(endIndex, totalItems)} de {totalItems}
                </span>
                
                <div>
                  <button
                    className="pagination-btn"
                    disabled={currentPage === 1}
                    onClick={handlePrev}
                  >
                    ← previous
                  </button>
                  <button
                    className="pagination-btn"
                    disabled={currentPage === totalPages}
                    onClick={handleNext}
                  >
                    Next →
                  </button>
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