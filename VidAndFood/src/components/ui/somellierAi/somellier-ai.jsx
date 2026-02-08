import React, { useState, useRef, useEffect, useContext } from "react";
import { Container, Row, Col, Form, Button, InputGroup, Card } from "react-bootstrap";
import { Send, Magic } from "react-bootstrap-icons"; 
import "./somellier.css";
import { getWineRecommendations, validateWineRecommendations } from "../../../services/somellierAiService";
import CustomNavBar from "../nav-bar/CustomNavbar";

const SommelierAI = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "¡Hola! Soy tu Sommelier Virtual. Dime qué vas a comer hoy y te sugeriré las mejores opciones de nuestra bodega.",
      wines: null,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => { scrollToBottom(); }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now(), sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input;
    setInput("");
    setIsLoading(true);

    try {
      let recommendations = await getWineRecommendations(currentInput);
      recommendations = validateWineRecommendations(recommendations);

      const aiMessage = {
        id: Date.now() + 1,
        sender: "ai",
        text: `Aquí tienes ${recommendations.length} excelentes opciones para acompañar "${currentInput}":`,
        wines: recommendations,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      setMessages((prev) => [...prev, {
        id: Date.now(),
        sender: "ai",
        text: "Lo siento, no pude obtener las recomendaciones. ¿Podrías intentar con otro plato?",
      }]);
    } finally {
      setIsLoading(false);
    }
  };

return (
    <div className="sommelier-fixed-wrapper">
      <CustomNavBar />
      
      <main className="ai-content-main">
        <Container className="h-100 d-flex flex-column justify-content-center">
          <Row className="justify-content-center flex-grow-1 ai-main-row">
            <Col md={10} lg={7} className="d-flex flex-column py-4">
              
              {/* Encabezado: Ahora con margen superior para no ser tapado */}
              <div className="ai-header-content text-center mb-3">
                 <div className="ai-icon-circle">
                    <Magic size={24} color="#9e4758" />
                 </div>
                 <h2 className="ai-main-title">Sommelier IA</h2>
                 <p className="text-muted small">Personaliza tu experiencia gastronómica</p>
              </div>

              {/* Card de Chat con altura flexible pero controlada */}
              <Card className="ai-chat-card border-0 shadow-lg flex-grow-1">
                <Card.Body className="d-flex flex-column p-0 overflow-hidden">
                  
                  <div className="chat-container">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`message-row ${msg.sender === "user" ? "user-row" : "ai-row"}`}>
                        <div className={`message-bubble-premium bubble-${msg.sender}`}>
                          {msg.text}
                          {msg.wines && (
                            <div className="ai-recommendations-grid">
                              {msg.wines.map((wine) => (
                                <div key={wine.id} className="ai-wine-card">
                                  <span className="ai-wine-name">{wine.name}</span>
                                  <p className="ai-wine-reason">{wine.reason}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="message-row ai-row">
                        <div className="message-bubble-premium bubble-ai typing-box">
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                          <div className="typing-dot"></div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="input-area-premium">
                    <Form onSubmit={handleSend}>
                      <InputGroup className="premium-input-group">
                        <Form.Control
                          placeholder="¿Qué vas a cenar hoy?..."
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          disabled={isLoading}
                          className="border-0 shadow-none"
                        />
                        <Button type="submit" disabled={isLoading} className="premium-send-btn">
                          {isLoading ? <div className="spinner-border spinner-border-sm" /> : <Send size={20} />}
                        </Button>
                      </InputGroup>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
    </div>
  );
};

export default SommelierAI;