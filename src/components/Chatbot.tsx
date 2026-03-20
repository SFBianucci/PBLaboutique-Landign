import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { GoogleGenAI } from '@google/genai';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

// Initialize the Gemini API client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([
    {
      role: 'model',
      text: 'Bienvenido a Parabrisas la Boutique. Soy su asistente virtual de precisión. ¿En qué le puedo ayudar hoy?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [chatSession, setChatSession] = useState<any>(null);

  // Initialize the chat session
  useEffect(() => {
    const initChat = async () => {
      try {
        const session = await ai.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: `Eres el asistente virtual exclusivo de 'Parabrisas la Boutique', un atelier de precisión especializado en restauración y reemplazo de cristales automotrices de alta gama. Tu tono debe ser profesional, elegante, preciso y servicial, reflejando un servicio de 'guante blanco', pero debes ser capaz de entender perfectamente a clientes que usen lenguaje coloquial argentino o "callejero" (ej. "che", "capo", "vidrio", "chata", "cuánto duele", "qué onda", "parabrisa").

INFORMACIÓN DEL NEGOCIO:
- Ubicación: Cerrito 2399 (Esquina Salta al 100), Lomas del Mirador, Buenos Aires. Mapa: https://maps.app.goo.gl/m6QaVSggpeMuidps8
- Horarios: Lunes a Viernes de 8:00 a 12:00 y de 14:00 a 18:00. Sábados de 08:30 a 13:00hs.
- Métodos de pago: Efectivo, Débito, Crédito y Transferencia.
- Extras: Los clientes pueden pedir Telepase.
- Servicios ofrecidos: Cristales (reparación y reemplazo), Colocación y descolocación, Cerraduras, Reparación de máquinas (levanta vidrios), Polarizados, y Grabados de cristales.

MARCAS Y MODELOS (STOCK):
Trabajamos con una amplísima variedad de marcas y modelos. Internamente en nuestra base, la "Marca" equivale a "Modelo_ST", y el "Modelo del auto" equivale a "Articulo".
Algunas de las principales marcas con las que trabajamos incluyen:
AUDI, BMW, CHERY, CHEVROLET, CITROEN, DAEWOO, DAIHATSU, DODGE/CHRYSLER, FIAT, FORD, GEELY, HONDA, HYUNDAI, ISUZU, IVECO, JEEP, KIA, LIFAN, MAZDA, MERCEDES BENZ, MITSUBISHI, NISSAN, PEUGEOT, RENAULT, SUBARU, SUZUKI, TOYOTA, VOLKSWAGEN.
(Tenemos stock de parabrisas, lunetas, ventiletes, aletas, custodias y cristales de puertas para la mayoría de los modelos de estas marcas, desde clásicos como el Ford Falcon o Renault 12, hasta modelos 2023/2024).

SEGUROS ACEPTADOS:
Trabajamos con los siguientes seguros: ALLIANZ, ANTARTIDA, ATM, ARMORAUT, BERKLEY, BLEU, BOSTON, CAJA, COLLINS, CIGLIUTTI, CARUSO, DARC, DIETRICH, DIGNA, ESCUDO, EXPERTA, EQUITATIVA, FEDERACION PAT, FINISTERRE, GALENO, GALICIA/SURA, HDI, HOLANDO, INERCIKAR, IAORANA, INTEGRITY, LIDERAR, LIBRA, MERCANTIL ANDINA, MOVILAUT, METROPOL, NACION, NIVEL, ORBIS, PARANA, PROVINCIA, PROVIDENCIA, PERSERVERANCIA, RIO URUGUAY, RUSSONIELLO, RIVADAVIA, SANCOR, SMG, SEGUNDA, SEGURCOOP, SAN CRISTOBAL, STAMPA, TRIUNFO, TPC, VICTORIA, WAGEN, ZURICH, ZURICH QBE, PARTICULAR, MECANICA BRAGADO, ALQUILER, GAULOIS, ANSWER, CHUBB, TALLER, COOPERACION PATRONAL, BARBUSS RISK.

REGLAS ADICIONALES Y FORMATO:
- Entiende el lenguaje coloquial argentino sin problemas, pero mantén siempre tu respuesta con un tono respetuoso, servicial y profesional de la Boutique.
- Si te preguntan si trabajamos con un auto específico, asume que sí si la marca está en la lista, y confírmales que tenemos disponibilidad de cristales para ese modelo.
- Usa listas con viñetas (bullet points) para enumerar elementos (como seguros o servicios).
- Sé conciso, estructura bien la información y evita párrafos gigantes.
- Formatea tu texto usando Markdown (negritas para resaltar, listas, enlaces).
- Si te hacen preguntas específicas sobre precios o disponibilidad exacta de stock que no conoces, indica amablemente que un técnico maestro o el servicio de conserjería se pondrá en contacto para brindar un presupuesto exacto.`,
          },
        });
        setChatSession(session);
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    };
    initChat();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatSession) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await chatSession.sendMessage({ message: userMessage });
      setMessages((prev) => [...prev, { role: 'model', text: response.text || 'Lo siento, hubo un error de comunicación.' }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => [
        ...prev,
        { role: 'model', text: 'Disculpe, nuestro sistema está experimentando demoras. Por favor, intente nuevamente o contacte a nuestra conserjería.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 w-14 h-14 rounded-full bg-primary text-on-primary shadow-[0_0_20px_rgba(161,211,165,0.3)] flex items-center justify-center hover:scale-105 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
        aria-label="Abrir asistente virtual"
      >
        <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
          voice_chat
        </span>
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-8 right-8 w-full max-w-[380px] h-[500px] max-h-[80vh] bg-surface-container-highest rounded-sm shadow-2xl border border-white/10 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-surface-container-low p-4 flex justify-between items-center border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    voice_chat
                  </span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-sm text-on-surface">Asistente Boutique</h3>
                  <p className="text-[10px] text-primary uppercase tracking-widest">En línea</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-on-surface-variant hover:text-white transition-colors"
                aria-label="Cerrar asistente"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface/50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-sm text-sm font-light leading-relaxed markdown-body ${
                      msg.role === 'user'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container-low text-on-surface border border-white/5'
                    }`}
                  >
                    <Markdown>{msg.text}</Markdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-surface-container-low text-on-surface-variant border border-white/5 p-3 rounded-sm text-sm flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-surface-container-low border-t border-white/5">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Escriba su consulta..."
                  className="w-full bg-surface border border-outline-variant rounded-sm py-3 pl-4 pr-12 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors placeholder:text-on-surface-variant/50"
                  disabled={isLoading}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center text-primary hover:text-white disabled:opacity-50 disabled:hover:text-primary transition-colors"
                  aria-label="Enviar mensaje"
                >
                  <span className="material-symbols-outlined text-xl">send</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
