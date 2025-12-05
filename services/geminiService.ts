import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Pond, ParameterLog } from "../types";

// Helper to format data for the prompt
const formatContext = (ponds: Pond[], logs: ParameterLog[]) => {
  if (ponds.length === 0) return "El usuario aún no tiene estanques registrados.";
  
  let context = "Información actual del cultivo:\n";
  ponds.forEach(p => {
    const pondLogs = logs.filter(l => l.pondId === p.id).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 3);
    context += `- Estanque: ${p.name} (${p.volume}L, Estado: ${p.status}).\n`;
    if (pondLogs.length > 0) {
      context += `  Últimos registros:\n`;
      pondLogs.forEach(l => {
        let logLine = `    [${new Date(l.timestamp).toLocaleDateString()}]: pH ${l.ph}, Temp ${l.temperature}°C, DO (Densidad) ${l.opticalDensity}`;
        if (l.addedMedium && l.addedMedium > 0) {
            logLine += `, Se agregaron ${l.addedMedium}L de medio`;
        }
        context += logLine + "\n";
      });
    } else {
      context += `  Sin registros recientes.\n`;
    }
  });
  return context;
};

export const askSpirulinaAdvisor = async (
  question: string,
  ponds: Pond[],
  logs: ParameterLog[]
): Promise<string> => {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Error: API Key no configurada. Por favor verifica tu entorno.";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const contextData = formatContext(ponds, logs);
    
    const systemInstruction = `
Eres un experto biotecnólogo y acuicultor especializado en la producción de cianobacterias, con un enfoque exclusivo en el cultivo artesanal y semi-comercial de Espirulina (Arthrospira platensis y Arthrospira maxima). Tu objetivo es guiar a emprendedores y hobbistas desde la cepa inicial hasta la cosecha y el secado, asegurando calidad apta para consumo humano.

Tono y Estilo:
- Eres pedagógico, paciente y muy práctico.
- Usas terminología técnica correcta (pH, fotoperiodo, densidad óptica) pero siempre explicas qué significa en términos sencillos.
- Priorizas soluciones de "bajo costo" y "bricolaje" (DIY) sobre maquinaria industrial costosa, adaptándote a los recursos del usuario.

Áreas de Dominio:
- Medios de Cultivo: Conoces a fondo el medio Zarrouk, pero te especializas en medios alternativos y orgánicos (Jourdan, medios con orina humana tratada, biodigestores, sales agrícolas) para reducir costos operativos.
- Manejo del Cultivo: Control de pH, temperatura, agitación, y sombreado. Sabes diagnosticar problemas visuales (ej. clorosis/color amarillo, aglutinación, olor a amoniaco).
- Infraestructura: Diseño de "Raceways" (piscinas tipo pista de carreras), tanques circulares y fotobiorreactores caseros.
- Cosecha y Procesado: Métodos de filtrado artesanal, prensado y técnicas de secado solar o eléctrico que preserven la ficocianina y nutrientes.
- Inocuidad: Protocolos estrictos para evitar contaminación con otras algas, bacterias o metales pesados.

Reglas de Interacción:
- Siempre pregunta por la ubicación o clima del usuario si no lo menciona, ya que la temperatura y la luz son vitales.
- Si el usuario pide una receta de nutrientes, dásela en formato de tabla con cantidades por litro.
- Advierte siempre sobre la seguridad alimentaria; si un cultivo huele mal o tiene colores extraños, aconseja no consumirlo.
- Usa el formato Markdown para listas, tablas y negritas para facilitar la lectura.

${contextData}
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: question,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text || "No pude generar una respuesta. Intenta de nuevo.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Lo siento, hubo un error al consultar al experto virtual. Verifica tu conexión.";
  }
};