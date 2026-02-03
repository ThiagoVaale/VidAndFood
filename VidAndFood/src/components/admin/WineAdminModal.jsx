import { useContext, useEffect, useState } from "react";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import ResponseContext from "../../services/context/responseContext/ResponseContext";
import {
  fetchAddWineAdmin,
  fetchUpdateWineAdmin,
} from "../../services/wineService";
import { fetchAllWineries } from "../../services/wineryServices";
import { fetchAllGrapes } from "../../services/grapeServices";
import Select from "react-select";

const emptyWine = {
  name: "",
  wineryName: "",
  regionName: "",
  vintageYear: "",
  price: "",
  description: "",
  imageUrl: "",
  grapes: "",
};

const WineAdminModal = ({ show, mode, wine, onClose, onSuccess }) => {
  const isCreate = mode === "create";
  const isEdit = mode === "edit";

  const [addWine, setAddWine] = useState(emptyWine);
  const [saving, setSaving] = useState(false);

  const [wineryOptions, setWineryOptions] = useState([]);
  const [grapeOptions, setGrapeOptions] = useState([]);

  const [selectedWinery, setSelectedWinery] = useState(null);
  const [selectedGrapes, setSelectedGrapes] = useState([]);

  const { showResponse } = useContext(ResponseContext);

  useEffect(() => {
    if (!show) return;
    setSaving(false);

    if (isCreate) {
      setAddWine(emptyWine);
    }

    if (isEdit && wine) {
      setAddWine({
        name: wine.name ?? "",
        wineryName: "",
        regionName: wine.regionName ?? "",
        vintageYear: wine.vintageYear ?? "",
        price: wine.price ?? "",
        description: wine.description ?? "",
        imageUrl: wine.imageUrl ?? "",
        grapes: "",
      });

      setSelectedWinery(
        wine.wineryName
          ? { value: wine.wineryName, label: wine.wineryName }
          : null,
      );

      const ids = wine.grapes ?? [];
      setSelectedGrapes(grapeOptions.filter((o) => ids.includes(o.value)));
    } else {
      setAddWine({
        name: "",
        regionName: "",
        vintageYear: "",
        price: "",
        description: "",
        imageUrl: "",
        wineryName: "",
        grapes: "",
      });
      setSelectedWinery(null);
      setSelectedGrapes([]);
    }
  }, [show, isCreate, isEdit, wine, grapeOptions]);

  useEffect(() => {
    if (!show) return;

    const loadCombos = async () => {
      try {
        const [wineries, grapes] = await Promise.all([
          fetchAllWineries(),
          fetchAllGrapes(),
        ]);

        console.log(("GRAPES: ", grapes))

        const wineriesOptions = (wineries ?? []).map((name) => ({
          value: name,
          label: name,
        }));

        const grapesOptions = (grapes ?? []).map((g) => ({
          value: g.id,
          label: g.name,
        }));

        setWineryOptions(wineriesOptions);
        setGrapeOptions(grapesOptions);
      } catch (err) {
        showResponse({
          title: "Error",
          variant: "error",
          message: err.message,
        });
      }
    };

    loadCombos();
  }, [show, showResponse]);

  const payload = {
    ...addWine,
    wineryName: selectedWinery?.value ?? "",
    grapes: selectedGrapes.map((g) => g.value)
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isEdit) {
        await fetchUpdateWineAdmin(payload, wine.id);
        showResponse({
          title: "Vino actualizado",
          variant: "success",
          message: "El vino se actualizó correctamente",
        });
      } else {
        await fetchAddWineAdmin(payload);
        showResponse({
          title: "Vino creado",
          variant: "success",
          message: "El vino se creó correctamente",
        });
      }

      onClose();
      await onSuccess?.();
    } catch (e) {
      showResponse({
        title: "Vino actualizado",
        variant: "error",
        message: e.message,
      });
    } finally {
      setSaving(false);
    }
  };

  const handleCreateWine = (e) => {
    const { name, value } = e.target;
    setAddWine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal show={show} onHide={saving ? undefined : onClose} centered>
      <Modal.Header closeButton={!saving}>
        <Modal.Title>{isEdit ? "Editar vino" : "Agregar vino"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Label>Nombre</Form.Label>
                <Form.Control
                  name="name"
                  value={addWine.name}
                  onChange={handleCreateWine}
                  placeholder="Ej: Malbec"
                  disabled={saving}
                  autoFocus
                />
              </Col>

              <Col md={6}>
                <Form.Label>Bodega</Form.Label>
                <Select
                  options={wineryOptions}
                  value={selectedWinery}
                  onChange={(opt) => setSelectedWinery(opt)}
                  placeholder="Seleccionar bodega..."
                  isDisabled={saving}
                  isClearable
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Label>Región</Form.Label>
                <Form.Control
                  name="regionName"
                  value={addWine.regionName}
                  onChange={handleCreateWine}
                  placeholder="Ej: Mendoza"
                  disabled={saving}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Año de cosecha</Form.Label>
                <Form.Control
                  name="vintageYear"
                  type="number"
                  value={addWine.vintageYear}
                  onChange={handleCreateWine}
                  placeholder="Ej: 2021"
                  disabled={saving}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Label>Precio</Form.Label>
                <Form.Control
                  name="price"
                  type="number"
                  value={addWine.price}
                  onChange={handleCreateWine}
                  placeholder="Ej: 8500"
                  disabled={saving}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  name="description"
                  value={addWine.description}
                  onChange={handleCreateWine}
                  placeholder="Descripción del vino"
                  disabled={saving}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Label>Imagen</Form.Label>
                <Form.Control
                  name="imageUrl"
                  value={addWine.imageUrl}
                  onChange={handleCreateWine}
                  placeholder="URL de imagen"
                  disabled={saving}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Uvas</Form.Label>
                <Select
                  isMulti
                  options={grapeOptions}
                  value={selectedGrapes}
                  onChange={(opts) => setSelectedGrapes(opts ?? [])}
                  placeholder="Seleccionar uvas..."
                  isDisabled={saving}
                  closeMenuOnSelect={false}
                />
              </Col>
            </Row>
          </Form.Group>
        </Form>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} disabled={saving}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WineAdminModal;
