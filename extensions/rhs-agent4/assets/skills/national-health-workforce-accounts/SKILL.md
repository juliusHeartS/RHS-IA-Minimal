---
name: national-health-workforce-accounts
modeSlugs: [ask]
policy: implicit
description: Usa el marco y los datos institucionales de Cuentas Nacionales del Personal de Salud de la OPS para responder preguntas conceptuales o realizar cálculos reproducibles nacionales y subnacionales. Actívala ante solicitudes sobre CNPS, NHWA, stock, densidad, distribución o perfiles del personal de salud.
license: Apache-2.0
dependencies:
  tools: [document_search, load_institutional_data, execute_code]
metadata:
  author: RHS-Agent
  version: "1.0"
  short-description: Consulta y analiza las Cuentas Nacionales del Personal de Salud de la OPS.
  triggers: [CNPS, NHWA, cuentas nacionales, personal de salud, fuerza laboral en salud, stock nacional, stock subnacional]
---

# Cuentas Nacionales del Personal de Salud

Usa el conocimiento institucional de la OPS como marco principal. El OKF y RAG
globales explican conceptos, metodología y procedencia; el OKF y RAG locales
aportan el contexto del proyecto. Consulta ambas capas cuando sean pertinentes.

## Ruta obligatoria

1. Para una pregunta conceptual, usa `document_search` y recupera solamente la
   evidencia pertinente. No cargues datasets si no se requieren cálculos.
2. Para calcular cifras, comparar territorios, perfilar variables o construir
   modelos con CNPS/NHWA, invoca `load_institutional_data` con
   `collection: "paho_nhwa"`. Usa `scope: "all"` salvo que una parte concreta
   sea suficiente.
3. El objeto estable de sesión es `cnps_ops`:
   - R: `cnps_ops$stock_nacional`, `cnps_ops$stock_subnacional`,
     `cnps_ops$catalogo_sistemas` y `cnps_ops$metadatos`.
   - Python: `cnps_ops["stock_nacional"]`,
     `cnps_ops["stock_subnacional"]`, `cnps_ops["catalogo_sistemas"]` y
     `cnps_ops["metadatos"]`.
4. Después usa `execute_code` en la misma sesión para inspeccionar variables,
   filtrar, calcular, modelar o graficar. No reconstruyas rutas hacia los
   archivos empaquetados ni vuelvas a cargar componentes cuyo hash ya coincide.
5. Respeta el lenguaje solicitado por el usuario. Si no lo indica, utiliza el
   lenguaje de la sesión foreground; si no existe una sesión compatible, usa R.

## Reglas de evidencia

- Haz los cálculos con los datasets originales cargados en `cnps_ops`; una ficha
  OKF o un fragmento RAG no sustituye los datos.
- Trata los datos institucionales empaquetados como solo lectura. Guarda tablas,
  gráficos y demás derivados dentro del proyecto.
- Verifica nombres, códigos, años, cobertura y unidades antes de interpretar.
  No infieras el nombre de un territorio desde el orden de sus códigos.
- Cuando cruces CNPS/NHWA con `Data/`, documenta llaves, filtros, supuestos,
  incompatibilidades temporales y transformaciones.
- En la respuesta para planificadores cita el nombre humano del documento o
  dataset utilizado. Conserva hashes, rutas internas y conceptos técnicos para
  la trazabilidad interna, no como ruido en la respuesta final.
