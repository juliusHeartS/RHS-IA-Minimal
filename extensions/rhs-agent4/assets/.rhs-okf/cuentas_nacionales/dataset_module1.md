---
type: BaseDatos
title: Dataset NHWA Module 1 — Stock nacional de personal de salud
description: Estructura y contenido del CSV con datos de stock de personal de salud por país (40 países de las Américas, 2017-2024, 12 indicadores, 253 dataelements).
tags: [cuentas-nacionales, nhwa, module-1, stock, datos, csv, ops]
source_documents:
    - fuentes/cuentas_nacionales_personal_salud.md
data_file: data/nhwa_module1.csv
timestamp: 2026-07-15T00:00:00-05:00
---

# Dataset NHWA Module 1 — Stock nacional

## Ubicación del archivo

```
data/nhwa_module1.csv
```

Archivo CSV del CORE empaquetado con la extensión y accesible mediante la ruta virtual de solo lectura `rhs-okf/data/nhwa_module1.csv`. No se provisiona al workspace. **No vectorizado**: el agente lo lee con código (R/Python) cuando necesita datos concretos.

## Dimensiones

- **Filas**: ~31.030
- **Cobertura**: 40 países y territorios de las Américas
- **Años**: 2017 a 2024 (8 periodos)
- **Indicadores**: 12 (códigos 1.01 a 1.12 + NA)

## Columnas del CSV

| Columna                | Tipo   | Descripción                                                                                                                               |
| ---------------------- | ------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `Module`               | int    | Siempre `1` (Module 1)                                                                                                                    |
| `Indicator`            | string | Código del indicador NHWA (1.01, 1.03, 1.04, ... 1.12)                                                                                    |
| `dataelement`          | string | Nombre técnico del data element (ej. `NHWA_Medical Doctors Stock Total`)                                                                  |
| `period`               | int    | Año (2017-2024)                                                                                                                           |
| `orgunit`              | string | Código ISO-3 del país (ARG, BRA, PER, USA, CAN, MEX, CUB, etc.)                                                                           |
| `categoryoptioncombo`  | string | Dimensión de desagregación (Practising, Licensed to practise, Professionally active, Female, Male, grupos de edad, Foreign Trained, etc.) |
| `attributeoptioncombo` | string | Atributo adicional (generalmente `default`)                                                                                               |
| `value`                | string | Valor numérico (stock)                                                                                                                    |
| `storedby`             | string | Usuario que registró el dato                                                                                                              |
| `lastupdated`          | string | Fecha de última actualización (ISO 8601)                                                                                                  |
| `comment`              | string | Notas o comentarios sobre el dato                                                                                                         |

## Países cubiertos (40)

AIA, ARG, ATG, BHS, BLZ, BMU, BOL, BRA, BRB, CAN, CHL, COL, CRI, CUB, CYM, DMA, DOM, ECU, GRD, GTM, GUY, HND, HTI, JAM, KNA, LCA, MEX, MSR, NIC, PAN, PER, PRY, SLV, SUR, TTO, URY, USA, VCT, VEN, VGB

## Indicadores

| Código | Descripción                                                                            |
| ------ | -------------------------------------------------------------------------------------- |
| 1.01   | Stock por nivel de actividad (Practising, Licensed to practise, Professionally active) |
| 1.03   | Stock por grupo de edad (< 25, 25-34, 35-44, 45-54, 55-64, ≥ 65)                       |
| 1.04   | Stock por sexo (Female, Male)                                                          |
| 1.05   | Stock por lugar de nacimiento (Domestic/Foreign Born)                                  |
| 1.06   | Stock por lugar de formación                                                           |
| 1.07   | Stock por formación en el extranjero (Foreign Trained)                                 |
| 1.08   | Stock por tipo de establecimiento (Hospitals, Ancillary services, etc.)                |
| 1.09   | Stock por titularidad del establecimiento (Public/Private)                             |
| 1.10   | Entradas al mercado laboral (newly active, domestic/foreign trained)                   |
| 1.11   | Salidas del mercado laboral (voluntary/involuntary exit)                               |
| 1.12   | Composición y distribución (source type)                                               |

## Profesiones (253 dataelements)

Los dataelements siguen el patrón `NHWA_<Profesión>_<Dimensión>`:

- **Community Health Workers** — Stock Total, By Activity Level, By Age Group, By Sex, By Place of Birth/Training, By HF Ownership, By Working Facility Type, Contract
- **Medical Doctors** — Stock Total, By Activity Level, By Age Group (Detailed), By Sex, By Place of Birth/Training, foreign trained, By HF Ownership, By Working Facility Type, Contract
- **Generalist Medical Practitioners** (incl. Family) — mismas dimensiones que Medical Doctors
- **Specialist Medical Practitioners** — mismas dimensiones
- **Medical doctors not further defined** — mismas dimensiones
- **Nursing Personnel / Nursing Professionals / Nursing Associate Professionals** — mismas dimensiones
- **Nurses not further defined** — mismas dimensiones
- **Midwifery Personnel / Midwifery Professionals / Midwifery Associate Professionals** — mismas dimensiones
- **Midwives not further defined** — mismas dimensiones
- **Dentists** — mismas dimensiones
- **Pharmacists** — mismas dimensiones
- **Physiotherapists** — mismas dimensiones
- **Psychologists** — stock source type
- **Epidemiologists / Field Epidemiologists** — mismas dimensiones

Adicionalmente hay dataelements de flujo (inflow/outflow):

- `NHWA_Health workforce Started practicing within one year of graduation`
- `NHWA_Health workforce who have voluntary exit from the force`
- `NHWA_Health workforce who have involuntary exit from the force`
- `NHWA_Health workforce number of exits`
- `NHWA_Newly active domestic/foreign trained Health Workforce`
- `NHWA_Vacancy for HWF total/vacant posts`

## Cómo consultar el dato

El agente debe usar sus herramientas de código para leer el CSV. Ejemplo de patrón de uso:

```python
import pandas as pd
df = pd.read_csv("data/nhwa_module1.csv")
# Stock total de médicos en Brasil, 2024, Practising
result = df[(df["orgunit"] == "BRA") &
            (df["dataelement"] == "NHWA_Medical Doctors Stock Total") &
            (df["period"] == 2024) &
            (df["categoryoptioncombo"] == "Practising")]
print(result["value"].values)
```

## Relación con otros conceptos

- [Mapa semántico del ecosistema NHWA](/cuentas_nacionales/mapa_semantico_nhwa.md) — claves y límites para relacionar el nivel nacional con población y datos territoriales
- [Ecosistema de datos NHWA](/cuentas_nacionales/ecosistema_datos_nhwa.md) — concepto padre
- [Dataset Subnacional](/cuentas_nacionales/dataset_subnacional.md) — desagregación provincial de los mismos stocks
- [Indicadores clave de RHS](/indicadores/indicadores_clave.md) — cómo se usan estos datos para diagnóstico
- [Manual NHWA (DocumentoFuente)](/fuentes/cuentas_nacionales_personal_salud.md) — marco metodológico
- [Catálogo HSS](/cuentas_nacionales/catalogo_hss.md) — NHWA es el sistema PAHO-HSS-009

## Trazabilidad

- Archivo fuente: `data/nhwa_module1.csv`
- Fuente institucional: OPS/OMS — National Health Workforce Accounts (NHWA), Module 1
- Data steward: Benjamin Puertas (HSS/OPS)
- Hosting: WHO NHWA platform
