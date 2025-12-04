const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const GEMINI_ENDPOINT = `${API_BASE_URL}/Gemini`;
 
const createSystemInstruction = () => `
Eres un sommelier experto y servicial especializado en vinos argentinos.
El usuario te dirá qué va a comer (un plato, preparación o menú).

Tu tarea es sugerir HASTA 5 etiquetas de vinos argentinos que mariden bien con ese plato.

REQUISITOS DE CONTENIDO:

- Solo sugiere vinos argentinos (pueden ser tintos, blancos, rosados o espumantes).
- Para cada vino, el campo "name" debe incluir al menos:
  - Bodega (si es posible),
  - Variedad o corte (Malbec, Cabernet Sauvignon, blend, Torrontés, etc.),
  - Región o provincia (Mendoza, Salta, Patagonia, etc.).
  Ejemplo de "name":
  "Catena Zapata Malbec - Mendoza"
- El campo "reason" debe estar en ESPAÑOL y ser breve (1 o 2 frases),
  explicando por qué ese vino marida con el plato:
  menciona estilo del vino (cuerpo, acidez, taninos, aromas) y
  características de la comida (grasas, salsas, intensidad, etc.)
- Si la descripción de la comida es muy genérica (ej. "carne", "pasta"),
  realiza una suposición razonable (ej. "carne de res a la parrilla")
  y aclárala dentro de "reason".
- Si el plato no marida perfectamente con vino (ej. postres muy dulces, comidas muy picantes),
  igualmente sugiere las mejores opciones posibles y explícalo en "reason".

FORMATO DE RESPUESTA (MUY IMPORTANTE):

Tu respuesta debe ser ÚNICAMENTE un Array JSON válido.
No incluyas texto introductorio, ni markdown (como \`\`\`json), ni saludos.

Estructura exacta del JSON:
[
  { "id": 1, "name": "Nombre del vino con bodega y región", "reason": "Explicación breve en español" },
  { "id": 2, "name": "...", "reason": "..." },
  ...
  hasta 5 elementos como máximo
]

- "id" debe ser un número entero empezando en 1 y sin repetir (1, 2, 3, 4, 5).
`;

/**
 * Limpia la respuesta JSON de caracteres no deseados
 * @param {string} jsonString - String JSON a limpiar
 * @returns {string} JSON limpio
 */
const cleanJsonResponse = (jsonString) => {
    return jsonString
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();
};

/**
 * Convierte la respuesta de la API al formato esperado
 * @param {any} data - Datos recibidos de la API
 * @returns {string} Texto JSON limpio
 */
const extractAiText = (data) => {
    // Si es string, retorna directamente
    if (typeof data === 'string') {
        return data;
    }

    // Intenta acceder a propiedades comunes de respuesta
    if (data?.output) return data.output;
    if (data?.text) return data.text;
    if (data?.answer) return data.answer;
    if (data?.result) return data.result;
    if (data?.content) return data.content;

    // Si nada funciona, convierte el objeto a string
    return JSON.stringify(data);
};

/**
 * Realiza una llamada al endpoint de Gemini
 * @param {string} food - Descripción del alimento/plato
 * @returns {Promise<Array>} Array de recomendaciones de vinos
 * @throws {Error} Si hay error en la solicitud o procesamiento
 */
const getWineRecommendations = async (food) => {
    try {
        // 1. Construir el prompt completo
        const systemInstruction = createSystemInstruction();
        const fullPrompt = `${systemInstruction}\n\nComida del usuario: "${food}"`;

        // 2. Realizar la solicitud al backend
        const response = await fetch(GEMINI_ENDPOINT, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                prompt: fullPrompt,
            }),
        });

        // 3. Validar la respuesta
        if (!response.ok) {
            throw new Error(`Error del servidor: ${response.status} ${response.statusText}`);
        }

        // 4. Procesar la respuesta JSON
        const data = await response.json();

        // 5. Extraer el texto de la IA
        const aiText = extractAiText(data);

        // 6. Limpiar y parsear el JSON
        const cleanJson = cleanJsonResponse(aiText);
        const wineRecommendations = JSON.parse(cleanJson);

        // 7. Validar que sea un array
        if (!Array.isArray(wineRecommendations)) {
            throw new Error("La respuesta no es un array de vinos válido");
        }

        return wineRecommendations;
    } catch (error) {
        console.error("Error obteniendo recomendaciones de vinos:", error);
        throw new Error(
            error.message || "Error al conectar con el servidor de sommelier"
        );
    }
};

/**
 * Valida que una recomendación de vino tenga la estructura correcta
 * @param {Object} wine - Objeto de vino a validar
 * @returns {boolean} True si es válido
 */
const isValidWineRecommendation = (wine) => {
    return (
        wine &&
        typeof wine === "object" &&
        (wine.id || wine.id === 0) &&
        typeof wine.name === "string" &&
        typeof wine.reason === "string"
    );
};

/**
 * Valida un array completo de recomendaciones
 * @param {Array} wines - Array de vinos a validar
 * @returns {Array} Array validado (filtra inválidos)
 */
const validateWineRecommendations = (wines) => {
    if (!Array.isArray(wines)) {
        return [];
    }
    return wines.filter(isValidWineRecommendation);
};

export {
    getWineRecommendations,
    validateWineRecommendations,
    cleanJsonResponse,
    extractAiText,
};
