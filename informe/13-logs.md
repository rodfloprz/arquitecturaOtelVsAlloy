[← Anterior](12-instrumentacion-ejemplos.md) · [Índice](../README.md) · [Siguiente →](14-logs-decision.md)

# Logs: Logstash, Alloy, OpenTelemetry Collector, Fluent Bit y Vector

*Sección 8 · página 14 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Para un destino principal en Grafana Cloud Logs, Alloy es el único cliente de la lista que Grafana Labs desarrolla y soporta; los demás son clientes comunitarios o de terceros. Eso no demuestra que Alloy sea más rápido ni que consuma menos: no existen benchmarks comparables, y esta página define las pruebas que faltan.

### Lo verificado

- Grafana lista a Alloy como el cliente que desarrolla y soporta para Loki; Fluent Bit, Fluentd, Logstash y Vector se documentan como clientes comunitarios o de terceros y Grafana Labs no puede dar soporte de esos clientes ✅.
- Grafana no recomienda el plugin `logstash-output-loki` en despliegues nuevos y recomienda Alloy ✅.
- Loki ingiere logs OTLP por HTTP de forma nativa ✅; el OTLP endpoint de Grafana Cloud promueve atributos de recurso a etiquetas de logs con una lista configurable aparte de la de métricas ✅.
- `loki.write` de Alloy tiene un bloque `wal` para persistir entradas en disco; sin WAL, un corte largo de Loki puede perder logs al agotarse reintentos y buffers ✅ (fuente comunitaria para el comportamiento).
- Para logs de Kubernetes, `loki.source.podlogs` y `loki.source.kubernetes` leen por la API de Kubernetes y consumen más red y CPU de los kubelets que `loki.source.file` ✅.

### Comparación por criterio

Las celdas sin enlace documental son conocimiento general y están marcadas como 🟡; para decisiones de compra deben validarse en piloto.

| Criterio | Logstash | Alloy | OTel Collector Contrib | Fluent Bit | Vector |
| --- | --- | --- | --- | --- | --- |
| Soporte de Grafana para el cliente | Comunitario | Soportado ✅ | Comunidad; soportado vía Alloy OTel Engine solo para su bundle 🟡 | Comunitario ✅ | Tercero ✅ |
| Buffers y persistencia ante caídas | Colas persistentes y dead letter queue 🟡 | WAL en `loki.write` ✅; colas por componente | Cola con `file_storage` en el exporter ✅ | Buffer en filesystem 🟡 | Buffers en disco 🟡 |
| Backpressure y reintentos | Configurable por pipeline 🟡 | Reintentos con backoff en `loki.write`; `retry_on_http_429` ✅ | `retry_on_failure` y `sending_queue` ✅ | Reintentos por salida 🟡 | Reintentos y buffers 🟡 |
| JSON, multiline y formatos | Grok, JSON y códecs multiline 🟡 | `loki.process` con etapas JSON, regex y multiline 🟡 | `filelog` con operadores de stanza y `transform` ✅ | Parsers y multiline 🟡 | VRL 🟡 |
| Enriquecimiento y redacción | Filtros ricos, scripts 🟡 | `loki.process`; `loki.secretfilter` ✅ | `transform`, `redaction`, `k8sattributes` ✅ | Filtros y Lua 🟡 | VRL 🟡 |
| Logs de Kubernetes | Vía Beats o agente aparte 🟡 | `loki.source.file`, `.kubernetes`, `.podlogs` ✅ | `filelog` con `k8sattributes` ✅ | Input tail con filtro de Kubernetes 🟡 | Fuente Kubernetes 🟡 |
| Archivos, journald, Windows | Beats e inputs 🟡 | `loki.source.file`, `.journal`, `.windowsevent` ✅ | `filelog`, `windows_event_log` (beta desde v0.163) ✅ | Sí 🟡 | Sí 🟡 |
| Red: syslog y otros | Inputs syslog y TCP 🟡 | `loki.source.syslog`, `.api`, `.gelf`, `.kafka` ✅ | `syslog`, `tcplog`, `fluentforward`, `kafka` ✅ | Sí 🟡 | Sí 🟡 |
| OTLP | Limitado 🟡 | Recibe y exporta OTLP ✅ | Nativo ✅ | Plugins OTel 🟡 | Soporte OTLP 🟡 |
| Pipelines existentes de Logstash | Nativo | Reescritura manual | Reescritura manual | Reescritura manual | Reescritura manual |
| Observabilidad del propio colector | Monitoring API 🟡 | UI, métricas, live debugging ✅ | Métricas en el puerto 8888, zPages ✅ | Métricas HTTP 🟡 | Métricas internas 🟡 |
| Madurez y riesgo de upgrades | Proyecto maduro; JVM | Cadencia de minor cada tres semanas ✅ | 0.x con cambios incompatibles frecuentes ✅ | CNCF graduado 🟡 | Mantenido por un tercero 🟡 |
| Throughput, latencia, CPU y memoria | Sin datos comparables | Sin datos comparables | Sin datos comparables | Sin datos comparables | Sin datos comparables |

*Fuentes: [clientes de Loki](https://grafana.com/docs/loki/latest/send-data/), [plugin de Logstash](https://grafana.com/docs/loki/latest/send-data/logstash.md), [loki.source.podlogs](https://grafana.com/docs/alloy/latest/reference/components/loki/loki.source.podlogs.md), [componentes del motor OTel](https://grafana.com/docs/alloy/v1.20/reference/cli/otel.md), [loki.write](https://pkg.go.dev/github.com/grafana/alloy@v1.12.0-rc.3/internal/component/loki/write).*

---
[← Anterior](12-instrumentacion-ejemplos.md) · [Índice](../README.md) · [Siguiente →](14-logs-decision.md)
