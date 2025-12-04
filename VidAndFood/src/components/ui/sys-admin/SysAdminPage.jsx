import { useContext, useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";

import CustomNavbar from "../nav-bar/CustomNavbar.jsx";
import AuthContext from "../../../services/context/authContext/AuthContext.jsx";
import AdminTable from "../../admin/AdminTable.jsx";
import { fecthAllUsers } from "../../../services/adminUserServices.js";
import { fetchAllWineries } from "../../../services/wineyServices.js";
import { fetchAllGrapes } from "../../../services/grapeServices.js";

const SysAdminPage = () => {
  const { token } = useContext(AuthContext);

  const [users, setUsers] = useState([]);
  const [wineries, setWineries] = useState([]);
  const [grapes, setGrapes] = useState([]);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingWineries, setLoadingWineries] = useState(false);
  const [loadingGrapes, setLoadingGrapes] = useState(false);

  const [errorUsers, setErrorUsers] = useState(null);
  const [errorWineries, setErrorWineries] = useState(null);
  const [errorGrapes, setErrorGrapes] = useState(null);

  useEffect(() => {
    if (!token) return;

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setErrorUsers(null);
        const data = await fecthAllUsers();
    console.log("CARGAR LOS USERS: ", data)

        setUsers(data);
      } catch (error) {
        console.error(error);
        setErrorUsers(
          error.message || "No se pudieron cargar los usuarios."
        );
      } finally {
        setLoadingUsers(false);
      }
    }; 

    const loadWineries = async () => {
      try {
        setLoadingWineries(true);
        setErrorWineries(null);
        const data = await fetchAllWineries(); 
        const mapped = data.map((name, index) => ({
          id: index,
          name,
        }));
        setWineries(mapped);
      } catch (error) {
        console.error(error);
        setErrorWineries(
          error.message || "No se pudieron cargar las bodegas."
        );
      } finally {
        setLoadingWineries(false);
      }
    };

    const loadGrapes = async () => {
      try {
        setLoadingGrapes(true);
        setErrorGrapes(null);
        const data = await fetchAllGrapes(); 
        setGrapes(data);
      } catch (error) {
        console.error(error);
        setErrorGrapes(error.message || "No se pudieron cargar las uvas.");
      } finally {
        setLoadingGrapes(false);
      }
    };

    loadUsers();
    loadWineries();
    loadGrapes();
  }, [token]);

  const userColumns = [
    { header: "Nombre y Apellido", accessor: (u) => u.fullName || "-" },
    { header: "Email", accessor: (u) => u.email || "-" },
    { header: "Rol", accessor: (u) => u.role || "-" },
  ];

  const wineryColumns = [
    {
      header: "Bodegas disponibles",
      accessor: (w) => w.name,
    },
  ];

  const grapeColumns = [
    {
      header: "Uvas disponibles",
      accessor: (g) => g.name,
    },
  ];

  return (
    <>
      <CustomNavbar />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#fdf9f2ff",
          paddingTop: "80px",
          paddingBottom: "40px",
        }}
      >
        <Container>
          <header className="mb-4 text-center">
            <h1
              style={{
                fontFamily: "Playfair Display, serif",
                fontSize: "2.2rem",
                marginTop: "2rem"
              }}
            >
              SysAdmin – Panel de administración
            </h1>
            <p className="text-muted">
              Gestión de usuarios, bodegas y uvas del sistema Vid&Food.
            </p>
          </header>

          <Row>
            <Col lg={12} className="mb-3">
              <AdminTable
                title="Usuarios"
                columns={userColumns}
                data={users}
                loading={loadingUsers}
                error={errorUsers}
                pageSize={10}
              />
            </Col>
          </Row>

          <Row>
            <Col lg={6} className="mb-3">
              <AdminTable
                title="Bodegas"
                columns={wineryColumns}
                data={wineries}
                loading={loadingWineries}
                error={errorWineries}
                pageSize={10}
              />
            </Col>

            <Col lg={6} className="mb-3">
              <AdminTable
                title="Uvas"
                columns={grapeColumns}
                data={grapes}
                loading={loadingGrapes}
                error={errorGrapes}
                pageSize={10}
              />
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default SysAdminPage;
