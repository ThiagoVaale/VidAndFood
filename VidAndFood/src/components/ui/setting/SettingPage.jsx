import { useContext, useState } from "react";
import AuthContext from "../../../services/context/authContext/AuthContext";
import CustomNavbar from "../nav-bar/CustomNavbar";
import "./SettingPage.css";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import {
  downgradeToUser,
  upgradeToSommelier,
} from "../../../services/roleServices";

const SettingPage = () => {
  const { user, onLogin } = useContext(AuthContext);
  const { showResponse } = useContext(ResponseContext);

  const [accountForm, setAccountForm] = useState({
    fullname: user?.fullName,
    email: user?.email,
    membership: user?.role,
  });

  const [saving, setSaving] = useState(false);

  const handleSelectMembership = (membership) => {
    setAccountForm((prev) => ({ ...prev, membership }));
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();

    const currentRole = user.role;
    const newRole = accountForm.membership;

    if (!currentRole) {
      return;
    }

    if (currentRole === newRole) {
      showResponse({
        variant: "error",
        title: "Error updating subscription",
        message: "You didn't make any changes to your subscription type.",
      });
      return;
    }

    setSaving(true);

    try {
      if (currentRole === "Sommelier" && newRole === "User") {
        const { token: newToken } = await downgradeToUser();
        
        if (!newToken) {
          throw new Error("No token was received from the backend");
        }

        onLogin(newToken);

        showResponse({
          variant: "info",
          title: "Subscription updated",
          message: "Your subscription was updated.",
        });

        setAccountForm((prev) => ({ ...prev, membership: "User" }));
        return;
      }

      if (currentRole === "User" && newRole === "Sommelier") {
        const { token: newToken, message } = await upgradeToSommelier();

        if (!newToken) {
          throw new Error("No token was received from the backend");
        }

        onLogin(newToken);
        showResponse({
          variant: "success",
          title: "Subscription updated",
          message:
            message ||
            "You are now a Sommelier at Vid&Food. Enjoy the benefits of your new subscription.",
        });

        setAccountForm((prev) => ({ ...prev, membership: "Sommelier" }));
        return;
      }

      showResponse({
        variant: "error",
        title: "Role change not available",
        message:
          "From this screen, you can only upgrade from User to Sommelier, or downgrade from Sommelier to User.",
      });
      setAccountForm((prev) => ({ ...prev, membership: currentRole }));
    } catch (err) {
      showResponse({
        variant: "error",
        title: "Your subscription could not be updated",
        message:
          err?.message ||
          "An error occurred while updating your membership type.",
      });
      setAccountForm((prev) => ({ ...prev, membership: currentRole }));
    } finally {
      setSaving(false);
    }
  };

  const membershipPlans =
    user?.role === "Admin"
      ? ["User", "Sommelier", "Admin"]
      : ["User", "Sommelier"];

  const currentRole = user?.role;

  return (
    <>
      <CustomNavbar />

      <div className="settings-page-wrapper">
        <div className="container py-4">
          <header className="header-setting mb-4">
            <h1 className="settings-title">Settings</h1>
            <p className="settings-subtitle">
              View your user information and update your subscription.
            </p>
          </header>

          <div className="settings-card shadow-sm p-4 ">
            <form>
              <label className="form-label mt-3">Email</label>
              <input
                type="email"
                className="form-control"
                value={accountForm.email}
                disabled
              />
              <div className="text-muted small mt-1">
                The email is used for logging in and communications.
              </div>

              <label className="form-label mt-3">First and last name</label>
              <input
                type="email"
                className="form-control"
                value={accountForm.fullname}
                disabled
              />

              <label className="form-label mt-4">Subscription</label>
              <div className="membership-group mx-2" />
              {membershipPlans.map((plan) => {
                const isSelected = accountForm.membership === plan;
                const isCurrent = currentRole === plan;

                let tagText = "";
                if (isCurrent) {
                  tagText = "(current)";
                } else if (currentRole === "User" && plan === "Sommelier") {
                  tagText = "(update)";
                }

                return (
                  <button
                    key={plan}
                    type="button"
                    className={
                      "btn btn-sm membership-pill" +
                      (isSelected ? " active" : "")
                    }
                    onClick={() => handleSelectMembership(plan)}
                  >
                    <span>{plan}</span>
                    {tagText && (
                      <span className="membership-tag"> {tagText}</span>
                    )}
                  </button>
                );
              })}

              <div className="text-muted small mb-3">
                The type of membership defines benefits such as extended
                history, favorites, creating a wine if it is not available, and
                advanced recommendations with a chatbot.
              </div>

              <button
                type="submit"
                className="btn btn-dark button-save"
                disabled={saving}
                onClick={handleSaveAll}
              >
                {saving ? "Saving..." : "Save changes"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingPage;
