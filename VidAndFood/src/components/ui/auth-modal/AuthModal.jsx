import { useContext, useEffect, useRef, useState } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import COLORS from "../../../utils/colors";
import "./AuthModal.css";
import AuthContext from "../../../services/context/authContext/AuthContext";
import ResponseContext from "../../../services/context/responseContext/ResponseContext";
import { useNavigate } from "react-router-dom";
import { mapClaimsToUser, parseJwt } from "../../../utils/jwt";

const AuthModal = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    closeAuthModal,
    openAuthModal,
    switchMode,
    loginRequest,
    registerRequest,
  } = useContext(AuthContext);

  const isLogin = authModalMode === "login";

  const [formLogin, setFormLogin] = useState({
    email: "",
    password: "",
  });

  const [formRegister, setFormRegister] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const [submitting, setSubmitting] = useState(false);

  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const fullNameRef = useRef(null);

  const title = authModalMode === "login" ? "Iniciar sesión" : "Crear cuenta";

  const navigate = useNavigate();

  const { showResponse } = useContext(ResponseContext);

  useEffect(() => {
    const handleOpenFromSession = () => {
      if (authModalMode !== "login") {
        switchMode();
      }
      openAuthModal("login");
    };

    window.addEventListener("open-auth-modal", handleOpenFromSession);

    return () => {
      window.removeEventListener("open-auth-modal", handleOpenFromSession);
    };
  }, [openAuthModal, authModalMode, switchMode]);

  const handleChangeLogin = (e) => {
    const { name, value } = e.target;
    setFormLogin((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeRegister = (e) => {
    const { name, value } = e.target;
    setFormRegister((prev) => ({ ...prev, [name]: value }));
  };

  const markInvalid = (ref) => {
    if(!ref.current) return;

    ref.current.classList.add("input-error");
    ref.current.focus();
  }

  const clearInvalid = (ref) => {
    if(!ref.current) return;

    ref.current.classList.remove("input-error");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    clearInvalid(emailRef);
    clearInvalid(passwordRef);
    clearInvalid(fullNameRef);

    try {
      if (isLogin) {
        if(!emailRef.current.value.trim() && !passwordRef.current.value.trim()){
          markInvalid(emailRef);
          markInvalid(passwordRef);

          showResponse({
            variant: "error",
            title: "Campos incompletos",
            message: "Email y contraseña no pueden estar vacios"
          });
          setSubmitting(false);
          return;
        }

        if(!emailRef.current.value.trim()){
          markInvalid(emailRef);
          showResponse({
            variant: "error",
            title: "Campos incompletos",
            message: "El email no puede estar vacío"
          });
          setSubmitting(false);
          return;
        }

        if(!passwordRef.current.value.trim()){
          markInvalid(passwordRef);
          showResponse({
            variant: "error",
            title: "Campos incompletos",
            message: "La contaseña no puede estar vacío"
          });
          setSubmitting(false);
          return;
        }

        const { token } = await loginRequest(formLogin);
        setFormLogin({ email: "", password: "" });

        const claims = parseJwt(token);
        const mappedUser = mapClaimsToUser(claims);

        if (mappedUser?.role === "Admin") {
          navigate("/sys-admin", { replace: true }); 
        }
        showResponse({
          variant: "success",
          title: "Inicio de sesión correcto!",
          message: "Bienvendio a Vid&Food!",
        });
      } else {
        if(!emailRef.current.value.trim() && !passwordRef.current.value.trim() && !fullNameRef.current.value.trim()){
          markInvalid(emailRef);
          markInvalid(passwordRef);
          markInvalid(fullNameRef);

          showResponse({
            variant: "error",
            title: "Campos incompletos",
            message: "Email, contraseña y nombre y apellido no pueden estar vacios"
          });
          setSubmitting(false);
          return;
        }

         if(!emailRef.current.value.trim()){
          markInvalid(emailRef);
          showResponse({
            variant: "error",
            title: "Campos incompletos",
            message: "El email no puede estar vacío"
          });
          setSubmitting(false);
          return;
        }

        if(!passwordRef.current.value.trim()){
          markInvalid(passwordRef);
          showResponse({
            variant: "error",
            title: "Campos incompletos",
            message: "La contaseña no puede estar vacío"
          });
          setSubmitting(false);
          return;
        }

        if(!fullNameRef.current.value.trim()){
          markInvalid(fullNameRef);
          showResponse({
            variant: "error",
            title: "Campos incompletos",
            message: "El nombre completo no puede estar vacio"
          });
          setSubmitting(false);
          return;
        }

        await registerRequest(formRegister);
        setFormRegister({ email: "", password: "", fullName: "" });

        showResponse({
          variant: "success",
          title: "Cuenta creada con exito!",
          message: "Tu cuenta se creo correctamente. Disfruta de Vid&Food!",
        });
      }
      closeAuthModal();
    } catch (err) {
      const msg = err.message || "Ocurrio un error";
      showResponse({
        variant: "error",
        title: "Error inesperado.",
        message: msg,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleHide = () => {
    if (!submitting) {
      closeAuthModal();
    }
  };

  const handleSwitchMode = () => {
    clearInvalid(emailRef);
    clearInvalid(passwordRef);
    clearInvalid(fullNameRef);
    
    if (submitting) return;
    switchMode();
  };

  return (
    <Modal
      show={isAuthModalOpen}
      onHide={handleHide}
      centered
      dialogClassName="auth-modal-dialog"
      contentClassName="auth-modal-content"
    >
      <button type="button" className="auth-modal-close" onClick={handleHide}>
        ×
      </button>

      <div className="auth-modal-body">
        <div className="auth-modal-left" />

        <div className="auth-modal-right">
          <div className="auth-modal-header-text">
            <span className="auth-modal-title-main">
              Unirse a <span style={{ color: COLORS.darkGreen }}>Vid&Food</span>
            </span>
            <span className="auth-modal-title-separator"> | </span>
            <span className="auth-modal-title-secondary">{title}</span>
          </div>

          {authModalMode === "login" ? (
            <Form noValidate onSubmit={handleSubmit} className="auth-modal-form">
              <Form.Group className="mb-3" controlId="authEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Escribe tu dirección de correo electrónico"
                  value={formLogin.email}
                  onChange={handleChangeLogin}
                  ref={emailRef}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="authPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formLogin.password}
                  onChange={handleChangeLogin}
                  ref={passwordRef}
                />
              </Form.Group>

              <Button
                type="submit"
                className="auth-modal-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                      role="status"
                    />
                    Procesando...
                  </>
                ) : isLogin ? (
                  "Continuar"
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </Form>
          ) : (
            <Form onSubmit={handleSubmit} className="auth-modal-form">
              <Form.Group className="mb-3" controlId="authEmail">
                <Form.Label>Correo electrónico</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Escribe tu dirección de correo electrónico"
                  value={formRegister.email}
                  onChange={handleChangeRegister}
                  ref={emailRef}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="authPassword">
                <Form.Label>Contraseña</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Ingresa tu contraseña"
                  value={formRegister.password}
                  onChange={handleChangeRegister}
                  ref={passwordRef}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="authPassword">
                <Form.Label>Nombre y apellido</Form.Label>
                <Form.Control
                  type="text"
                  name="fullName"
                  placeholder="Ingrese su nombre y apellido. ej: Nombre Apellido"
                  value={formRegister.fullName}
                  onChange={handleChangeRegister}
                  ref={fullNameRef}
                />
              </Form.Group>

              <Button
                type="submit"
                className="auth-modal-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      animation="border"
                      size="sm"
                      className="me-2"
                      role="status"
                    />
                    Procesando...
                  </>
                ) : isLogin ? (
                  "Continuar"
                ) : (
                  "Crear cuenta"
                )}
              </Button>
            </Form>
          )}

          <div className="auth-modal-footer-links">
            {isLogin ? (
              <p>
                ¿No tienes un perfil?{" "}
                <button
                  type="button"
                  className="auth-modal-link"
                  onClick={handleSwitchMode}
                >
                  Unirse a Vid&Food
                </button>
              </p>
            ) : (
              <p>
                ¿Ya tenés cuenta?{" "}
                <button
                  type="button"
                  className="auth-modal-link"
                  onClick={handleSwitchMode}
                >
                  Iniciar sesión
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
