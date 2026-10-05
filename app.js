(function () {
  'use strict';
  var RUTAS = ['inicio', 'aprender', 'simular', 'casos', 'progreso', 'normativa', 'examenes'];
  var TABS = [
    { id: 'inicio', nombre: 'Inicio', icono: '<path d="M3 11l9-8 9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>' },
    { id: 'aprender', nombre: 'Aprender', icono: '<path d="M4 4h12a3 3 0 0 1 3 3v13H7a3 3 0 0 1-3-3z"/><path d="M4 17a3 3 0 0 1 3-3h12"/>' },
    { id: 'simular', nombre: 'Simular', icono: '<path d="M9 3h6M10 3v6L4.5 19a1.5 1.5 0 0 0 1.3 2.2h12.4A1.5 1.5 0 0 0 19.5 19L14 9V3"/><path d="M7.5 15h9"/>' },
    { id: 'casos', nombre: 'Casos', icono: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>' },
    { id: 'progreso', nombre: 'Progreso', icono: '<path d="M5 20v-8M12 20V5M19 20v-5"/>' }
  ];
  var FLECHA = '<svg class="flecha" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>';

  var D = null, N = null, C = null;
  var modo = 'aprender';
  var actual = 'inicio';
  var filtro = 'todas';
  var respuestas = {};
  var vista = document.getElementById('vista');

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function leer(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
  function guardar(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function urlSegura(u) { return /^https:\/\//.test(u) ? esc(u) : '#'; }

  function cargarRespuestas() {
    try { respuestas = JSON.parse(leer('lgp-resp') || '{}') || {}; } catch (e) { respuestas = {}; }
  }
  function guardarRespuestas() { guardar('lgp-resp', JSON.stringify(respuestas)); }

  /* El avance por módulo se conectará en el Paso 10; por ahora comienza en cero. */
  function avance() { return 0; }

  function casoPorId(id) { return (C.casos || []).filter(function (c) { return c.id === id; })[0]; }
  function nivelPorId(id) { return D.niveles.filter(function (n) { return n.id === id; })[0]; }
  function contarRespondidas(c) { return Object.keys(respuestas[c.id] || {}).length; }
  function casosDeEntidad(nombre) { return C.casos.filter(function (c) { return c.entidad === nombre; }); }

  /* ---------- Inicio ---------- */
  function vistaInicio() {
    var m = D.modos.filter(function (x) { return x.id === modo; })[0] || D.modos[0];
    var seg = D.modos.map(function (x) {
      return '<button type="button" data-modo="' + esc(x.id) + '" aria-pressed="' + (x.id === modo) + '">' + esc(x.nombre) + '</button>';
    }).join('');
    var ciclo = D.ciclo.map(function (n, i) {
      return '<li><span class="mono">' + (i + 1) + '</span>' + esc(n) + '</li>';
    }).join('');
    var mods = D.modulos.map(function (x) {
      var p = avance(x.id);
      return '<a class="mod" href="#aprender"><div class="mod-head"><h3>' + esc(x.nombre) + '</h3><span class="mono">' + p + '%</span></div>' +
        '<p>' + esc(x.resumen) + '</p>' +
        '<div class="barra" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + p + '" aria-label="Avance en ' + esc(x.nombre) + '"><i style="width:' + p + '%"></i></div>' +
        '<p class="meta mono">' + x.temas.length + ' temas · sin iniciar</p></a>';
    }).join('');
    var otros = D.otrosModulos.map(function (n) { return '<a class="chip" href="#aprender">' + esc(n) + '</a>'; }).join('');
    var ents = D.entidades.map(function (n) {
      return '<a class="chip" href="#casos">' + esc(n) + '<b>' + casosDeEntidad(n).length + '</b></a>';
    }).join('');
    var niv = D.niveles.map(function (n) {
      return '<li><span class="pip t' + n.tono + '" aria-hidden="true"></span><div class="fila-txt"><strong>' + esc(n.nombre) + '</strong><span>' + esc(n.detalle) + '</span></div></li>';
    }).join('');

    return '' +
      '<section class="exp" aria-labelledby="h-exp">' +
        '<div class="exp-top"><span class="mono">EXPEDIENTE N.º 2026-001</span><span class="sello">En práctica</span></div>' +
        '<div class="exp-body">' +
          '<h1 id="h-exp">Practica la gestión pública peruana</h1>' +
          '<p class="lede">SIAF, SIGA y SEACE con casos de distintas entidades y normativa oficial.</p>' +
          '<div class="seg" role="group" aria-label="Modo de estudio">' + seg + '</div>' +
          '<p class="seg-detalle">' + esc(m.detalle) + '</p>' +
          '<a class="btn" href="#casos">Resolver un caso real</a>' +
        '</div>' +
      '</section>' +
      '<section aria-labelledby="h-ciclo"><h2 id="h-ciclo">Ciclo del gasto en el SIAF</h2>' +
        '<div class="ciclo-wrap"><ol class="ciclo">' + ciclo + '</ol></div>' +
        '<p class="nota">Cada etapa se registra en orden. Los casos te harán detectar cuando una operación se hizo en la etapa equivocada.</p></section>' +
      '<section aria-labelledby="h-mod"><h2 id="h-mod">Módulos</h2><div class="mods">' + mods + '</div></section>' +
      '<section aria-labelledby="h-otros"><h2 id="h-otros">Otras materias</h2><div class="chips">' + otros + '</div></section>' +
      '<section aria-labelledby="h-ent"><h2 id="h-ent">Casos reales por entidad</h2><div class="chips">' + ents + '</div></section>' +
      '<section aria-labelledby="h-niv"><h2 id="h-niv">Niveles de dificultad</h2><ul class="filas">' + niv + '</ul></section>' +
      '<section aria-labelledby="h-mas"><h2 id="h-mas">Más herramientas</h2><div class="filas">' +
        '<a href="#normativa"><div class="fila-txt"><strong>Normativa</strong><span>Normas con su estado de verificación</span></div>' + FLECHA + '</a>' +
        '<a href="#examenes"><div class="fila-txt"><strong>Exámenes</strong><span>Evaluaciones para medir tu avance</span></div>' + FLECHA + '</a>' +
      '</div></section>';
  }

  /* ---------- Casos ---------- */
  function vistaCasos() {
    var s = D.secciones.casos;
    var chips = '<button type="button" class="chip" data-filtro="todas" aria-pressed="' + (filtro === 'todas') + '">Todas<b>' + C.casos.length + '</b></button>' +
      D.entidades.map(function (n) {
        var k = casosDeEntidad(n).length;
        return '<button type="button" class="chip' + (k ? '' : ' vacio-chip') + '" data-filtro="' + esc(n) + '" aria-pressed="' + (filtro === n) + '">' + esc(n) + '<b>' + k + '</b></button>';
      }).join('');
    var lista = C.casos.filter(function (c) { return filtro === 'todas' || c.entidad === filtro; });
    var tarjetas = lista.length ? lista.map(function (c) {
      var nv = nivelPorId(c.nivel);
      var hechas = contarRespondidas(c);
      return '<a class="mod" href="#caso-' + esc(c.id) + '">' +
        '<div class="badges"><span class="badge"><span class="pip t' + (nv ? nv.tono : 1) + '" aria-hidden="true"></span>' + esc(nv ? nv.nombre : '') + '</span><span class="badge">' + esc(c.modulo) + '</span></div>' +
        '<h3 style="margin-top:10px">' + esc(c.titulo) + '</h3>' +
        '<p>' + esc(c.entidadNombre) + '</p>' +
        '<p class="meta mono">' + hechas + ' de ' + c.preguntas.length + ' preguntas · ' + esc(c.fuente.informe) + '</p></a>';
    }).join('') : '<p class="vacio">Todavía no hay casos reales para esta entidad. Se agregan en casos.json.</p>';

    return '<header class="sec-head"><span class="paso mono">' + esc(s.paso) + '</span><h1>' + esc(s.titulo) + '</h1><p class="lede">' + esc(s.texto) + '</p></header>' +
      '<p class="aviso">' + esc(C.aviso) + '</p>' +
      '<section aria-label="Filtrar por entidad"><h2>Entidad</h2><div class="chips">' + chips + '</div></section>' +
      '<section aria-label="Casos"><div class="mods">' + tarjetas + '</div></section>';
  }

  function vistaCaso(id) {
    var c = casoPorId(id);
    if (!c) return '<p class="vacio">No se encontró el caso.</p><a class="btn" href="#casos">Volver a casos</a>';
    var nv = nivelPorId(c.nivel);
    var r = respuestas[c.id] || {};
    var preguntas = c.preguntas.map(function (q, i) {
      var sel = r[i];
      var opts = q.opciones.map(function (o, j) {
        var cls = 'opcion';
        if (sel !== undefined) { if (j === q.correcta) cls += ' ok'; else if (j === sel) cls += ' mal'; }
        return '<button type="button" class="' + cls + '" data-caso="' + esc(c.id) + '" data-q="' + i + '" data-o="' + j + '"' + (sel !== undefined ? ' disabled' : '') + '>' + esc(o) + '</button>';
      }).join('');
      var res = sel === undefined ? '' :
        '<p class="resultado"><span class="pip ' + (sel === q.correcta ? 't1' : 't4') + '" aria-hidden="true"></span><span><strong>' +
        (sel === q.correcta ? 'Correcto.' : 'No es esa.') + '</strong> ' + esc(q.explicacion) + '</span></p>';
      return '<div class="pregunta"><span class="num">PREGUNTA ' + (i + 1) + ' DE ' + c.preguntas.length + '</span><h3>' + esc(q.texto) + '</h3><div class="opciones">' + opts + '</div>' + res + '</div>';
    }).join('');
    var puntos = function (arr) { return '<ul class="puntos">' + arr.map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('') + '</ul>'; };

    return '<a class="volver" href="#casos">‹ Casos</a>' +
      '<header class="sec-head"><div class="badges"><span class="badge"><span class="pip t' + (nv ? nv.tono : 1) + '" aria-hidden="true"></span>' + esc(nv ? nv.nombre : '') + '</span>' +
      '<span class="badge">' + esc(c.modulo) + '</span><span class="badge">' + esc(c.entidad) + '</span></div>' +
      '<h1>' + esc(c.titulo) + '</h1><p class="lede">' + esc(c.entidadNombre) + '</p></header>' +
      '<section class="bloque"><span class="sub">Hechos del informe</span>' + puntos(c.hechos) + '</section>' +
      '<section class="bloque"><span class="sub">Documentos del expediente</span>' + puntos(c.documentos) + '</section>' +
      '<section class="bloque"><span class="sub">Fundamento normativo</span>' + puntos(c.normas) +
        '<p class="fuente-txt">' + esc(c.regimen) + '</p></section>' +
      '<section aria-label="Preguntas" class="mods">' + preguntas + '</section>' +
      '<section class="bloque"><span class="sub">Fuente</span><p><strong>' + esc(c.fuente.informe) + '</strong></p>' +
        '<p class="fuente-txt">' + esc(c.fuente.entidad) + '</p>' +
        '<p style="margin-top:10px"><a class="enlace" href="' + urlSegura(c.fuente.url) + '" target="_blank" rel="noopener noreferrer">Abrir el informe original</a></p></section>' +
      (Object.keys(r).length ? '<button type="button" class="btn sec" data-reiniciar="' + esc(c.id) + '">Reiniciar este caso</button>' : '');
  }

  /* ---------- Normativa ---------- */
  function vistaNormativa() {
    var s = D.secciones.normativa;
    var tono = { oficial: 't1', secundaria: 't3', pendiente: 't4' };
    var items = N.normas.map(function (n) {
      return '<div class="bloque"><span class="badge" style="margin-bottom:10px"><span class="pip ' + (tono[n.verificacion] || 't4') + '" aria-hidden="true"></span>' + esc(N.verificacion[n.verificacion] || '') + '</span>' +
        '<p><strong>' + esc(n.nombre) + '</strong></p>' +
        '<p class="fuente-txt">' + esc(n.materia) + '. ' + esc(n.nota) + '</p>' +
        (n.url ? '<p style="margin-top:10px"><a class="enlace" href="' + urlSegura(n.url) + '" target="_blank" rel="noopener noreferrer">Abrir fuente</a></p>' : '') + '</div>';
    }).join('');
    return '<header class="sec-head"><span class="paso mono">' + esc(s.paso) + '</span><h1>' + esc(s.titulo) + '</h1><p class="lede">' + esc(s.texto) + '</p></header>' +
      '<p class="aviso">' + esc(N.aviso) + '</p>' +
      '<section aria-label="Normas" class="mods">' + items + '</section>';
  }

  /* ---------- Otras secciones ---------- */
  function itemsDe(k) {
    if (k === 'aprender') {
      return D.modulos.map(function (x) { return { nombre: x.nombre, detalle: x.resumen, der: x.temas.length + ' temas' }; })
        .concat(D.otrosModulos.map(function (n) { return { nombre: n }; }));
    }
    if (k === 'progreso') {
      var hechas = 0, total = 0;
      C.casos.forEach(function (c) { hechas += contarRespondidas(c); total += c.preguntas.length; });
      return D.modulos.map(function (x) { return { nombre: x.nombre, detalle: 'Sin iniciar', der: avance(x.id) + '%' }; })
        .concat([{ nombre: 'Preguntas de casos reales', detalle: 'Respondidas en este dispositivo', der: hechas + ' de ' + total }]);
    }
    return D.secciones[k].items || [];
  }

  function vistaSeccion(k) {
    var s = D.secciones[k];
    var items = itemsDe(k);
    var cuerpo = items.length
      ? '<ul class="filas">' + items.map(function (it) {
          return '<li><div class="fila-txt"><strong>' + esc(it.nombre) + '</strong>' + (it.detalle ? '<span>' + esc(it.detalle) + '</span>' : '') + '</div>' +
            (it.der ? '<span class="fila-der mono">' + esc(it.der) + '</span>' : '') + '</li>';
        }).join('') + '</ul>'
      : '<p class="vacio">Esta sección aún no tiene contenido.</p>';
    return '<header class="sec-head"><span class="paso mono">' + esc(s.paso) + '</span><h1>' + esc(s.titulo) + '</h1><p class="lede">' + esc(s.texto) + '</p></header>' +
      '<section aria-label="Contenido previsto"><h2>Contenido previsto</h2>' + cuerpo + '</section>' +
      '<a class="btn" href="#inicio">Volver al inicio</a>';
  }

  function pestanaActiva() {
    return actual.indexOf('caso-') === 0 ? 'casos' : actual;
  }
  function pintarTabs() {
    var activa = pestanaActiva();
    document.getElementById('tabs').innerHTML = TABS.map(function (t) {
      var on = t.id === activa;
      return '<li><a href="#' + t.id + '"' + (on ? ' aria-current="page"' : '') + '>' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + t.icono + '</svg>' +
        '<span>' + t.nombre + '</span></a></li>';
    }).join('');
  }

  function pintar() {
    if (!D || !N || !C) return;
    var html;
    if (actual === 'inicio') html = vistaInicio();
    else if (actual === 'casos') html = vistaCasos();
    else if (actual.indexOf('caso-') === 0) html = vistaCaso(actual.slice(5));
    else if (actual === 'normativa') html = vistaNormativa();
    else html = vistaSeccion(actual);
    vista.innerHTML = html;
    pintarTabs();
  }

  function ir(k) {
    actual = (RUTAS.indexOf(k) >= 0 || k.indexOf('caso-') === 0) ? k : 'inicio';
    pintar();
    window.scrollTo(0, 0);
    try { history.replaceState(null, '', '#' + actual); } catch (e) {}
  }

  document.addEventListener('click', function (e) {
    var t = e.target;
    if (!t.closest) return;
    var a = t.closest('a[href^="#"]');
    if (a) { e.preventDefault(); ir(a.getAttribute('href').slice(1)); return; }
    var b = t.closest('button[data-modo]');
    if (b) { modo = b.getAttribute('data-modo'); guardar('lgp-modo', modo); pintar(); return; }
    var f = t.closest('button[data-filtro]');
    if (f) { filtro = f.getAttribute('data-filtro'); pintar(); return; }
    var o = t.closest('button[data-caso]');
    if (o) {
      var id = o.getAttribute('data-caso');
      respuestas[id] = respuestas[id] || {};
      respuestas[id][o.getAttribute('data-q')] = Number(o.getAttribute('data-o'));
      guardarRespuestas();
      pintar();
      return;
    }
    var r = t.closest('button[data-reiniciar]');
    if (r) { delete respuestas[r.getAttribute('data-reiniciar')]; guardarRespuestas(); pintar(); window.scrollTo(0, 0); }
  });
  window.addEventListener('hashchange', function () { ir((location.hash || '#inicio').slice(1)); });

  document.getElementById('tema').addEventListener('click', function () {
    var r = document.documentElement;
    var oscuro = r.getAttribute('data-theme') === 'dark' ||
      (!r.getAttribute('data-theme') && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
    var nuevo = oscuro ? 'light' : 'dark';
    r.setAttribute('data-theme', nuevo);
    guardar('lgp-tema', nuevo);
  });

  var tema = leer('lgp-tema');
  if (tema === 'light' || tema === 'dark') document.documentElement.setAttribute('data-theme', tema);
  var m = leer('lgp-modo');
  if (m === 'aprender' || m === 'practicar' || m === 'simulacion') modo = m;
  cargarRespuestas();

  function json(ruta) {
    return fetch(ruta).then(function (r) { if (!r.ok) throw new Error(ruta + ' ' + r.status); return r.json(); });
  }
  Promise.all([json('app.json'), json('normativa.json'), json('casos.json')])
    .then(function (r) { D = r[0]; N = r[1]; C = r[2]; ir((location.hash || '#inicio').slice(1)); })
    .catch(function () {
      vista.innerHTML = '<p class="vacio">No se pudo cargar el contenido. Revisa tu conexión y vuelve a abrir la página. Si acabas de editar un archivo .json, revisa que el JSON no tenga comas de más.</p>';
    });

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    try { navigator.serviceWorker.register('sw.js').catch(function () {}); } catch (e) {}
  }
})();
