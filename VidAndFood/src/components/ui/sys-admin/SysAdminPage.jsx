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

import "./SysAdminPage.css";
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
  const [confirmAction, setConfirmAction] = useState(async () => {});

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
      `¿Are you sure you want to delete the wine? ${selectedWine.name}`,
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
    if (!selectedRating) return;

    setConfirmTitle("Remove review");
    setConfirmBody(
      `¿Are you sure you want to delete this wine review? (${selectedRating.wineName})?`,
    );

    setConfirmAction(() => async () => {
      try {
        setConfirmLoading(true);

        await deleteReviewAdmin(selectedRating.id);

        showResponse({
          title: "Review removed",
          variant: "success",
          message: `The review for wine ${selectedRating.wineName} has been successfully deleted.`,
        });

        await reloadWines();
        setSelectedRating(null);
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
    {
      header: "First and Last Name",
      accessor: (u) => u.fullName || "-",
      className: "admin-col-wide",
      style: { width: "38%" },
    },
    {
      header: "Email",
      accessor: (u) => u.email || "-",
      className: "admin-col-wide",
      style: { widht: "44%" },
    },
    { header: "Rol", accessor: (u) => u.role || "-", style: { width: "18%" } },
  ];

  const winesColums = [
    {
      header: "Name",
      accessor: (w) => w.name || "-",
      className: "admin-col-wide",
      style: { width: "30%" },
    },
    {
      header: "Winery",
      accessor: (w) => w.wineryName || "-",
      className: "admin-col-wide",
      style: { width: "20%" },
    },
    {
      header: "Price",
      accessor: (w) => w.price ?? "-",
      style: { width: "12%" },
    },
    {
      header: "Harvest year",
      accessor: (w) => w.vintageYear ?? "-",
      style: { width: "12%" },
    },
    {
      header: "Average score",
      accessor: (w) =>
        w.averageScore != null ? w.averageScore.toFixed(1) : "-",
      style: { width: "12%" },
    },
   {
      header: "Grapes",
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
      header: "Active",
      accessor: (w) => (w.isActive === true ? "Yes" : w.isActive === false ? "No" : "-"),
      style: { width: "10%" }
    }
  ];

  const ratingsColums = [
    {
      header: "Wine",
      accessor: (r) => r.wineName || "-",
      className: "admin-col-wide",
      style: { width: "36%" },
    },
    {
      header: "User",
      accessor: (r) => r.userName || "-",
      style: { width: "18%" },
    },
    {
      header: "Score",
      accessor: (r) => r.score ?? "-",
      style: { width: "10%" },
    },
    {
      header: "Comment",
      accessor: (r) => r.review || "-",
      className: "admin-col-wide",
      style: { width: "35%" },
    },
    {
      header: "Active",
      accessor: (r) => (r.isActive === true ? "Yes" : r.isActive === false ? "No" : "-"),
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
              SysAdmin – Administration Panel
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
                        message: "Admin users cannot be modified or deleted.",
                      });
                    }
                  }}
                  headerActions={
                    <>
                      <Button
                        variant="success"
                        size="sm"
                        className="className="admin-action-btn btn-wine-primary
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
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => openWineModal("create")}
                      >
                        Add
                      </Button>

                      <Button
                        variant="primary"
                        size="sm"
                        disabled={!selectedWine}
                        onClick={() => openWineModal("edit")}
                      >
                        Edit
                      </Button>

                      <Button
                        variant="danger"
                        size="sm"
                        disabled={!selectedWine}
                        onClick={() => openWineDeleteConfirm()}
                      >
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
                        Delete
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
          confirmText="Delete"
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
