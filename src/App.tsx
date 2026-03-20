/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Select } from './components/Select';
import { motion } from 'motion/react';

const serviceOptions = [
  { value: 'cristales', label: 'Cristales' },
  { value: 'cerraduras', label: 'Cerraduras' },
  { value: 'maquinas', label: 'Máquinas (Levanta vidrios)' },
  { value: 'polarizados', label: 'Polarizados' },
  { value: 'grabados', label: 'Grabados' },
];

export default function App() {
  const [selectedService, setSelectedService] = useState('');

  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Full-bleed background image */}
        <div className="absolute inset-0 z-0">
          <motion.img
            initial={{ scale: 1.05, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.4 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            alt="Detalle de auto de lujo"
            className="w-full h-full object-cover grayscale"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2pMuxG9SMASxsbdyAPmJwaDH2574gN6zlSCfH0fojvAEwmyzDC35XVEucvP9D3EmAO4QpAUya5BXRE0o7aaJTd8L7plCXXsBwq1vE75YtEA3SNwwLQI7My2RzKZm_fzhf6FOUg4lyx8kvzrAITpPvfDgUqb726URJ1OTwH6J6b5KYJ70G08dsII_RtLSKJz6ROKxJZdIvweoBh_8Tl7ijE-LkhGsu2mNtNf34vnhdl3iMxmYmI9TLMpBaOjTeHLv4npAafEUB6PA"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/40 to-transparent"></div>
        </div>

        {/* Centered content */}
        <div className="relative z-10 text-center px-6 max-w-5xl">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="block font-label uppercase tracking-[0.6em] text-primary text-xs mb-6"
          >
            Automotive Glass Boutique
          </motion.span>
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-8 leading-tight text-glow"
          >
            Claridad Cristalina,<br />Servicio de Precisión
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light"
          >
            Elevamos el estándar de mantenimiento automotriz con ingeniería de precisión y acabados de lujo para los conductores más exigentes.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col md:flex-row gap-4 justify-center"
          >
            <button className="bg-primary text-on-primary px-10 py-4 rounded-sm font-headline font-extrabold uppercase text-sm tracking-widest hover:brightness-110 transition-all active:scale-95">
              Agendar Cita
            </button>
            <button className="border border-outline-variant text-on-surface px-10 py-4 rounded-sm font-headline font-extrabold uppercase text-sm tracking-widest hover:bg-surface-container-low transition-all active:scale-95">
              Ver Servicios
            </button>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="font-label text-[10px] tracking-[0.3em] uppercase text-on-surface-variant">Deslizar</span>
          <div className="w-[1px] h-12 bg-primary"></div>
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="py-32 bg-surface relative" id="servicios">
        {/* Decorative background glow */}
        <div className="absolute top-40 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          >
            <div className="max-w-xl">
              <h2 className="font-headline text-4xl md:text-5xl font-bold tracking-tight mb-6 uppercase">Ingeniería de Excelencia</h2>
              <p className="text-on-surface-variant font-light">Un conjunto de servicios especializados diseñados para los propietarios de vehículos más exigentes.</p>
            </div>
            <div className="font-headline text-8xl font-black text-surface-container-high opacity-10 leading-none select-none">01</div>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: 'directions_car', title: 'Cristales', desc: 'Reemplazo y reparación de cristales para todo tipo de vehículos con acabados de fábrica.' },
              { icon: 'swap_horiz', title: 'Colocación y Extracción', desc: 'Instalación y extracción profesional de parabrisas y otros cristales garantizando un sellado hermético.' },
              { icon: 'lock', title: 'Cerraduras', desc: 'Reparación y reemplazo de cerraduras dañadas o trabadas, devolviendo la seguridad total a su vehículo.' },
              { icon: 'settings', title: 'Mecanismos', desc: 'Solución de fallas en mecanismos levanta vidrios y motores de puertas con repuestos originales.' },
              { icon: 'wb_sunny', title: 'Polarizados', desc: 'Aplicación profesional de láminas con diferentes tonalidades para privacidad y rechazo de calor.' },
              { icon: 'fingerprint', title: 'Grabados', desc: 'Grabado de cristales con código identificatorio bajo normativa vigente para mayor seguridad.' },
            ].map((service, index) => (
              <motion.div 
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative p-10 bg-surface-container-low rounded-lg transition-all duration-500 hover:-translate-y-2 hover:bg-surface-container-high hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 rounded-full"></div>
                
                <div className="w-16 h-16 rounded-xl bg-surface flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <span className="material-symbols-outlined text-3xl text-primary">{service.icon}</span>
                </div>
                <h3 className="font-headline text-2xl font-bold mb-4 tracking-tight relative z-10">{service.title}</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed relative z-10 flex-1">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Us / Clarity Section */}
      <section className="py-32 bg-surface-container-low relative overflow-hidden" id="galeria">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-container/10 blur-[120px]"></div>
        <div className="max-w-7xl mx-auto px-10 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-lg overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] relative">
                <img alt="Primer plano de reparación de parabrisas" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700 hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSH1eH9Cd_0wDqQ-275tKAFIH8vl4THr0LArhsmZh9JPVM1EHABjK0a2dubDJkYn5mxNF4lFHiKDQnh-uhA9sMTFFQ3lJsY2FlupK_to72Ex0AKv8nr5Y5JMrlFohhN8qiruORCo2m3ZpglD8WUFWabPDaqRLhJisa3bga4g1_1-D8J-pnS9GG7k1snDo82VHOYFSz4JrPX3lB-DG_3uZWnJsz6TLRU7oaGxZ7EimXxNfC5encGSeoVLp26AWRx3oNwrMc0ZjcUVc" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel border-t border-outline-variant/20 rounded-lg backdrop-blur-md">
                  <h4 className="font-headline font-bold text-lg mb-2">El Estándar de Claridad</h4>
                  <p className="text-on-surface-variant text-xs leading-relaxed font-light">Cada vehículo se somete a una inspección óptica de 24 puntos antes de la entrega.</p>
                </div>
              </div>
              <div className="absolute -top-10 -right-10 w-48 h-48 border border-primary/20 -z-10 rounded-full blur-xl"></div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
            >
              <span className="font-label text-primary uppercase tracking-[0.3em] text-[10px] mb-6 block">¿Por qué Boutique?</span>
              <h2 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tighter mb-10 leading-tight">DETALLE SIN<br />CONCESIONES.</h2>
              <ul className="space-y-12">
                <li className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">Adhesivos de Grado Aviación</h4>
                    <p className="text-on-surface-variant text-sm font-light">Utilizamos agentes de unión premium que superan los estándares de seguridad, asegurando que su parabrisas mantenga la estructura.</p>
                  </div>
                </li>
                <li className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary">precision_manufacturing</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">Técnicos Maestros</h4>
                    <p className="text-on-surface-variant text-sm font-light">Con años de especialización en marcas de lujo, nuestro equipo entiende los matices de los cristales de alta gama.</p>
                  </div>
                </li>
                <li className="flex gap-6 group">
                  <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-surface-container-highest flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                    <span className="material-symbols-outlined text-primary">workspace_premium</span>
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-lg mb-2 group-hover:text-primary transition-colors duration-300">Conserjería Personalizada</h4>
                    <p className="text-on-surface-variant text-sm font-light">Desde la gestión del seguro hasta el servicio móvil en sitio, su experiencia se maneja con el máximo cuidado "guante blanco".</p>
                  </div>
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-surface-container-low relative overflow-hidden" id="reseñas">
        <div className="absolute top-8 right-8 pointer-events-none">
          <span className="font-headline text-[8rem] font-extrabold text-surface-container-high/50 leading-none select-none">02</span>
        </div>
        <div className="max-w-7xl mx-auto px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end gap-12 mb-16"
          >
            <div className="shrink-0">
              <h2 className="font-headline text-4xl font-extrabold tracking-tighter uppercase">Opiniones Elite</h2>
              <div className="flex items-center gap-3 mt-3">
                <div className="flex text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <span className="font-headline font-bold text-on-surface text-sm">4.9</span>
                <span className="font-label text-[11px] text-on-surface-variant tracking-wide">— Promedio de 120+ reseñas</span>
              </div>
            </div>
            <div className="h-[1px] flex-grow bg-outline-variant mb-2 hidden md:block"></div>
          </motion.div>
        </div>

        {/* Marquee carousel */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-surface-container-low to-transparent z-10 pointer-events-none"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-surface-container-low to-transparent z-10 pointer-events-none"></div>

          <div className="flex gap-6 animate-marquee">
            {[...Array(2)].map((_, setIndex) => (
              <div key={setIndex} className="flex gap-6 shrink-0">
                {[
                  { name: 'Carlos Rodríguez', role: 'Cliente Frecuente', text: '"La atención al detalle en el cambio del parabrisas de mi BMW fue impecable. Trabajo de nivel europeo."', stars: 5 },
                  { name: 'Laura Martínez', role: 'Diseñadora', text: '"El polarizado técnico que instalaron cambió por completo la temperatura del habitáculo. Increíble servicio."', stars: 5 },
                  { name: 'José González', role: 'Ingeniero', text: '"Me resolvieron un problema de cerradura que nadie podía arreglar. Verdaderos artesanos técnicos."', stars: 4 },
                  { name: 'Ana Pérez', role: 'Arquitecta', text: '"Rápido, limpio y profesional. Me sorprendió el nivel de orden del taller. 100% recomendado."', stars: 5 },
                  { name: 'Martín Suárez', role: 'Empresario', text: '"Gestionaron todo con mi seguro sin que yo tuviera que hacer nada. Servicio de primera clase absoluta."', stars: 5 },
                  { name: 'Sofía Colombo', role: 'Médica', text: '"El grabado de patentes fue rápido y prolijo. Se nota que trabajan con estándares altos."', stars: 5 },
                ].map((t) => (
                  <div
                    key={`${setIndex}-${t.name}`}
                    className="glass-panel p-8 flex flex-col justify-between min-h-[280px] w-[350px] shrink-0 relative overflow-hidden border-t-2 border-primary/30"
                  >
                    {/* Decorative quote */}
                    <span className="absolute -top-4 -right-2 font-headline text-[8rem] font-black text-primary/[0.07] leading-none select-none pointer-events-none">"</span>

                    <div className="relative z-10">
                      <div className="flex text-primary mb-6">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <span key={i} className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: `'FILL' ${i < t.stars ? 1 : 0}` }}>star</span>
                        ))}
                      </div>
                      <p className="font-body text-on-surface italic font-light leading-relaxed">{t.text}</p>
                    </div>
                    <div className="mt-8 relative z-10 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                        <span className="font-headline font-bold text-primary text-sm">{t.name.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-headline font-bold text-sm uppercase tracking-widest">{t.name}</p>
                        <p className="font-label text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">{t.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-surface" id="contacto">
        <div className="max-w-7xl mx-auto px-8 relative z-10">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8"
          >
            <h2 className="font-headline text-5xl font-extrabold tracking-tighter uppercase">Ubicación Estratégica</h2>
            <div className="font-headline text-8xl font-black text-surface-container-high opacity-10 leading-none select-none">03</div>
          </motion.div>

          {/* Info + Map */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="space-y-10"
            >
              {[
                { icon: 'location_on', title: 'Dirección', desc: 'Cerrito 2399, Lomas del Mirador\nBuenos Aires, Argentina' },
                { icon: 'call', title: 'Teléfono Directo', desc: '+54 9 11 5715 1222' },
                { icon: 'schedule', title: 'Horario Atelier', desc: 'Lunes a Viernes: 08:00 — 18:00\nSábados: 08:30 — 13:00' },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-6">
                  <span className="material-symbols-outlined text-primary p-3 bg-primary-container rounded-sm">{item.icon}</span>
                  <div>
                    <p className="font-headline font-bold text-xl">{item.title}</p>
                    <p className="font-body text-on-surface-variant font-light whitespace-pre-line">{item.desc}</p>
                  </div>
                </div>
              ))}
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="tel:+5491157151222"
                  className="flex-1 bg-primary text-on-primary px-8 py-4 rounded-sm font-headline font-extrabold uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 hover:scale-[1.02] transition-transform active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">call</span>
                  Llamar Ahora
                </a>
                <a
                  href="https://www.google.com/maps/dir//Cerrito+2399,+B1752+Lomas+del+Mirador,+Provincia+de+Buenos+Aires"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border border-outline-variant/40 text-on-surface px-8 py-4 rounded-sm font-headline font-extrabold uppercase text-sm tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-surface-container-low transition-all active:scale-95"
                >
                  <span className="material-symbols-outlined text-[20px]">directions</span>
                  Cómo Llegar
                </a>
              </div>
            </motion.div>

            {/* Map */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-[500px] w-full relative overflow-hidden rounded-sm"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.332303028212!2d-58.53678382343272!3d-34.67154216108151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc8e4d8542c55%3A0x62957f00d8b76543!2sCerrito%202399%2C%20B1752%20Lomas%20del%20Mirador%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1710892000000!5m2!1sen!2sar"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 grayscale contrast-125 brightness-75"
              ></iframe>
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay pointer-events-none"></div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                <div className="relative">
                  <div className="w-12 h-12 bg-primary/20 rounded-full animate-ping absolute"></div>
                  <div className="w-12 h-12 bg-primary/40 rounded-full flex items-center justify-center relative z-10">
                    <span className="material-symbols-outlined text-on-primary" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Booking Form */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16"
          >
            <div className="glass-panel p-8 md:p-12 rounded-sm">
              <h3 className="font-headline text-2xl font-bold tracking-tight mb-10 uppercase">Reservar Turno</h3>
              <form className="space-y-8" onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target as HTMLFormElement);
                const msg = `Hola, quiero reservar un turno.\n\nNombre: ${fd.get('nombre')}\nVehículo: ${fd.get('vehiculo')} (${fd.get('anio')})\nSeguro: ${fd.get('seguro') || 'No especificado'}\nServicio: ${selectedService || 'No especificado'}\nConsulta: ${fd.get('mensaje')}`;
                window.open(`https://wa.me/5491157151222?text=${encodeURIComponent(msg)}`, '_blank');
              }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <input name="nombre" className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-on-surface placeholder:text-placeholder outline-none" placeholder="Nombre completo" type="text" required />
                  <input name="vehiculo" className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-on-surface placeholder:text-placeholder outline-none" placeholder="Vehículo (Marca y Modelo)" type="text" required />
                  <input name="anio" className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-on-surface placeholder:text-placeholder outline-none" placeholder="Año" type="text" required />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <input name="seguro" className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-on-surface placeholder:text-placeholder outline-none" placeholder="Compañía de seguro (Opcional)" type="text" />
                  <Select
                    options={serviceOptions}
                    placeholder="Tipo de servicio"
                    value={selectedService}
                    onChange={setSelectedService}
                  />
                  <input name="mensaje" className="w-full bg-transparent border-0 border-b border-outline-variant/40 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-on-surface placeholder:text-placeholder outline-none" placeholder="¿En qué podemos ayudarte?" type="text" required />
                </div>
                <div className="flex justify-end pt-4">
                  <button className="group inline-flex items-center justify-center gap-4 px-12 py-5 bg-[#25D366] text-white rounded-sm font-headline font-extrabold uppercase text-sm tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 hover:shadow-[0_0_30px_rgba(37,211,102,0.3)]" type="submit">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    Reservar por WhatsApp
                  </button>
                </div>
              </form>
            </div>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low w-full py-20 px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-primary font-bold tracking-widest uppercase flex items-center gap-3">
            <img src="/logo.svg" alt="Parabrisas la Boutique" className="w-8 h-8" />
            Parabrisas la Boutique
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-body text-[13px] tracking-wide text-muted hover:text-primary transition-colors duration-300" href="#">Política de Privacidad</a>
            <a className="font-body text-[13px] tracking-wide text-muted hover:text-primary transition-colors duration-300" href="#">Términos de Servicio</a>
            <a className="font-body text-[13px] tracking-wide text-muted hover:text-primary transition-colors duration-300" href="#">Soporte WhatsApp</a>
            <a className="font-body text-[13px] tracking-wide text-muted hover:text-primary transition-colors duration-300" href="#">Guía de Mantenimiento</a>
          </div>
          <div className="font-body text-[13px] tracking-wide text-muted">
            © 2024 Parabrisas la Boutique. El Atelier de Precisión.
          </div>
        </div>
      </footer>

      {/* Chatbot Integration — disabled for now */}
    </div>
  );
}
