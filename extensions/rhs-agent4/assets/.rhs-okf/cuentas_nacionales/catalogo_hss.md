---
type: BaseDatos
title: Catálogo de bases de datos del Departamento de Sistemas y Servicios de Salud (HSS) de la OPS
description: Inventario de 20 sistemas, bases de datos y aplicaciones del departamento HSS de la OPS, con metadatos de gobernanza, hosting, variables y acceso.
tags: [cuentas-nacionales, catalogo, hss, ops, sistemas-informacion, gobernanza-datos]
data_file: data/catalogo_hss.xlsx
timestamp: 2026-07-15T00:00:00-05:00
---

# Catálogo de bases de datos HSS/OPS

## Ubicación del archivo

```
data/catalogo_hss.xlsx
```

Archivo XLSX del CORE empaquetado con la extensión y accesible mediante la ruta virtual de solo lectura `rhs-okf/data/catalogo_hss.xlsx`. No se provisiona al workspace. **No vectorizado**: el agente lo lee con código cuando necesita consultar el inventario de sistemas.

## Qué es

Catálogo oficial del Departamento de Sistemas y Servicios de Salud (HSS) de la OPS. Lista 20 sistemas de información, bases de datos y aplicaciones con sus metadatos de gobernanza: data owner, steward, custodio IT, hosting, URL, derechos de acceso, tipos de variables, niveles de desagregación, frecuencia de reporte y tamaño.

## Estructura del XLSX

- **Hoja**: `PAHO Data Catalog`
- **Filas de datos**: 20 (una por sistema)
- **Columnas**: 23 columnas de metadatos + columnas auxiliares

| Columna                           | Descripción                                                                        |
| --------------------------------- | ---------------------------------------------------------------------------------- |
| Application Name                  | Nombre del sistema                                                                 |
| ID                                | Identificador PAHO-HSS-NNN                                                         |
| Department                        | Departamento (HSS)                                                                 |
| Description                       | Descripción del sistema                                                            |
| Data owner                        | Responsable del dato                                                               |
| Data steward                      | Punto de contacto                                                                  |
| Data Custodian                    | Soporte IT                                                                         |
| Hosting                           | Infraestructura (SQL, MySQL, CouchDB, DHIS2, Power BI, WHO, Excel, Virtual Campus) |
| URL                               | URL de acceso                                                                      |
| Access Rights                     | Public / Internal / Restricted                                                     |
| Search tags                       | Keywords                                                                           |
| Purpose and Thematic Area         | Área temática                                                                      |
| Types of Variables                | Tipo de variables                                                                  |
| Disaggregation Levels             | Niveles de desagregación                                                           |
| Related Database and Denominators | Bases relacionadas                                                                 |
| Reporting Frequency               | Frecuencia de reporte                                                              |
| Size category                     | Small → Extra-Large                                                                |
| Issued Date                       | Fecha de emisión                                                                   |
| Modified Date                     | Fecha de modificación                                                              |

## Sistemas catalogados (20)

| ID           | Nombre                                       | Enfoque                                             | Data Owner           |
| ------------ | -------------------------------------------- | --------------------------------------------------- | -------------------- |
| PAHO-HSS-001 | YouthSpeak360                                | Iniciativa digital juvenil                          | James Fitzgerald     |
| PAHO-HSS-002 | Health Financing Progress Matrix (HFPM)      | Financiamiento en salud                             | James Fitzgerald     |
| PAHO-HSS-003 | Migración y Salud                            | Migración del personal de salud                     | James Fitzgerald     |
| PAHO-HSS-004 | Indicators for Health Systems Based on PHC   | Atención primaria                                   | James Fitzgerald     |
| PAHO-HSS-005 | PERC                                         | Productividad, eficiencia, recursos y costos        | James Fitzgerald     |
| PAHO-HSS-006 | VCE                                          | Calidad de indicadores de salud                     | James Fitzgerald     |
| PAHO-HSS-007 | Essential Public Health Functions (EPHF)     | Funciones esenciales de salud pública               | James Fitzgerald     |
| PAHO-HSS-008 | National Health Accounts                     | Cuentas nacionales de salud                         | James Fitzgerald     |
| PAHO-HSS-009 | **National Health Workforce Account (NHWA)** | Stock, flujo, características del personal de salud | Benjamin Puertas     |
| PAHO-HSS-010 | Health Labor Market Analysis (HLMA)          | Mercado laboral de salud                            | Benjamin Puertas     |
| PAHO-HSS-011 | Directory of Schools of Nursing              | 1.639 escuelas de enfermería                        | Benjamin Puertas     |
| PAHO-HSS-012 | Code of Practice Recruitment                 | Reclutamiento ético de personal                     | Benjamin Puertas     |
| PAHO-HSS-013 | Intelligent Chatbot Help Desk                | Chatbot de ayuda                                    | James Fitzgerald     |
| PAHO-HSS-014 | CLAP MUSA Network                            | Salud materno-neonatal                              | Suzanne Serruya      |
| PAHO-HSS-015 | Red de centros CLAP                          | Salud materna                                       | Suzanne Serruya      |
| PAHO-HSS-016 | Registro anomalías congénitas                | Vigilancia de anomalías                             | Suzanne Serruya      |
| PAHO-HSS-017 | SIP / SIPplus                                | Sistema de información perinatal                    | Suzanne Serruya      |
| PAHO-HSS-018 | Repository of Rare Diseases                  | Enfermedades raras                                  | Suzanne Serruya      |
| PAHO-HSS-019 | Repositorio Mortalidad Materna Extrema       | Mortalidad materna                                  | Suzanne Serruya      |
| (pendiente)  | **RHS-IA**                                   | Plataforma de IA para RHS (en desarrollo)           | HSS (por determinar) |

## RHS-IA en el catálogo

La plataforma **RHS-IA** (este agente) ya está registrada en el catálogo como sistema pendiente de identificador, bajo el departamento HSS, con variables de "Health workforce, demographic, education, labor market, health systems". Esto valida que RHS-Agent es parte oficial de la arquitectura de datos del HSS/OPS.

## Cómo consultar el catálogo

```python
import openpyxl
wb = openpyxl.load_workbook("data/catalogo_hss.xlsx", read_only=True)
ws = wb["PAHO Data Catalog"]
for row in ws.iter_rows(min_row=2, values_only=True):
    name, id_, owner = row[0], row[1], row[4]
    print(f"{id_}: {name} — owner: {owner}")
```

## Relación con otros conceptos

- [Ecosistema de datos NHWA](/cuentas_nacionales/ecosistema_datos_nhwa.md) — concepto padre
- [Dataset NHWA Module 1](/cuentas_nacionales/dataset_module1.md) — NHWA es el sistema PAHO-HSS-009
- [Sistemas de información de RRHH (SIRHS)](/sistemas_informacion_rrhh/index.md) — contexto de los sistemas de información
- [Componentes y gobernanza de SIRHS](/sistemas_informacion_rrhh/sirhs_componentes.md) — gobernanza de datos

## Trazabilidad

- Archivo fuente: `data/catalogo_hss.xlsx`
- Fuente institucional: OPS — HSS Data Catalog (Rev 3, 15-HSS)
- Departamentos con data stewardship: HSS (James Fitzgerald — sistemas de salud; Benjamin Puertas — fuerza laboral; Suzanne Serruya — salud materno-infantil)
