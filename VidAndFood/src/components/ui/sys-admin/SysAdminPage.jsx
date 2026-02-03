import { useContext, useEffect, useState } from "react";
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
import { deleteReview, fetchDeleteWineAdmin } from "../../../services/wineService.js";

const SysAdminPage = () => {
  const { token } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);
  const { wines, isLoadingWines, winesError, reloadWines, loadWines } = useContext(WineContext);

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
  const [confirmAction, setConfirmAction] = useState(async () => {});

  const [userTarget, setUserTarget] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedWine, setSelectedWine] = useState(null);

  const [loadingUsers, setLoadingUsers] = useState(false);

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
  }

  const reloadUsers = async () => {
    const data = await fecthAllUsers();
    setUsers(data);
    setSelectedUser(null);
  };

  const openUserDeleteConfirm = () => {
    if (!selectedUser) return;
    setConfirmTitle("Delete user");
    setConfirmBody(
      `¿Are you sure you want to delete ${selectedUser.fullName} (${selectedUser.email})?`,
    );
    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);
        await deleteUserAdmin(selectedUser.id);
        showResponse({
          title: "User deleted",
          variant: "success",
          message: `The user ${selectedUser.fullName} It has been deleted successfully.`,
        });
        await reloadUsers();
        setShowConfirm(false);
      } catch (e) {
        showResponse({
          title: "The user could not be deleted",
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
    setConfirmTitle("Remove wine");
    setConfirmBody(
      `¿Are you sure you want to delete the wine? ${selectedWine.name}?`,
    );
    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);
        await fetchDeleteWineAdmin(selectedWine.id);
        showResponse({
          title: "Wine removed",
          variant: "success",
          message: `The wine ${selectedWine.name} has been successfully deleted.`,
        });
        await loadWines();
        setShowConfirm(false);
      } catch (e) {
        showResponse({
          title: "The wine could not be removed",
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
    if (!selectedWine) return;
    setConfirmTitle("Remove review");
    setConfirmBody(
      `¿Are you sure you want to delete this wine review? ${selectedWine.name}?`,
    );
    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);
        await deleteReview(selectedWine.id);
        showResponse({
          title: "Review removed",
          variant: "success",
          message: `The review for wine ${selectedWine.name} has been successfully deleted.`,
        });
        await loadWines();
        setShowConfirm(false);
      } catch (e) {
        showResponse({
          title: "The review could not be removed",
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
    { header: "First and Last Name", accessor: (u) => u.fullName || "-" },
    { header: "Email", accessor: (u) => u.email || "-" },
    { header: "Rol", accessor: (u) => u.role || "-" },
  ];

  const winesColums = [
    { header: "Name", accessor: (w) => w.name },
    { header: "Winery", accessor: (w) => w.wineryName },
    { header: "Price", accessor: (w) => w.price },
    { header: "Harvest year", accessor: (w) => w.vintageYear },
    {
      header: "Average score",
      accessor: (w) => w.averageScore.toFixed(1),
    },
    { header: "Uvas", accessor: (w) => w.grapeNames },
  ];

  const ratingsColums = [
    { header: "WineName", accessor: (w) => w.name },
    { header: "UserName", accessor: (w) => w.reviews.userName },
    { header: "Score", accessor: (w) => w.reviews.score },
    { header: "Review", accessor: (w) => w.reviews.review }
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
              Management of users, wines, and ratings in the Vid&Food system.
            </p>
          </header>

          <div className="admin-tabs">
            <button
              type="button"
              className={`admin-tab ${activeTab === "users" ? "active" : ""}`}
              onClick={() => setActiveTab("users")}
            >
              Users
            </button>

            <button
              type="button"
              className={`admin-tab ${activeTab === "wines" ? "active" : ""}`}
              onClick={() => setActiveTab("wines")}
            >
              Wines
            </button>

            <button
              type="button"
              className={`admin-tab ${activeTab === "ratings" ? "active" : ""}`}
              onClick={() => setActiveTab("ratings")}
            >
              Ratings
            </button>
          </div>

          {activeTab === "users" && (
            <Row>
              <Col lg={12} className="mb-3">
                <AdminTable
                  title="Users"
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
                        title: "Protected user",
                        variant: "info",
                        message:
                          "Admin users cannot be modified or deleted.",
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
                        + Add
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!selectedUser || selectedIsAdmin}
                        onClick={() => openUserModal("role")}
                      >
                        Change role
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        disabled={!selectedUser || selectedIsAdmin}
                        onClick={() => openUserDeleteConfirm()}
                      >
                        Delete
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
                  title="Wines"
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
                      <Button variant="success" size="sm" onClick={() => openWineModal("create")}>
                        Add
                      </Button> 

                      <Button variant="primary" size="sm" disabled={!selectedWine} onClick={() => openWineModal("edit")}>
                        Edit
                      </Button>

                      <Button variant="danger" size="sm" disabled={!selectedWine} onClick={() => openWineDeleteConfirm()}>
                        Delete
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
                  title="Ratings"
                  columns={ratingsColums}
                  data={wines}
                  loading={isLoadingWines}
                  error={winesError}
                  pageSize={10}
                  rowKey={(w) => w.id}
                  selectedId={selectedWine?.id ?? null} 
                  onRowSelect={(w) => setSelectedWine(w)}
                  headerActions={
                    <>
                      <Button variant="danger" size="sm" disabled={!selectedWine} onClick={() => openReviewDeleteConfirm()}>
                        Delete
                      </Button>
                    </>
                  }
                />
              </Col>
            </Row>
          )}

          {activeTab === "ratings" && (
            <div
              className="text-center text-muted"
              style={{ padding: "40px 0" }}
            >
              <h5 style={{ marginBottom: 8 }}>Ratings</h5>
              <p>Sección en construcción (ABM de ratings pendiente).</p>
            </div>
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
