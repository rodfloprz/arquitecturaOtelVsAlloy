[← Anterior](16-loadbalancing.md) · [Índice](../README.md) · [Siguiente →](18-kubernetes.md)

# Span metrics: generarlas en el collector o en Grafana Cloud

*Sección 10 · página 18 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Por defecto, Application Observability genera span metrics y service graphs en Grafana Cloud con el metrics-generator de Tempo. Generarlas en el collector solo se justifica por portabilidad o por control del volumen de series, y exige una configuración que preserve los nombres y etiquetas que la aplicación espera.

> **Nota.** Span Metrics (RED por operación), Service Graphs (relaciones cliente-servidor) y Application Observability (las vistas) son cosas distintas. Habilitar las dos primeras es necesario para las vistas, pero no suficiente: también hacen falta los atributos de recurso y el etiquetado correcto.

### Qué consume Application Observability ✅

| Métrica | Obligatoria | Origen en Grafana Cloud (Tempo) | Origen en Alloy o Collector (v0.109 o posterior; Alloy v1.5.0 o posterior) |
| --- | --- | --- | --- |
| Inventario de servicios | Sí | `traces_target_info` | `target_info` |
| Duración y volumen de spans | Sí | `traces_spanmetrics_latency` y `traces_spanmetrics_calls_total` | `traces_span_metrics_duration_seconds` y `traces_span_metrics_calls_total` |
| Mapa de servicios | No | `traces_service_graph_request_*` | `traces_service_graph_request_*` |

Etiquetas comunes: `job` (`service.namespace/service.name`), `deployment_environment`, `span_kind`, `status_code`, `span_name`. Las métricas de service graph no llevan `job`: Application Observability lo infiere de otras métricas. Para identificar hosts, la herramienta usa `k8s.node.name`, `host.id` o `grafana.host.id`.

### Comparación de estrategias

| Dimensión | Generar en el collector (conectores) | Generar en Grafana Cloud (metrics-generator) |
| --- | --- | --- |
| Estado y mantenimiento | `otelcol.connector.spanmetrics` y `servicegraph` en Alloy; conectores upstream; el de service graph sigue recibiendo mejoras en v0.163.0 ✅. Estabilidad upstream de spanmetrics no verificada ⚠️ | Servicio administrado |
| Integración con las vistas | Funciona si se respetan nombres y etiquetas | Nativa; es la fuente por defecto |
| Atributos de recurso | Deben viajar al collector antes de generar | Los toma de las trazas recibidas |
| Histogramas, dimensiones y cardinalidad | Controlables con `dimensions` y límites del conector; el impacto son series activas | Controlado por Grafana |
| Consistencia con trazas | Si se generan antes del muestreo, reflejan el 100 % del tráfico aunque la traza no se conserve | Si se muestrea antes de Cloud, las métricas subestiman el tráfico |
| Duplicación | Habilitar ambas fuentes crea dos familias de series con nombres distintos 🟡 | Una sola fuente |
| Disponibilidad histórica | Las métricas conservan su historia aunque las trazas ya no estén disponibles, porque se retienen aparte 🟡 | Igual |
| Recuperación ante fallo del pipeline | Un corte del collector pierde métricas, no las reconstruye | Se regeneran de las trazas que lleguen |
| Cambios de versión | Los nombres cambiaron en tres épocas (`duration_seconds`, `traces_span_metrics_*`) ✅ | Estables por servicio |
| Portabilidad | Alta: son métricas Prometheus de cualquier backend | Baja: dependen de Grafana Cloud |
| Troubleshooting | Métricas internas `otelcol_*` y live debugging en Alloy | Menos visibilidad 🟡 |
| Volumen de series | Series activas en Metrics | Generación opt-in; se puede desactivar si se usa otra fuente ✅ |

### Efecto del muestreo

Grafana documenta que, si el muestreo ocurre antes de Grafana Cloud, Cloud deja de ver todo el flujo y no puede construir métricas contando trazas; con Adaptive Traces se envía el 100 % por defecto para conservar ese contexto ✅. Con generación en collector antes del muestreo se evita el problema, pero se necesita un pipeline con balanceo por servicio para no tener colisiones de etiquetas.

### Recomendación por escenario

| Escenario | Estrategia | Razón |
| --- | --- | --- |
| Máxima integración nativa con Grafana Cloud | Generar en Cloud; opcional service graph en Cloud | Fuente por defecto, menos piezas y nombres soportados |
| Máxima portabilidad entre backends | Generar en el collector con conectores, respetando nombres de Application Observability | Métricas Prometheus portables; la configuración sigue en Git |
| Mínimo volumen de ingesta y complejidad | Generar en Cloud y activar service graph solo donde se use; mantener muestreo en Adaptive Traces | Evita series duplicadas y un pipeline adicional; la generación es opt-in y medible |

*Fuentes: [métricas y etiquetas requeridas](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-applications/application-observability/setup/metrics-labels.md), [configurar la fuente de span metrics](https://www.grafana.com/docs/grafana-cloud/monitor-applications/application-observability/manual/configure), [muestreo multinivel](https://grafana.com/docs/grafana-cloud/adaptive-telemetry/adaptive-traces/guides/multi-tier-sampling-trace-state/).*

---
[← Anterior](16-loadbalancing.md) · [Índice](../README.md) · [Siguiente →](18-kubernetes.md)
