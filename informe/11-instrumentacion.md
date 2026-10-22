[← Anterior](10-metricas-config.md) · [Índice](../README.md) · [Siguiente →](12-instrumentacion-ejemplos.md)

# Instrumentación de aplicaciones: OTLP, Prometheus o ambos

*Sección 7 · página 12 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> OTLP es la opción por defecto para aplicaciones nuevas porque entrega trazas, métricas y logs con el mismo contexto; Prometheus sigue siendo correcto para exporters y para aplicaciones que ya tienen métricas bien instrumentadas, siempre que el nombre del servicio coincida con el modelo de Application Observability.

### Qué exige Application Observability ✅

- Los servicios se identifican con la etiqueta `job`, que es `service.namespace/service.name` o solo `service.name` si no hay namespace.
- `deployment_environment` es obligatoria para que funcionen las líneas base.
- Los paneles RED salen de métricas generadas **desde trazas** (span metrics); una aplicación con solo métricas Prometheus aparece en métricas pero no obtiene mapa de servicios ni desglose por operación.
- Las métricas de runtime de JVM, .NET y Go tienen nombres reconocidos.

### Comparación de modelos

| Criterio | Modelo A: SDK OTel, auto-instrumentación y OTLP | Modelo B: bibliotecas Prometheus y endpoint scrapeable | Híbrido |
| --- | --- | --- | --- |
| RED (rate, errors, duration) | Se derivan de spans (span metrics) o de métricas HTTP de OTel | Se exponen como contadores e histogramas propios | Spans para RED; Prometheus para detalle |
| USE (utilization, saturation, errors) | Métricas de runtime y de host por OTel | Exporters y métricas de runtime de la biblioteca | Exporters para infraestructura |
| Métricas de negocio | `Meter` de OTel con instrumentos estándar | Contadores e histogramas de la biblioteca | Cualquiera; una sola fuente por métrica |
| Trazas distribuidas | Nativas | No existen | Trazas por OTel |
| Correlación señales | Contexto compartido: `trace_id` en logs y exemplars | Requiere exemplars y logs con trace id manuales | Posible, con trabajo |
| Propagación de contexto | W3C Trace Context y baggage | No aplica | OTel |
| Convenciones semánticas | Sí; hay migraciones de nombres entre versiones | Convenciones de Prometheus | Dos vocabularios |
| Histogramas y percentiles | Exponenciales; Grafana Cloud los acepta por defecto ✅ | Clásicos; nativos con soporte de Alloy y del receiver (feature gate) ✅ | Misma decisión por métrica |
| Cardinalidad | Atributos libres: riesgo de series explosivas | Etiquetas declaradas, igual de riesgosas | Revisar en ambos |
| Compatibilidad con Application Observability | Total | Parcial: sin trazas no hay mapa de servicios | Total si hay trazas OTel |
| Auto-instrumentación en Kubernetes | OTel Operator con recurso `Instrumentation` 🟡; Grafana ofrece Instrumentation Hub y SDK injection ⚠️ | No aplica | Sí |
| Migración desde lo existente | Esfuerzo medio; reinstrumentar | Cero | Gradual |
| Vendor lock-in | Bajo: estándar abierto | Bajo: estándar de facto | Bajo |
| Esfuerzo de operación | Menos colectores si todo es OTLP | Un endpoint por proceso y scrape | Más piezas |

### Cuándo elegir cada uno

| Situación | Elección |
| --- | --- |
| Aplicación nueva en Java, .NET o Go | OTLP para trazas, métricas y logs |
| Aplicación existente con métricas Prometheus estables | Conservar Prometheus y **añadir trazas OTel**; alinear `service.name` con el `job` |
| Infraestructura (SO, bases de datos, balanceadores, almacenamiento) | Prometheus exporters |
| Métricas de negocio de alta cardinalidad | Decidir por equipo; limitar atributos en origen |
| Servicios que necesitan correlación completa | OTLP de extremo a extremo |

> **Nota.** No todos los SDKs ni todos los mecanismos de auto-instrumentación ofrecen las mismas capacidades. Java y .NET tienen auto-instrumentación madura; en Go no hay un agente equivalente al de Java y suele requerirse instrumentación explícita o eBPF (Beyla) 🟡. Validar por lenguaje antes de comprometer un alcance.

*Fuentes: [métricas y etiquetas requeridas](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-applications/application-observability/setup/metrics-labels.md), [consideraciones del formato OTLP](https://grafana.com/docs/grafana-cloud/send-data/otlp/otlp-format-considerations.md).*

---
[← Anterior](10-metricas-config.md) · [Índice](../README.md) · [Siguiente →](12-instrumentacion-ejemplos.md)
