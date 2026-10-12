---
name: pdfstruct
description: >
    Extrae el contenido de uno o varios PDF bajo Docs/ o Data/ y produce un
    Markdown final por cada PDF, con extracción completa o dirigida por un
    objetivo explícito del usuario.
metadata:
    author: BPK
    version: "0.9"
    short-description: Convierte cada PDF en un Markdown fiel y estructurado.
    triggers: [procesar pdf, extraer pdf, convertir pdf a markdown, pdfstruct]
policy: implicit
dependencies:
    tools: [process_pdf]
---

# PDFSTRUCT

## Alcance de esta skill

Esta skill representa la ruta protegida de Cuy. Se invoca cuando el usuario
escribe `/pdfstruct`, pide explícitamente usar `pdfstruct` o solicita una
reparación/conversión bajo ese método. Una solicitud genérica de procesar un
PDF usa primero la ruta Hermes/Python de `process_pdf` y solo cae aquí si esa
ruta no puede producir un resultado válido. En ambos casos `process_pdf`
mantiene el mismo contrato: un Markdown durable por PDF, fuente intacta y
manifiesto trazable.

## Principio de trabajo

`pdfstruct` no se usa con una receta única para todos los documentos. Antes de
decidir cómo tratar un PDF, `process_pdf` debe dejar que pdfstruct construya su
inspección y su MetaDocumento. La estrategia se elige a partir de señales del
documento: texto digital aprovechable, orden de lectura, columnas, tablas,
gráficos, imágenes informativas, páginas escaneadas, densidad visual y páginas
que no producen contenido suficiente.

La decisión es documental, no una selección manual de modos técnicos:

| Señales observadas | Tratamiento que debe usar pdfstruct |
| --- | --- |
| Texto digital legible, ordenado y sin regiones visuales relevantes | Conservar la extracción textual base. |
| Tablas, gráficos o regiones informativas localizadas | Mantener el texto base y reparar únicamente esas regiones con visión. |
| Documento mixto con texto normal y páginas visuales o escaneadas | Combinar extracción textual con visión solo en las páginas necesarias. |
| Página escaneada, multicolumna desordenada o visualmente densa | Reconstruir la página completa con visión/OCR. |
| Usuario solicita campos, relaciones o estructuras concretas | Usar extracción guiada con el objetivo literal del usuario. |

El agente no inventa un parser, no ejecuta subcomandos directamente y no fuerza
visión sobre todo el documento. Invoca `process_pdf`, que aplica esta decisión
por cada PDF y devuelve la estrategia elegida en su resultado. La estrategia
puede ser distinta para dos documentos del mismo lote.

Para una conversión completa, `process_pdf` usa primero el planificador real de
`pdfstruct` mediante `auto --mode auto`. Ese planificador perfila el PDF por
página y puede ejecutar MetaDoc, Mixed o Hard: MetaDoc conserva texto y
geometría nativos; Mixed combina estructura nativa, PP-OCRv5 y visión selectiva;
Hard reconstruye el rango completo cuando el documento lo exige. Después
`process_pdf` usa el `quality.json` y el MetaDocumento producidos por
`pdfstruct` para decidir si necesita `repair-pages` sobre regiones o páginas
concretas. La operación `extract` no es la ruta primaria: solo es respaldo si
la pasada adaptativa no entrega un Markdown. No se acepta una extracción nativa
solo porque contenga muchos caracteres.

Usa `process_pdf` para convertir cada PDF ubicado bajo `Docs/` o `Data/` en su
correspondiente Markdown final. Si el usuario no especifica una ruta, procesa
recursivamente `Docs/` y todas sus subcarpetas. Si indica un PDF o una carpeta
bajo `Docs/` o `Data/`, limita el procesamiento a ese archivo o a esa carpeta y
sus subcarpetas.

## Un documento

Cuando el usuario indique un PDF, invoca una sola vez `process_pdf` con
`inputPath`. Si solicita otro nombre o ubicación, usa también `outputPath`.
Deja que la herramienta ejecute este flujo completo:

1. Inspeccionar rápidamente el PDF: páginas, metadatos y tipo de documento.
2. Extraer una base adaptativa y construir un MetaDocumento compuesto por
   MetaPáginas, que conserva la organización y la evidencia disponible de cada
   página.
3. Tratar cada página según su contenido:
   - conservar el texto digital normal;
   - usar visión para tablas y gráficos;
   - usar visión para imágenes que aportan información documental;
   - usar lectura visual para páginas escaneadas o ilegibles;
   - ignorar portadas decorativas, fondos, logotipos y adornos.
4. Ensamblar un único Markdown respetando el orden de las páginas.
5. Comprobar de forma determinista el resultado: existencia de contenido,
   límites de página cuando estén disponibles, orden de lectura y señales de
   estructura perdida.
6. Si existen páginas problemáticas, volver únicamente a la evidencia que lo
   necesita: reparar de forma localizada tablas, gráficos, imágenes
   informativas o fragmentos de texto; reconstruir integralmente una página
   cuando sea escaneada, visualmente densa o no tenga estructura aprovechable;
   y encadenar ambas acciones sobre el MetaDocumento actualizado cuando el
   documento lo requiera.
7. Validar que exista contenido, contrastar el número de páginas cuando sea
   posible y conservar la máxima consistencia textual y estructural alcanzable
   con las salidas de pdfstruct.

## Calidad de lectura

La existencia de texto y el número correcto de páginas no bastan para
considerar correcta una extracción. Revisa también, página por página:

- que el orden de lectura sea natural y que las columnas no estén mezcladas;
- que cada encabezado pertenezca al contenido que le sigue;
- que una página no combine accidentalmente varias normas o documentos;
- que tablas, gráficos y listas conserven su estructura, etiquetas, cifras y
  unidades;
- que el Markdown sea comprensible para una persona, no solo texto presente.

Si una página tiene mucho texto pero su orden, estructura o legibilidad son
dudosos, trátala como problemática y vuelve a analizarla. Usa reparación
regional para tablas, gráficos o fragmentos localizados. Usa reconstrucción de
página completa cuando el problema sea el orden de varias columnas, una página
escaneada o una página visualmente densa. Conserva todo el contenido
documental sustentado por el PDF y no bloquees el documento completo por una
parte difícil: si una fuente no puede producir su Markdown, devuelve un error
concreto asociado a esa fuente y continúa con las demás.

Cada PDF produce un único archivo Markdown con el mismo nombre base que la
fuente, salvo que el usuario indique otro nombre o ubicación. Aplica el mejor
tratamiento disponible según el contenido de cada página para obtener la
máxima consistencia textual y estructural posible.

## Extracción dirigida

Cuando el usuario solicite obtener campos, relaciones o estructuras concretas
de un PDF o una carpeta, pasa esa solicitud como `extractionGoal` y conserva
`inputPath` como selector independiente de la fuente. La fuente puede ser un
archivo o una carpeta. Por ejemplo, una solicitud para obtener país, médicos y
enfermeras de `Data/Perfil/documento.pdf` usa:

```json
{
  "inputPath": "Data/Perfil/documento.pdf",
  "extractionGoal": "Obtener país y datos de médicos y enfermeras"
}
```

La extracción dirigida usa visión para recuperar únicamente la información
solicitada y mantiene sustento en el PDF. No agregues `extractionGoal` cuando el
usuario haya pedido una conversión completa sin un objetivo informativo
específico. No conviertas el objetivo en un selector técnico ni intentes elegir
modos internos de pdfstruct.

## Varios documentos

Cuando el usuario no indique una ruta, invoca `process_pdf` sin `inputPath` para
procesar `Docs/` recursivamente. Cuando indique una carpeta o solicite un lote
concreto, invoca `process_pdf` una sola vez sobre esa carpeta. La herramienta
aplica independientemente el flujo anterior a cada PDF y produce un Markdown
final por cada uno. Los PDF
ubicados directamente en `Docs/` producen un archivo adyacente con el mismo
nombre base, por ejemplo `Docs/documento.pdf` produce `Docs/documento.md`.
Para varios PDF indicados explícitamente, invoca `process_pdf` una vez por cada
archivo y guarda cada Markdown junto a su PDF. Para los PDF organizados en
carpetas, guarda los resultados en una carpeta paralela destinada a Markdown y
conserva la estructura de subcarpetas. Por ejemplo,
`Docs/PdfDocumentos/Subcarpeta/documento.pdf` produce
`Docs/MdDocumentos/Subcarpeta/documento.md`. Un nombre o destino solicitado
explícitamente tiene prioridad.

## Reglas

- Nunca modificar ni borrar los PDF fuente.
- Las extracciones preliminares, imágenes renderizadas y correcciones parciales
  se usan temporalmente durante el procesamiento y después se eliminan. Solo
  permanece el Markdown final, a menos que el usuario solicite explícitamente
  conservar los archivos intermedios; en ese caso usa `keepIntermediates: true`.
- No completar con el LLM contenido que no esté sustentado por el PDF.
- Informar la ruta de cada Markdown producido.
- Actualizar `Docs/.pdfstruct-manifest.json` con la trazabilidad de cada PDF
  procesado (hashes, estado, opciones) para que `/build-okf` pueda reutilizar
  la extracción gobernada.
- Cada PDF debe terminar con uno de dos resultados explícitos: un único
  Markdown final, o un error concreto asociado al PDF y a la ruta de Markdown
  esperada. No dejar fuentes sin resultado, no ocultar fallos y no considerar
  exitoso un lote que tenga errores sin informarlos.
- Si un PDF no puede procesarse, informar el error concreto; los demás PDF del
  lote conservan su propio flujo independiente.
