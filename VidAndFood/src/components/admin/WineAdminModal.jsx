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
  wineType: null,
  notesTaste: "",
  aroma: "",
  countryName: "Argentina",
  vintageYear: 0,
  price: 0,
  description: "",
  imageUrl: "",
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
      setSelectedWinery(null);
      setSelectedGrapes([]);
      return;
    }

    if (isEdit && wine) {
      setAddWine({
        name: wine.name ?? "",
        wineryName: wine.wineryName ?? "",
        regionName: wine.regionName ?? "",
        wineType: typeof wine.wineType === "number" ? wine.wineType : null,
        notesTaste: wine.notesTaste ?? "",
        aroma: wine.aroma ?? "",
        vintageYear: wine.vintageYear ?? 0,
        price: wine.price ?? 0,
        description: wine.description ?? "",
        imageUrl: wine.imageUrl ?? "",
      });

      setSelectedWinery(
        wine.wineryName
          ? { value: wine.wineryName, label: wine.wineryName }
          : null,
      );

      setSelectedGrapes(viewGrapesWine(wine, grapeOptions));
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

        console.log(("GRAPES: ", grapes));

        const wineriesOptions = wineries.map((name) => ({
          value: name,
          label: name,
        }));

        const grapesOptions = grapes.map((g) => ({
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
    name: addWine.name,
    wineryName: selectedWinery?.value ?? "",
    regionName: addWine.regionName,
    wineType: addWine.wineType ?? 0,
    notesTaste: addWine.notesTaste,
    aroma: addWine.aroma,
    countryName: "Argentina",
    vintageYear: addWine.vintageYear ?? 0,
    price: addWine.price ?? 0,
    description: addWine.description,
    imageUrl: addWine.imageUrl,
    grapes: selectedGrapes.map((g) => g.value),
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      if (isEdit) {
        console.log("Vino antes de actualizar: ", payload);
        await fetchUpdateWineAdmin(payload, wine.id);
        showResponse({
          title: "Vino actualizado",
          variant: "success",
          message: "El vino se actualizó correctamente",
        });
      } else {
        console.log("Vino antes de crear: ", payload);
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

    setAddWine((prev) => {
      if (name === "wineType" || name === "vintageYear" || name === "price") {
        return { ...prev, [name]: value === "" ? 0 : Number(value) };
      }
      return { ...prev, [name]: value };
    });
  };

  const viewGrapesWine = (wine, grapeOptions) => {
    if (!wine || !Array.isArray(grapeOptions) || grapeOptions.length === 0) {
      return [];
    }

    if (Array.isArray(wine.grapes) && wine.grapes.length > 0) {
      const ids = wine.grapes.map((g) => String(g.id));
      return grapeOptions.filter((o) => ids.includes(String(o.value)));
    }
    return [];
  };

  const wineTypeOptions = [
    { value: 0, label: "Espumoso" },
    { value: 1, label: "Tinto" },
    { value: 2, label: "Blanco" },
    { value: 3, label: "Rosado" },
  ];

  return (
    <Modal show={show} onHide={saving ? undefined : onClose} centered size="lg">
      <Modal.Header closeButton={!saving}>
        <Modal.Title>{isEdit ? "Edit wine" : "Add wine"}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  name="name"
                  value={addWine.name}
                  onChange={handleCreateWine}
                  placeholder="Ej: Malbec"
                  disabled={saving}
                  autoFocus
                />
              </Col>

              <Col md={4}>
                <Form.Label>Winery</Form.Label>
                <Select
                  options={wineryOptions}
                  value={selectedWinery}
                  onChange={(opt) => setSelectedWinery(opt)}
                  placeholder="Seleccionar bodega..."
                  isDisabled={saving}
                  isClearable
                />
              </Col>

              <Col md={4}>
                <Form.Label>Region</Form.Label>
                <Form.Control
                  name="regionName"
                  value={addWine.regionName}
                  onChange={handleCreateWine}
                  placeholder="Ej: Mendoza"
                  disabled={saving}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Label>Wine Type</Form.Label>
                <Select
                  options={wineTypeOptions}
                  value={
                    wineTypeOptions.find((o) => o.value === addWine.wineType) ??
                    null
                  }
                  onChange={(opt) =>
                    setAddWine((prev) => ({
                      ...prev,
                      wineType: opt?.value ?? 0,
                    }))
                  }
                  placeholder="Select wine type..."
                  isDisabled={saving}
                  isClearable
                />
              </Col>

              <Col md={4}>
                <Form.Label>Notes Taste</Form.Label>
                <Form.Control
                  name="notesTaste"
                  value={addWine.notesTaste}
                  onChange={handleCreateWine}
                  placeholder="Ej: Amaderado"
                  disabled={saving}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Aroma</Form.Label>
                <Form.Control
                  name="aroma"
                  value={addWine.aroma}
                  onChange={handleCreateWine}
                  placeholder="Ej: Frutal"
                  disabled={saving}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={4}>
                <Form.Label>Vintage Year</Form.Label>
                <Form.Control
                  name="vintageYear"
                  value={addWine.vintageYear}
                  onChange={handleCreateWine}
                  placeholder="Ej: 2020"
                  disabled={saving}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  name="price"
                  value={addWine.price}
                  onChange={handleCreateWine}
                  placeholder="Ej: 8500"
                  disabled={saving}
                />
              </Col>

              <Col md={4}>
                <Form.Label>Descripton</Form.Label>
                <Form.Control
                  name="description"
                  value={addWine.description}
                  onChange={handleCreateWine}
                  placeholder="Ej: Blanco seco"
                  disabled={saving}
                />
              </Col>
            </Row>
          </Form.Group>

          <Form.Group className="mb-3">
            <Row>
              <Col md={6}>
                <Form.Label>Image</Form.Label>
                <Form.Control
                  name="imageUrl"
                  value={addWine.imageUrl}
                  onChange={handleCreateWine}
                  placeholder="URL de image"
                  disabled={saving}
                />
              </Col>

              <Col md={6}>
                <Form.Label>Grapes</Form.Label>
                <Select
                  isMulti
                  options={grapeOptions}
                  value={selectedGrapes}
                  onChange={(opts) => setSelectedGrapes(opts ?? [])}
                  placeholder="Select Grape..."
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
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default WineAdminModal;
