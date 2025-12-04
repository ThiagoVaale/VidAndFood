import React, { useState, useRef, useEffect } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap"
import "./somellier.css";
import { getWineRecommendations, validateWineRecommendations } from "../../../services/somellierAiService";
import CustomNavBar from "../nav-bar/CustomNavbar";


const SommelierAI = () => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: "ai",
            text: "¡Hola! Soy tu Sommelier Virtual. Dime qué vas a comer hoy y consultaré mis mejores opciones.",
            wines: null,
        },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // 1. Agregar mensaje del usuario
        const userMessage = {
            id: Date.now(),
            sender: "user",
            text: input,
            wines: null,
        };

        setMessages((prev) => [...prev, userMessage]);
        const currentInput = input;
        setInput("");
        setIsLoading(true);

        try {
            // 2. Llamar al servicio para obtener recomendaciones
            let recommendations = await getWineRecommendations(currentInput);

            // 3. Validar las recomendaciones
            recommendations = validateWineRecommendations(recommendations);

            if (recommendations.length === 0) {
                throw new Error("No se pudieron obtener recomendaciones válidas");
            }

            // 4. Agregar respuesta del AI
            const aiMessage = {
                id: Date.now() + 1,
                sender: "ai",
                text: `Aquí tienes ${recommendations.length} excelentes opciones para acompañar "${currentInput}":`,
                wines: recommendations,
            };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error(error);
            // Manejo de errores amigable
            const errorMessage = error.message || "Error desconocido";
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now(),
                    sender: "ai",
                    text: `Lo siento, no pude obtener las recomendaciones. ${errorMessage}`
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
        <CustomNavBar/>
        <Container className="py-5 mt-5">
            <Row className="justify-content-center">
                <Col md={10} lg={8}>
                    <Card className="shadow border-0">
                        <Card.Header className="bg-white border-bottom-0 pt-4 pb-0">
                            <h4 className="text-center mb-0" style={{ color: "#6f42c1" }}>
                                🍷 Sommelier AI
                            </h4>
                            <p className="text-muted text-center small">
                                Powered by Gemini 
                            </p>
                        </Card.Header>
                        <Card.Body>
                            {/* Área de Chat */}
                            <div className="chat-container mb-3">
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`d-flex flex-column ${msg.sender === "user" ? "align-items-end" : "align-items-start"
                                            }`}
                                    >
                                        <div className={`message-bubble message-${msg.sender}`}>
                                            {msg.text}
                                        </div>

                                        {/* Si hay vinos recomendados, renderizarlos */}
                                        {msg.wines && (
                                            <div className="message-bubble message-ai mt-1">
                                                <ul className="wine-list mb-0">
                                                    {msg.wines.map((wine) => (
                                                        <li key={wine.id} className="wine-item">
                                                            <strong>{wine.name}</strong>: {wine.reason}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="message-bubble message-ai">
                                        <div className="typing-indicator">
                                            <span></span><span></span><span></span>
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <Form onSubmit={handleSend}>
                                <InputGroup className="mb-3">
                                    <Form.Control
                                        placeholder="Ej: Asado, Sushi, Pasta con trufas..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        disabled={isLoading}
                                        style={{ borderRadius: "20px 0 0 20px" }}
                                    />
                                    <Button
                                        variant="primary"
                                        type="submit"
                                        disabled={isLoading}
                                        style={{
                                            backgroundColor: "#6f42c1",
                                            borderColor: "#6f42c1",
                                            borderRadius: "0 20px 20px 0"
                                        }}
                                    >
                                        {isLoading ? "Consultar" : "Enviar"}
                                    </Button>
                                </InputGroup>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
        </>
    );
};

export default SommelierAI;