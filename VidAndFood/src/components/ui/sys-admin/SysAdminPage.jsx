import { useContext, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";

import CustomNavbar from "../nav-bar/CustomNavbar.jsx";
import AuthContext from "../../../services/context/authContext/AuthContext.jsx";
import AdminTable from "../../admin/AdminTable.jsx";
import {
  deleteUserAdmin,
  fecthAllUsers,
} from "../../../services/adminUserServices.js";
import ResponseContext from "../../../services/context/responseContext/ResponseContext.jsx";
import UserAdminModal from "../../admin/UserAdminModal.jsx";
import ConfirmModal from "../../admin/ConfirmModal.jsx";
import WineContext from "../../../services/context/winesContext/WinesContext.jsx";

import "./sysAdminPage.css";
import WineAdminModal from "../../admin/WineAdminModal.jsx";
import {
  deleteReviewAdmin,
  fetchDeleteWineAdmin,
} from "../../../services/wineService.js";

const SysAdminPage = () => {
  const { token } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);
  const { wines, isLoadingWines, winesError, reloadWines, loadWines } =
    useContext(WineContext);

  const [showUserModal, setShowUserModal] = useState(false);
  const [userModalMode, setUserModalMode] = useState("create");
  const [activeTab, setActiveTab] = useState("users");

  const [showWineModal, setShowWineModal] = useState(false);
  const [wineModalMode, setWineModalMode] = useState("create");
  const [wineTarget, setWineTarget] = useState(null);

  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmBody, setConfirmBody] = useState("");
  const [confirmAction, setConfirmAction] = useState(async () => { });

  const [userTarget, setUserTarget] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedWine, setSelectedWine] = useState(null);
  const [selectedRating, setSelectedRating] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(false);
  const ratingsData = useMemo(() => {
    return wines.flatMap((w) =>
      w.reviews.map((r) => ({
        id: r.id,
        reviewId: r.id,
        wineId: w.id,
        wineName: w.name,
        userName: r.userName,
        score: r.score,
        review: r.review,
        isActive: r.isActive,
        isSommelierReview: r.isSommelierReview,
        createdAt: r.createdAt,
      })),
    );
  }, [wines]);

  const [errorUsers, setErrorUsers] = useState(null);

  const selectedIsAdmin =
    String(selectedUser?.role ?? "").toLowerCase() === "admin";

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

    loadUsers();
  }, [token]);

  useEffect(() => {
    if (!token) return;
    if (activeTab !== "wines") return;

    loadWines();
  }, [token, activeTab, loadWines]);

  useEffect(() => {
    setSelectedUser(null);
    setSelectedWine(null);
    setSelectedRating(null);
  }, [activeTab]);

  const openUserModal = (mode) => {
    setUserModalMode(mode);
    setUserTarget(selectedUser);
    setShowUserModal(true);
  };

  const openWineModal = (mode) => {
    setWineModalMode(mode);
    setWineTarget(mode === "edit" ? selectedWine : null);
    setShowWineModal(true);
  };

  const reloadUsers = async () => {
    const data = await fecthAllUsers();
    setUsers(data);
    setSelectedUser(null);
  };

  const openUserDeleteConfirm = () => {
    if (!selectedUser) return;
    setConfirmTitle("Eliminar usuario");
    setConfirmBody(
      `¿Estás seguro de que deseas eliminar a ${selectedUser.fullName} (${selectedUser.email})?`,
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
          title: "No se pudo eliminar el usuario",
          variant: "error",
          message: `${e.message}`,
        });
      } finally {
        setConfirmLoading(false);
      }
    });
    setShowConfirm(true);
  };

  const openWineDeleteConfirm = () => {
    if (!selectedWine) return;

    setConfirmTitle("Eliminar vino");
    setConfirmBody(
      `¿Estás seguro de que deseas eliminar el vino ${selectedWine.name}?`,
    );

    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);

        await fetchDeleteWineAdmin(selectedWine.id);

        showResponse({
          title: "Vino eliminado",
          variant: "success",
          message: `El vino ${selectedWine.name} ha sido eliminado correctamente.`,
        });

        reloadWines();
        setShowConfirm(false);
      } catch (e) {
        showResponse({
          title: "No se pudo eliminar el vino",
          variant: "error",
          message: `${e.message}`,
        });
      } finally {
        setConfirmLoading(false);
      }
    });
    setShowConfirm(true);
  };

  const openReviewDeleteConfirm = () => {
    if (!selectedRating) return;

    setConfirmTitle("Eliminar reseña");
    setConfirmBody(
      `¿Estás seguro de que deseas eliminar la reseña del vino ${selectedRating.wineName}?`,
    );

    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);

        await deleteReviewAdmin(selectedRating.id);

        showResponse({
          title: "Reseña eliminada",
          variant: "success",
          message: `La reseña del vino ${selectedRating.wineName} ha sido eliminada correctamente.`,
        });

        await reloadWines();
        setSelectedRating(null);
        setShowConfirm(false);
      } catch (e) {
        showResponse({
          title: "No se pudo eliminar la reseña",
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
    {
      header: "Nombre y apellido",
      accessor: (u) => u.fullName || "-",
      className: "admin-col-wide",
      style: { width: "38%" },
    },
    {
      header: "Correo electrónico",
      accessor: (u) => u.email || "-",
      className: "admin-col-wide",
      style: { widht: "44%" },
    },
    { header: "Rol", accessor: (u) => u.role || "-", style: { width: "18%" } },
  ];

  const winesColums = [
    {
      header: "Nombre",
      accessor: (w) => w.name || "-",
      className: "admin-col-wide",
      style: { width: "30%" },
    },
    {
      header: "Bodega",
      accessor: (w) => w.wineryName || "-",
      className: "admin-col-wide",
      style: { width: "20%" },
    },
    {
      header: "Precio",
      accessor: (w) => w.price ?? "-",
      style: { width: "12%" },
    },
    {
      header: "Año de cosecha",
      accessor: (w) => w.vintageYear ?? "-",
      style: { width: "12%" },
    },
    {
      header: "Puntuación media",
      accessor: (w) =>
        w.averageScore != null ? w.averageScore.toFixed(1) : "-",
      style: { width: "12%" },
    },
    {
      header: "Uvas",
      accessor: (w) => {
        if (Array.isArray(w.grapes) && w.grapes.length > 0) {
          return w.grapes.map(g => g.name).join(", ");
        }
        return w.grapeNames || "-";
      },
      className: "admin-col-wide",
      style: { width: "20%" },
    },
    {
      header: "Activo",
      accessor: (w) => (w.isActive === true ? "Sí" : w.isActive === false ? "No" : "-"),
      style: { width: "10%" }
    }
  ];

  const ratingsColums = [
    {
      header: "Vino",
      accessor: (r) => r.wineName || "-",
      className: "admin-col-wide",
      style: { width: "36%" },
    },
    {
      header: "Usuario",
      accessor: (r) => r.userName || "-",
      style: { width: "18%" },
    },
    {
      header: "Puntuación",
      accessor: (r) => r.score ?? "-",
      style: { width: "10%" },
    },
    {
      header: "Comentario",
      accessor: (r) => r.review || "-",
      className: "admin-col-wide",
      style: { width: "35%" },
    },
    {
      header: "Activo",
      accessor: (r) => (r.isActive === true ? "Sí" : r.isActive === false ? "No" : "-"),
      style: { width: "10%" }
    }
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
              Gestión de usuarios, vinos y valoraciones en el sistema Vid&Food.
            </p>
          </header>

          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Usuarios
            </button>

            <button
              type="button"
              className={`admin-tab ${activeTab === "wines" ? "active" : ""}`}
              onClick={() => setActiveTab("wines")}
            >
              Vinos
            </button>

            <button
              type="button"
              className={`admin-tab ${activeTab === "ratings" ? "active" : ""}`}
              onClick={() => setActiveTab("ratings")}
            >
              Valoraciones
            </button>
          </div>

          {activeTab === "users" && (
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
                        message: "Los usuarios Admin no pueden ser modificados ni eliminados.",
                      });
                    }
                  }}
                  headerActions={
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="admin-action-btn btn-wine-primary"
                        onClick={() => openUserModal("create")}
                      >
                        + Añadir
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
                        Eliminar
                      </Button>
                    </>
                  }
                />
              </Col>
            </Row>
          )}

          {activeTab === "wines" && (
            <Row>
              <Col lg={12} className="mb-3">
                <AdminTable
                  title="Vinos"
                  columns={winesColums}
                  data={wines}
                  loading={isLoadingWines}
                  error={winesError}
                  pageSize={10}
                  rowKey={(w) => w.id}
                  selectedId={selectedWine?.id ?? null}
                  onRowSelect={(w) => setSelectedWine(w)}
                  headerActions={
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openWineModal("create")}
                      >
                        Añadir
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!selectedWine}
                        onClick={() => openWineModal("edit")}
                      >
                        Editar
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        disabled={!selectedWine}
                        onClick={() => openWineDeleteConfirm()}
                      >
                        Eliminar
                      </Button>
                    </>
                  }
                />
              </Col>
            </Row>
          )}

          {activeTab === "ratings" && (
            <Row>
              <Col lg={12} className="mb-3">
                <AdminTable
                  title="Valoraciones"
                  columns={ratingsColums}
                  data={ratingsData}
                  loading={isLoadingWines}
                  error={winesError}
                  pageSize={10}
                  rowKey={(r) => r.id}
                  selectedId={selectedRating?.id ?? null}
                  onRowSelect={(r) => setSelectedRating(r)}
                  headerActions={
                    <>
                      <Button
                        variant="danger"
                        size="sm"
                        disabled={!selectedRating}
                        onClick={() => openReviewDeleteConfirm()}
                      >
                        Eliminar
                      </Button>
                    </>
                  }
                />
              </Col>
            </Row>
          )}
        </Container>

        <UserAdminModal
          show={showUserModal}
          mode={userModalMode}
          user={userTarget}
          onClose={() => setShowUserModal(false)}
          onSuccess={reloadUsers}
        />

        <WineAdminModal
          show={showWineModal}
          mode={wineModalMode}
          wine={wineTarget}
          onClose={() => setShowWineModal(false)}
          onSuccess={reloadWines}
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
