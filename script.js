// Función para chequear si el ciclo general está aprobado (todos los ramos del ciclo general)
function cicloGeneralAprobado() {
  const idsGeneral = ['241', '242', '245', '246', '255', '256'];
  return idsGeneral.every(id => document.getElementById(id).classList.contains('aprobado'));
}

// Actualiza qué ramos se habilitan/deshabilitan según los requisitos
function actualizarEstado() {
  const aprobados = new Set(
    Array.from(document.querySelectorAll('.ramo.aprobado')).map(ramo => ramo.id)
  );

  document.querySelectorAll('.ramo').forEach(ramo => {
    if (ramo.classList.contains('aprobado')) {
      ramo.disabled = true;
      return;
    }

    const requisitosRaw = ramo.dataset.requisitos.trim();
    if (!requisitosRaw) {
      // Sin requisitos, siempre habilitado
      ramo.disabled = false;
      return;
    }

    const requisitos = requisitosRaw.split(',').map(r => r.trim());

    // El requisito especial "general" significa que hay que aprobar todo el ciclo general
    const desbloqueado = requisitos.every(req => {
      if (req === 'general') {
        return cicloGeneralAprobado();
      }
      return aprobados.has(req);
    });

    ramo.disabled = !desbloqueado;
  });
}

// Evento al hacer clic en un ramo
function clickRamo(event) {
  const ramo = event.currentTarget;
  if (ramo.disabled) return;

  ramo.classList.add('aprobado');
  ramo.disabled = true;
  actualizarEstado();
}

document.addEventListener('DOMContentLoaded', () => {
  // Al cargar la página, inicializamos el estado de los ramos
  actualizarEstado();

  // Agregar event listeners a todos los ramos
  document.querySelectorAll('.ramo').forEach(ramo => {
    ramo.addEventListener('click', clickRamo);
  });
});
