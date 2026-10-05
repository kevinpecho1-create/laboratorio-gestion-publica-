# Laboratorio de Gestión Pública del Perú

App web para el celular. Todos los archivos están en una sola carpeta para subirlos juntos a GitHub.

- `index.html`, `styles.css`, `app.js`: el funcionamiento de la app.
- `app.json`: módulos, temas, entidades y niveles.
- `casos.json`: casos reales con sus preguntas.
- `normativa.json`: normas y su estado de verificación.
- `sw.js`, `manifest.webmanifest`, `icon-*.png`, `icon.svg`: instalación en el celular y uso sin conexión.

## Subir desde el celular
1. Extrae el ZIP con la app Archivos.
2. En Chrome abre tu repositorio en github.com (menú del navegador, "Sitio para computadora").
3. Toca Add file, luego Upload files, luego Choose your files. Selecciona todos los archivos y toca Commit changes.
4. Ve a Settings, Pages, Deploy from a branch, rama main, carpeta / (root), Save.
5. En 1 o 2 minutos tu enlace es https://TU-USUARIO.github.io/laboratorio-gestion-publica/

## Actualizar contenido
Abre el archivo .json en GitHub, toca el lápiz, edita y toca Commit changes.
Si cambias app.js o styles.css, sube el número de VERSION en sw.js.

## Normativa
En normativa.json, cambia "pendiente" a "oficial" solo cuando hayas abierto el texto en un sitio oficial y confirmado que sigue vigente.
