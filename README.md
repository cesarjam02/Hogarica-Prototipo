# Hogarica Studio 3D

Prototipo frontend de personalización de cocinas con Three.js. No requiere backend, compilación ni servicios de reconstrucción.

## Abrir

Con Apache de XAMPP activo: http://localhost/HogaricaPrototipo/ . También puedes ejecutar `python -m http.server 8080` y abrir http://localhost:8080 . No abrir mediante `file://`: los módulos necesitan HTTP.

Three.js está fijado a la versión 0.160.1 y se descarga desde CDN, por lo que requiere Internet.

## Fotografías de prueba

El botón **Seleccionar fotografía** abre un catálogo propio. Solo muestra las fotografías registradas en `src/data/photo-presets.js`, sin abrir el explorador del equipo ni aceptar archivos arbitrarios.

Actualmente hay tres fotografías disponibles. La primera es `src/images/test.jpg`. Su escena está preparada específicamente a partir de la imagen: muebles blancos en L, isla con placa de cocina, ventana alta, horno lateral, estantes abiertos, estructura suspendida con utensilios, vigas y piso decorado. La geometría es una aproximación visual con medidas estimadas; no es una reconstrucción automática.

La segunda, `src/images/test2.jpg`, abre una cocina clásica lineal: madera castaño con molduras oscuras, vitrinas superiores, mosaico ocre, estufa blanca central, campana, microondas y refrigerador a la derecha. Ambas escenas admiten cambios de materiales y edición de gabinetes.

La tercera, `src/images/test3.jfif`, abre una cocina compacta con dos frentes, paredes de madera, estufa lateral y campana blanca, refrigerador oscuro, mueble blanco, puerta trasera y pequeños electrodomésticos. Los acabados y registros de las dos primeras fotografías se conservan.

Para presentar la demo:

1. Pulsar Seleccionar fotografía y elegir Cocina rústica con isla.
2. Pulsar Ver esta cocina en 3D.
3. Comparar la escena con la foto original visible en el visor.
4. Personalizar colores, puertas, encimera, piso, salpicadero y tiradores.
5. Añadir o mover gabinetes en Distribución, explorar cámaras y guardar el proyecto.

La foto se sirve desde el propio proyecto. El JSON conserva el identificador de su escena y las modificaciones; al importarlo se recuperan también el modelo y la foto de referencia. Deshacer/rehacer admite cambios entre el modelo general y la cocina de referencia.

## Añadir más fotografías

1. Colocar sus imágenes en `src/images/`.
2. Registrar cada fotografía con un identificador, nombre, ruta y acabados iniciales en `src/data/photo-presets.js`.
3. Preparar su geometría en un módulo de `src/scene/` y asociarla al identificador en `rebuildScene()` de `src/scene/kitchen.js`.

La galería se genera desde ese catálogo. Copiar una imagen a la carpeta no crea una escena: cada prueba necesita su modelo preparado. El catálogo está pensado para las 2 o 3 fotografías de la propuesta.

## Organización

- `index.html`: estructura de la aplicación e importmap.
- `styles/app.css`: apariencia y adaptación a móviles.
- `src/main.js`: arranque y manejo de fallos de carga.
- `src/data/catalog.js`: materiales y colores.
- `src/data/photo-presets.js`: fotografías aprobadas y configuración de su escena.
- `src/state/`: estado del diseño y validación de importaciones.
- `src/scene/kitchen.js`: motor, selección, cámaras y coordinación de escenas.
- `src/scene/rustic-kitchen.js`: geometría preparada desde test.jpg.
- `src/scene/classic-kitchen.js`: geometría preparada desde test2.jpg.
- `src/scene/compact-kitchen.js`: geometría preparada desde test3.jfif.
- `src/ui/photo-flow.js`: selector de fotografías y recorrido inicial.
- `src/ui/configurator.js`: paneles, historial e importación.
- `src/ui/layout-panel.js`: colocación de gabinetes.
- `src/services/files.js`: exportación JSON, captura y solicitud TXT.
- `tests/`: validación del formato y registro de la fotografía.

## Verificación

Ejecutar `npm test` y `npm run check` con Node.js. Se verificó también en navegador la galería, selección de las tres fotografías, apertura de sus modelos, cambio de encimera y adición/retiro de gabinetes.

## Alcance

Solo frontend. La geometría está preparada a mano para las fotos de prueba. Los objetos se mueven libremente, sin detección de colisiones ni medidas verificadas. La encimera de los gabinetes de esta escena se mueve con ellos; el fregadero y los electrodomésticos permanecen fijos. No se calculan precios ni se envían solicitudes: la cotización descarga un TXT.

## Propuestas de remodelación

Cada fotografía conserva su modelo original y añade tres propuestas editables:

| Cocina | Propuesta 1 | Propuesta 2 | Propuesta 3 |
| --- | --- | --- | --- |
| Rústica con isla | Natural luminoso | Arena minimal | Azul sofisticado |
| Clásica de madera | Nórdica cálida | Verde urbano | Grafito elegante |
| Compacta de madera | Compacta luminosa | Salvia funcional | Contraste moderno |

Después de abrir una fotografía, el panel Remodelar mi cocina muestra las tres opciones, su paleta y las mejoras sugeridas. Aplicar una propuesta actualiza el modelo, no solo el texto del panel: cambia frentes, materiales y herrajes; según la cocina, incorpora almacenamiento cerrado, cajones, colgantes, iluminación de trabajo, revestimientos claros o encimeras despejadas.

Los botones Original y Remodelación del visor permiten comparar y recuperar la última propuesta con sus ajustes durante la sesión. El cambio también admite deshacer y rehacer. Cada propuesta empieza desde la distribución original de su fotografía; después se pueden editar los acabados y la posición de los muebles. El JSON conserva `renovationId`, materiales y personalizaciones. Los archivos anteriores siguen siendo compatibles y se interpretan como diseños sin propuesta seleccionada. La solicitud TXT incluye el nombre de la remodelación.

- `src/data/renovations.js`: nueve conceptos, mejoras y funciones para crear un diseño original o renovado sin modificar el catálogo.
- `src/ui/renovations-panel.js`: tarjetas de propuestas.
- `src/scene/renovation-upgrades.js`: almacenamiento, herrajes, cajones, luces y elementos decorativos del modelo renovado.
- `tests/renovations.test.js`: nueve propuestas válidas, recuperación del original y compatibilidad de archivos.

Las combinaciones estéticas son propuestas propias para esta demo. Los criterios de luz bajo gabinetes y encimeras se apoyan en [ideas de iluminación de IKEA](https://www.ikea.com/gb/en/rooms/kitchen/how-to/how-to-set-up-your-kitchen-lighting-pubc94e8510/). No hay precios ni modelos comerciales asociados.

Validación: las nueve propuestas se abrieron en el navegador y se comprobó el cambio entre Original y Remodelación. Las medidas y las nuevas posiciones siguen siendo conceptuales.

## Rediseños completos de mobiliario e iluminación

Las nueve remodelaciones ahora usan escenas de mobiliario independientes del modelo original. No reutilizan una misma distribución con distintas paletas:

| Fotografía | Opción | Cambio principal | Iluminación |
| --- | --- | --- | --- |
| test.jpg | Natural luminoso | Isla con desayunador circular y dos asientos | Globos y estantes LED |
| test.jpg | Arena minimal | Península conectada con torre y almacenamiento alto | Suspensión lineal y zócalos LED |
| test.jpg | Azul sofisticado | Isla social en cascada, tres taburetes y vitrina | Tres aros suspendidos y vitrina LED |
| test2.jpg | Nórdica cálida | Retorno en L con barra y estantes abiertos | Dos conos y estantes iluminados |
| test2.jpg | Verde urbano | Isla independiente con fregadero y torre de hornos | Tres globos y luz de trabajo |
| test2.jpg | Grafito elegante | Dos vitrinas, torres y barra de café lateral | Riel de focos y vitrinas LED |
| test3.jfif | Compacta luminosa | Un frente de trabajo, barra flotante y espejo | Lámpara lineal transversal y LED |
| test3.jfif | Salvia funcional | Dos frentes, despensa y nicho para café | Dos colgantes cónicos y estantes LED |
| test3.jfif | Contraste moderno | Estación en L, horno vertical y aparador estrecho | Riel de tres focos y vitrina LED |

Las tarjetas muestran esquemas de distribución y los puntos de luz. Los originales siguen en sus módulos, conservan sus identificadores y se recuperan con Original. Los acabados e identificadores de las propuestas siguen siendo compatibles con el JSON. Las nuevas distribuciones son conceptos de presentación, con dimensiones aproximadas; no representan un proyecto ejecutable.

`src/scene/remodeled-kitchen.js` construye las alternativas completas y sus luces reales, muebles editables, aparatos, asientos, vitrinas y espejo. `src/data/remodeling-plans.js` contiene sus identidades, esquemas y encuadres. El módulo anterior `renovation-upgrades.js` se conserva como referencia de la primera iteración y ya no participa en el renderizado.

## Publicación en GitHub Pages

Este frontend funciona como sitio estático, sin instalar dependencias ni ejecutar un build. El repositorio contiene `index.html` en su raíz, rutas relativas para módulos y fotografías, y `.nojekyll` para servir los archivos directamente.

En GitHub, seleccionar Settings → Pages → Deploy from a branch → main → /(root). Los cambios futuros enviados a main se publicarán en la misma dirección. Three.js se carga desde su CDN mediante HTTPS y requiere conexión a Internet.

Configuración: [documentación de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
