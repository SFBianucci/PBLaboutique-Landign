/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Chatbot } from './components/Chatbot';
import { Navbar } from './components/Navbar';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-background text-on-background font-body selection:bg-primary selection:text-on-primary">
      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0 hero-gradient opacity-60"></div>
        <div className="absolute inset-0">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.2 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center mix-blend-overlay"
          ></motion.div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-10 text-center">
          <motion.span 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="font-label text-primary uppercase tracking-[0.3em] text-xs mb-6 block"
          >
            El Atelier de Precisión
          </motion.span>
          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="font-headline text-5xl md:text-8xl font-extrabold tracking-tighter text-on-surface mb-8 leading-[0.9] text-glow"
          >
            CLARIDAD CRISTALINA.<br />SERVICIO DE PRECISIÓN.
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="font-body text-on-surface-variant max-w-2xl mx-auto text-lg mb-12 font-light leading-relaxed"
          >
            Elevando la restauración de cristales automotrices a un oficio de perfección técnica. No solo reparamos grietas; restauramos la integridad estructural de su vehículo.
          </motion.p>
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-6"
          >
            <button className="bg-primary text-on-primary px-10 py-4 font-bold uppercase tracking-widest text-xs rounded-full hover:shadow-[0_0_30px_rgba(161,211,165,0.4)] transition-all hover:scale-105 active:scale-95">
              Explorar Servicios
            </button>
            <button className="group flex items-center gap-3 text-on-surface font-bold uppercase tracking-widest text-xs transition-all hover:text-primary">
              Ver Nuestra Galería
              <div className="w-12 h-[1px] bg-primary group-hover:w-16 transition-all"></div>
            </button>
          </motion.div>
        </div>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="absolute bottom-10 left-10 hidden lg:block"
        >
          <div className="flex flex-col gap-4">
            <div className="h-1 w-1 bg-primary rounded-full"></div>
            <div className="h-1 w-1 bg-primary/40 rounded-full"></div>
            <div className="h-1 w-1 bg-primary/20 rounded-full"></div>
          </div>
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
                className="group relative p-10 bg-surface-container-low rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(161,211,165,0.05)] overflow-hidden flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-primary group-hover:h-full transition-all duration-500 rounded-full"></div>
                
                <div className="w-16 h-16 rounded-2xl bg-surface border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 relative z-10 shadow-lg">
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
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-white/5 shadow-2xl relative">
                <img alt="Primer plano de reparación de parabrisas" className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-700 hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDSH1eH9Cd_0wDqQ-275tKAFIH8vl4THr0LArhsmZh9JPVM1EHABjK0a2dubDJkYn5mxNF4lFHiKDQnh-uhA9sMTFFQ3lJsY2FlupK_to72Ex0AKv8nr5Y5JMrlFohhN8qiruORCo2m3ZpglD8WUFWabPDaqRLhJisa3bga4g1_1-D8J-pnS9GG7k1snDo82VHOYFSz4JrPX3lB-DG_3uZWnJsz6TLRU7oaGxZ7EimXxNfC5encGSeoVLp26AWRx3oNwrMc0ZjcUVc" />
                <div className="absolute inset-0 bg-gradient-to-t from-surface to-transparent opacity-60"></div>
                <div className="absolute bottom-8 left-8 right-8 p-6 glass-panel border-t border-white/10 rounded-2xl backdrop-blur-md">
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
      <section className="py-32 bg-surface" id="reseñas">
        <div className="max-w-7xl mx-auto px-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="font-headline text-4xl font-bold tracking-tight mb-4 uppercase">Voces de Confianza</h2>
            <div className="w-12 h-1 bg-primary mx-auto rounded-full"></div>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { name: 'Adrián Sterling', role: 'Coleccionista', text: '"El nivel de cuidado mostrado para el reemplazo del cristal de mi auto fue excepcional. Se nota que tratan cada vehículo como si fuera propio."', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCu47MxajQbHUO1dtTkCduXhyFTihyGsIxcDv4DefHGowaJ5n0z0lf7B_BCZkB-0E8YBckuRfgdmKCiJ1wwT3tj-hrdgEHIVCT1mjAJw6Ry9Ha8nHiYDrov7MvWXM-7EsLaKpi7rgkv8RD6UPCm6CcLeOWg0q3G2AoRqs9U-6DBKt-S7I0LupcaMTM58QZJw9T7VRFYAz0G0YlJrVzPGlq-ZSbQv1QpqslT1v34RBwgfx_-dZgf6pRpezVXb7c7ai-KeaqxCKu9_xk' },
              { name: 'Marcos Vane', role: 'Cliente Corporativo', text: '"Arreglaron las cerraduras y el levanta cristales de mi camioneta en tiempo récord. Un servicio técnico de primer nivel que recomiendo totalmente."', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMuZVf3pxyW8g9TA8gmAxCumBlvG2bLiB7D5KU4QWEenFX5-1mwGtEMjS3ILEKJM5lgeo9nbMJnIEKHbUrRSS8BVS2QVWzMyiFu6I_OQsZfnfjoKcH_P3WH66Lsmvmj93L7ZVkgYaaTh05GgGlLaAYa5biiYhoAfIiVBZmdpPwNib8_rfuaXR_WOEz4yMVFw6mtGMm8M5Lkbs_ODSUawhZ65Fde3KBttEyfmzpGh2t6SXAMFJbjzzkwB9pudtXD5GxI7JILlWjzvU' },
              { name: 'Elena Rossi', role: 'Dueña de SUV', text: '"El polarizado quedó perfecto y el grabado de cristales se hizo con mucha prolijidad. La atención al detalle es lo que los diferencia."', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCqL7lHLrPzJO1hSaHdLAPXaQCpJ_4jg92I9b9do0ADJf-tPFv-U1L0ajTzrQ1JGue5_CPQsk1w0_spLHILYboShiSjdfIDJxpkUFV5sCzsOVL-sSdPY_X17fPpC835hi3gfpUnBPp3VBfym2Gv5kWGfgRdB917fifZF8StQ-iwOyON82OIYJ0SocW-ZlD53EqiRCUdhFIMoI9MbMiGe5DjXIKnJi_Z0OSrzsjuJBrRUICbvsGLwqc5tTWvVN4Vt9DNN2qTuyG9ox4' },
            ].map((testimonial, index) => (
              <motion.div 
                key={testimonial.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-10 bg-surface-container-low rounded-3xl border border-white/5 hover:border-primary/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(161,211,165,0.05)] group"
              >
                <div className="flex text-primary mb-6">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-on-surface mb-8 italic font-light leading-relaxed">
                  {testimonial.text}
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-surface-container-highest overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors duration-300">
                    <img alt={`Avatar de ${testimonial.name}`} src={testimonial.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-headline font-bold text-sm">{testimonial.name}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact / Booking Section - Clean & Premium Redesign */}
      <section className="py-32 bg-[#050505] relative overflow-hidden" id="contacto">
        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
            
            {/* Info Column - Editorial Style */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="lg:col-span-5 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-5xl md:text-7xl font-headline font-light tracking-tighter mb-6">
                  Hablemos.
                </h2>
                <p className="text-neutral-400 font-body text-lg font-light max-w-md mb-16">
                  Estamos listos para devolverle la claridad y seguridad a tu vehículo. Escribinos y coordinamos tu turno.
                </p>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-headline uppercase tracking-[0.2em] text-neutral-500 mb-2">Ubicación</h4>
                  <p className="text-white font-body text-lg font-light">Cerrito 2399<br/>B1752 Lomas del Mirador<br/>Provincia de Buenos Aires</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-headline uppercase tracking-[0.2em] text-neutral-500 mb-2">Contacto</h4>
                  <p className="text-white font-body text-lg font-light">+54 9 11 5715 1222<br/>info@tallerparabrisas.com</p>
                </div>
                <div>
                  <h4 className="text-[10px] font-headline uppercase tracking-[0.2em] text-neutral-500 mb-2">Horarios</h4>
                  <p className="text-white font-body text-lg font-light">Lun a Vie: 08:00 - 12:00 / 14:00 - 18:00<br/>Sábados: 08:30 - 13:00</p>
                </div>
              </div>
            </motion.div>

            {/* Form Column - Minimalist */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-6 lg:col-start-7"
            >
              <form className="space-y-8" onSubmit={(e) => {
                e.preventDefault();
                window.open('https://wa.me/5491157151222', '_blank');
              }}>
                <div className="relative group">
                  <input className="w-full bg-transparent border-0 border-b border-white/20 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-white placeholder:text-neutral-600 outline-none" placeholder="Nombre completo" type="text" required />
                </div>
                
                <div className="relative group">
                  <input className="w-full bg-transparent border-0 border-b border-white/20 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-white placeholder:text-neutral-600 outline-none" placeholder="Compañía de seguro (Opcional)" type="text" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative group">
                    <input className="w-full bg-transparent border-0 border-b border-white/20 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-white placeholder:text-neutral-600 outline-none" placeholder="Vehículo (Marca y Modelo)" type="text" required />
                  </div>
                  <div className="relative group">
                    <input className="w-full bg-transparent border-0 border-b border-white/20 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-white placeholder:text-neutral-600 outline-none" placeholder="Año" type="text" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-[11px] font-headline uppercase tracking-widest text-white font-bold">Tipo de servicio</label>
                  <div className="relative">
                    <select defaultValue="" className="w-full bg-neutral-950/50 border border-white/10 rounded-xl px-4 py-3.5 focus:ring-1 focus:ring-primary focus:border-primary transition-all font-body text-sm text-white appearance-none cursor-pointer outline-none">
                      <option className="bg-neutral-900 text-white" value="" disabled hidden>Seleccioná el servicio</option>
                      <option className="bg-neutral-900 text-white" value="cristales">Cristales</option>
                      <option className="bg-neutral-900 text-white" value="cerraduras">Cerraduras</option>
                      <option className="bg-neutral-900 text-white" value="maquinas">Máquinas (Levanta vidrios)</option>
                      <option className="bg-neutral-900 text-white" value="polarizados">Polarizados</option>
                      <option className="bg-neutral-900 text-white" value="grabados">Grabados</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="relative group">
                  <textarea className="w-full bg-transparent border-0 border-b border-white/20 py-4 focus:ring-0 focus:border-primary transition-all font-body text-lg text-white placeholder:text-neutral-600 outline-none resize-none min-h-[120px]" placeholder="¿En qué podemos ayudarte?" required></textarea>
                </div>

                <div className="pt-8">
                  <button className="group relative inline-flex items-center justify-center gap-4 px-8 py-4 bg-white text-black rounded-full overflow-hidden font-headline font-bold uppercase tracking-widest text-xs transition-transform hover:scale-105 active:scale-95 w-full md:w-auto" type="submit">
                    <span className="relative z-10">Enviar por WhatsApp</span>
                    <span className="material-symbols-outlined relative z-10 text-[18px] group-hover:translate-x-1 transition-transform">arrow_forward</span>
                    <div className="absolute inset-0 bg-primary translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out"></div>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>

          {/* Minimalist Map */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-24 w-full h-[400px] rounded-3xl overflow-hidden relative group"
          >
            <div className="absolute inset-0 bg-black/20 pointer-events-none z-10 group-hover:bg-transparent transition-colors duration-500"></div>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3281.332303028212!2d-58.53678382343272!3d-34.67154216108151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bcc8e4d8542c55%3A0x62957f00d8b76543!2sCerrito%202399%2C%20B1752%20Lomas%20del%20Mirador%2C%20Provincia%20de%20Buenos%20Aires!5e0!3m2!1sen!2sar!4v1710892000000!5m2!1sen!2sar" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={false} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 grayscale contrast-125 opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
            ></iframe>
          </motion.div>

        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-950 w-full py-20 px-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-primary font-bold tracking-widest uppercase flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_10px_rgba(161,211,165,0.8)]"></div>
            </div>
            Parabrisas la Boutique
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="font-body text-[13px] tracking-wide text-neutral-500 hover:text-primary transition-colors duration-300" href="#">Política de Privacidad</a>
            <a className="font-body text-[13px] tracking-wide text-neutral-500 hover:text-primary transition-colors duration-300" href="#">Términos de Servicio</a>
            <a className="font-body text-[13px] tracking-wide text-neutral-500 hover:text-primary transition-colors duration-300" href="#">Soporte WhatsApp</a>
            <a className="font-body text-[13px] tracking-wide text-neutral-500 hover:text-primary transition-colors duration-300" href="#">Guía de Mantenimiento</a>
          </div>
          <div className="font-body text-[13px] tracking-wide text-neutral-500">
            © 2024 Parabrisas la Boutique. El Atelier de Precisión.
          </div>
        </div>
      </footer>

      {/* Chatbot Integration */}
      <Chatbot />
    </div>
  );
}
