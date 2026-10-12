---
type: BaseDatos
title: Dataset NHWA Subnacional — Stock desagregado a nivel provincial
description: Estructura y contenido del CSV con datos de stock de personal de salud desagregados a nivel subnacional (14 países, 266 unidades territoriales, 2017-2024, 17 dataelements).
tags: [cuentas-nacionales, nhwa, subnacional, stock, datos, csv, ops, distribucion]
source_documents:
    - fuentes/cuentas_nacionales_personal_salud.md
data_file: data/nhwa_subnational.csv
timestamp: 2026-07-15T00:00:00-05:00
---

# Dataset NHWA Subnacional — Stock desagregado

## Ubicación del archivo

```
data/nhwa_subnational.csv
```

Archivo CSV del CORE empaquetado con la extensión y accesible mediante la ruta virtual de solo lectura `rhs-okf/data/nhwa_subnational.csv`. No se provisiona al workspace. **No vectorizado**: el agente lo lee con código (R/Python) cuando necesita análisis territorial.

## Dimensiones

- **Filas**: ~7.752
- **Cobertura**: 14 países con desagregación subnacional
- **Unidades territoriales**: 266 (provincias, estados, departamentos)
- **Años**: 2017 a 2024 (8 periodos)
- **Indicador**: 1.02 (Stock subnacional)
- **Dataelements**: 17 (stocks por profesión)

## Columnas del CSV

| Columna                | Tipo   | Descripción                                                                       |
| ---------------------- | ------ | --------------------------------------------------------------------------------- |
| `Module`               | int    | Siempre `1`                                                                       |
| `Indicator`            | string | Siempre `1.02` (stock subnacional)                                                |
| `dataelement`          | string | Nombre técnico (ej. `NHWA_Medical Doctors Stock (Subnational)`)                   |
| `period`               | int    | Año (2017-2024)                                                                   |
| `orgunit`              | string | Código subnacional (formato `<PAIS>-4-<N>`, ej. `ARG-4-1`, `PER-4-7`, `DOM-4-10`) |
| `categoryoptioncombo`  | string | Generalmente `default`                                                            |
| `attributeoptioncombo` | string | Generalmente `default`                                                            |
| `value`                | string | Valor numérico (stock)                                                            |
| `storedby`             | string | Usuario que registró el dato                                                      |
| `lastupdated`          | string | Fecha de última actualización                                                     |
| `comment`              | string | Notas                                                                             |
| `Country`              | string | Código ISO-3 del país padre (ARG, BRA, PER, etc.)                                 |

## Países con datos subnacionales (14)

ARG, BOL, BRA, CAN, COL, CUB, DOM, GTM, GUY, HND, PAN, PER, SLV, URY

## Convención de códigos subnacionales

El formato es `<PAIS>-4-<N>` donde:

- `<PAIS>` = código ISO-3 del país
- `4` = nivel administrativo (subnacional)
- `<N>` = identificador de la unidad territorial (provincia, estado, departamento)

Ejemplos:

- `ARG-4-1` → Buenos Aires, Argentina
- `ARG-4-21` → Provincia específica de Argentina
- `PER-4-7` → Departamento específico de Perú
- `DOM-4-10` → Provincia específica de República Dominicana

## Dataelements (17 stocks por profesión)

- `NHWA_Community Health Workers Stock (Subnational)`
- `NHWA_Medical Doctors Stock (Subnational)`
- `NHWA_Medical doctors not further defined Stock (Subnational)`
- `NHWA_General Medical Practitioners Stock (Subnational)`
- `NHWA_Specialist Medical Practitioners Stock (Subnational)`
- `NHWA_Nursing Personnel Stock (Subnational)`
- `NHWA_Nursing Professionals Stock (Subnational)`
- `NHWA_Nursing Associate Professionals Stock (Subnational)`
- `NHWA_Nurses not further defined Stock (Subnational)`
- `NHWA_Midwifery personnel Stock (Subnational)`
- `NHWA_Midwifery Professionals Stock (Subnational)`
- `NHWA_Midwifery Associate Professionals Stock (Subnational)`
- `NHWA_Midwives not further defined Stock (Subnational)`
- `NHWA_Dentists Stock (Subnational)`
- `NHWA_Pharmacists Stock (Subnational)`
- `NHWA_Physiotherapists Stock (Subnational)`
- `NHWA_Psychologists Stock (Subnational)`

## Casos de uso principales

- **Análisis de inequidad geográfica**: comparar densidad de personal entre capital y provincias
- **Identificación de zonas desatendidas**: provincias con stock muy bajo de profesionales
- **Planificación territorial**: distribución de plazas, atracción y retención rural
- **Mapas de calor**: visualización geoespacial de la distribución del personal
- **Análisis de especialistas vs generalistas**: composición a nivel local

## Cómo consultar el dato

```python
import pandas as pd
df = pd.read_csv("data/nhwa_subnational.csv")
# Stock de médicos por provincia en Argentina, 2024
result = df[(df["Country"] == "ARG") &
            (df["dataelement"] == "NHWA_Medical Doctors Stock (Subnational)") &
            (df["period"] == 2024)]
print(result[["orgunit", "value"]].sort_values("value", ascending=False))
```

## Relación con otros conceptos

- [Mapa semántico del ecosistema NHWA](/cuentas_nacionales/mapa_semantico_nhwa.md) — claves y límites para relacionar el nivel subnacional con población y división territorial
- [Ecosistema de datos NHWA](/cuentas_nacionales/ecosistema_datos_nhwa.md) — concepto padre
- [Dataset Module 1 (nacional)](/cuentas_nacionales/dataset_module1.md) — los mismos stocks a nivel país
- [Indicadores clave de RHS — Distribución geográfica](/indicadores/indicadores_clave.md) — cómo se usan para análisis de equidad
- [Atraer y retener personal en zonas rurales (DocumentoFuente)](/fuentes/atraer_retener_zonas_rurales.md) — política de retención rural

## Trazabilidad

- Archivo fuente: `data/nhwa_subnational.csv`
- Fuente institucional: OPS/OMS — NHWA Module 1, indicador 1.02 (subnacional)
- Data steward: Benjamin Puertas (HSS/OPS)
