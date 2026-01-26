import { useContext, useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import CustomNavbar from "../nav-bar/CustomNavbar.jsx";
import AuthContext from "../../../services/context/authContext/AuthContext.jsx";
import AdminTable from "../../admin/AdminTable.jsx";
import {
  deleteGrapeAdmin,
  deleteUserAdmin,
  fecthAllUsers,
} from "../../../services/adminUserServices.js";
import { fetchAllWineries } from "../../../services/wineyServices.js";
import { fetchAllGrapes } from "../../../services/grapeServices.js";
import ResponseContext from "../../../services/context/responseContext/ResponseContext.jsx";
import UserAdminModal from "../../admin/UserAdminModal.jsx";
import GrapeAdminModal from "../../admin/GrapeAdminModal.jsx";
import ConfirmModal from "../../admin/ConfirmModal.jsx";

const SysAdminPage = () => {
  const { token } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);

  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState("create");

  const [showGrapeModal, setShowGrapeModal] = useState(false);
  const [grapeModalMode, setGrapeModalMode] = useState("create");

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmBody, setConfirmBody] = useState("");
  const [confirmAction, setConfirmAction] = useState(async () => {});

  const [userTarget, setUserTarget] = useState(null);
  const [users, setUsers] = useState([]);
  const [wineries, setWineries] = useState([]);
  const [grapes, setGrapes] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGrape, setSelectedGrape] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingWineries, setLoadingWineries] = useState(false);
  const [loadingGrapes, setLoadingGrapes] = useState(false);

  const [errorUsers, setErrorUsers] = useState(null);
  const [errorWineries, setErrorWineries] = useState(null);
  const [errorGrapes, setErrorGrapes] = useState(null);

  const selectedIsAdmin = String(selectedUser?.role ?? "").toLowerCase() === "admin";

  useEffect(() => {
    if (!token) return;

    const loadUsers = async () => {
      try {
        setLoadingUsers(true);
        setErrorUsers(null);
        const data = await fecthAllUsers();

        setUsers(data);
      } catch (error) {
        console.error(error);
        setErrorUsers(error.message || "No se pudieron cargar los usuarios.");
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
        setErrorWineries(error.message || "No se pudieron cargar las bodegas.");
      } finally {
        setLoadingWineries(false);
      }
    };

    const loadGrapes = async () => {
      try {
        setLoadingGrapes(true);
        setErrorGrapes(null);
        const data = await fetchAllGrapes();
        console.log("UVAS DEL BACK: ", data);
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

  const openUserModal = (mode) => {
    setUserModalMode(mode);
    setUserTarget(selectedUser);
    setShowUserModal(true);
  };
  
  const openGrapeModal = (mode) => {
    setGrapeModalMode(mode);
    setShowGrapeModal(true);
  };

  const reloadUsers = async () => {
    const data = await fecthAllUsers();
    setUsers(data);
    setSelectedUser(null);
  };

  const reloadGrapes = async () => {
    const data = await fetchAllGrapes();
    setGrapes(data);
    setSelectedGrape(null);
  };

  const openUserDeleteConfirm = () => {
    if (!selectedUser) return;
    setConfirmTitle("Eliminar usuario");
    setConfirmBody(
      `¿Seguro que querés eliminar a ${selectedUser.fullName} (${selectedUser.email})?`,
    );
    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);
        await deleteUserAdmin(selectedUser.id);
        showResponse({
          title: "Usuario eliminado",
          variant: "success",
          message: `El usuario ${selectedUser.fullName} ha sido eliminado correctamente.`,
        });
        await reloadUsers();
        setShowConfirm(false);
      } catch (e) {
        showResponse({
          title: "El usuario no pudo ser eliminado",
          variant: "error",
          message: `${e.message}`,
        });
      } finally {
        setConfirmLoading(false);
      }
    });
    setShowConfirm(true);
  };

  const openGrapeDeleteConfirm = () => {
    if (!selectedGrape) return;
    setConfirmTitle("Eliminar uva");
    setConfirmBody(`¿Seguro que querés eliminar "${selectedGrape.name}"?`);
    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);
        await deleteGrapeAdmin(selectedGrape.id);
        showResponse({
          title: "Uva eliminado",
          variant: "success",
          message: `La uva ${selectedGrape.name} ha sido eliminado correctamente.`,
        });
        await reloadGrapes();
        setShowConfirm(false);
      } catch (e) {
        showResponse({
          title: "La uva no pudo ser eliminada",
          variant: "error",
          message: `${e.message}`,
        });
      } finally {
        setConfirmLoading(false);
      }
    });
    setShowConfirm(true);
  };

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
                marginTop: "2rem",
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
                rowKey={(u) => u.id}
                selectedId={selectedUser?.id ?? null}
                onRowSelect={(u) => {
                  setSelectedUser(u);
                  if (String(u.role).toLowerCase() === "admin") {
                    showResponse({
                      title: "Usuario protegido",
                      variant: "info",
                      message:
                        "Los usuarios Admin no pueden modificarse ni eliminarse.",
                    });
                  }
                }}
                headerActions={
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => openUserModal("create")}
                    >
                      + Alta
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!selectedUser || selectedIsAdmin}
                      onClick={() => openUserModal("role")}
                    >
                      Cambiar rol
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      disabled={!selectedUser || selectedIsAdmin}
                      onClick={() => openUserDeleteConfirm()}
                    >
                      Baja
                    </Button>
                  </>
                }
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
                rowKey={(g) => g.id}
                selectedId={selectedGrape?.id ?? null}
                onRowSelect={(g) => setSelectedGrape(g)}
                headerActions={
                  <>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => openGrapeModal("create")}
                    >
                      + Alta
                    </Button>

                    <Button
                      variant="primary"
                      size="sm"
                      disabled={!selectedGrape}
                      onClick={() => openGrapeModal("edit")}
                    >
                      Editar
                    </Button>

                    <Button
                      variant="danger"
                      size="sm"
                      disabled={!selectedGrape}
                      onClick={() => openGrapeDeleteConfirm()}
                    >
                      Baja
                    </Button>
                  </>
                }
              />
            </Col>
          </Row>
        </Container>

        <UserAdminModal
          show={showUserModal}
          mode={userModalMode}
          user={userTarget}
          onClose={() => setShowUserModal(false)}
          onSuccess={reloadUsers}
        />

        <GrapeAdminModal
          show={showGrapeModal}
          mode={grapeModalMode}
          grape={selectedGrape}
          onClose={() => setShowGrapeModal(false)}
          onSuccess={reloadGrapes}
        />

        <ConfirmModal
          show={showConfirm}
          title={confirmTitle}
          body={confirmBody}
          confirmText="Eliminar"
          confirmVariant="danger"
          loading={confirmLoading}
          onClose={() => setShowConfirm(false)}
          onConfirm={confirmAction}
        />
      </div>
    </>
  );
};

export default SysAdminPage;
