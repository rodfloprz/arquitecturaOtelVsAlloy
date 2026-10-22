[← Anterior](18-kubernetes.md) · [Índice](../README.md) · [Siguiente →](20-fleet.md)

# AWS y Azure: qué usar en cada caso

*Sección 11 · página 20 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> En ambas nubes hay tres caminos para métricas y logs de servicios gestionados: telemetría OTLP desde las aplicaciones, integraciones administradas de Grafana Cloud (sin agente) y servicios nativos con un puente. Cada una responde a una pregunta distinta.

### AWS

| Tema | Recomendación | Evidencia |
| --- | --- | --- |
| EC2 y sistemas operativos | Alloy como servicio con `prometheus.exporter.unix`; `resourcedetection` con detector EC2 para metadatos | ✅ componentes en las listas |
| EKS | Chart de Kubernetes Monitoring; credenciales por rol de la cuenta y no por claves largas | 🟡 |
| CloudWatch y servicios nativos | Cloud Provider Observability sin agente: rol IAM con `external_id` y scrape jobs por región; alternativa con metric streams por Firehose | ✅ |
| Alternativa con agente | `prometheus.exporter.cloudwatch` y `loki.source.awsfirehose` en Alloy; `awscloudwatch` y `awss3` en Contrib | ✅ |
| Métricas de servicios administrados | Preferir la integración administrada a un exporter propio salvo que se necesite control fino | 🟡 |

### Azure

| Tema | Recomendación | Evidencia |
| --- | --- | --- |
| Máquinas virtuales | Alloy como servicio con `prometheus.exporter.windows` o `.unix`; `discovery.azure` | ✅ |
| AKS | Chart de Kubernetes Monitoring | ✅ |
| Azure Monitor | Cloud Provider Observability sin agente con credencial de Service Principal; alternativa `prometheus.exporter.azure` o el receiver `azure_monitor` de Contrib | ✅ |
| Logs de servicios | `loki.source.azure_event_hubs` en Alloy; `azure_event_hub` en Contrib | ✅ |
| Identidades administradas | Alloy lista autenticaciones `basic`, `bearer`, `oauth2`, `sigv4`, `google` y `headers`; no hay componente específico de identidad administrada de Azure en su lista; Contrib puede cubrirlo con otra extensión | ⚠️ validar en piloto |

### Cuándo usar cada camino

| Camino | Úselo cuando |
| --- | --- |
| OTLP | La aplicación es suya y se instrumenta; se quiere trazas, métricas y logs con contexto compartido |
| Prometheus exporters | Es infraestructura, base de datos o software de terceros que no se puede instrumentar |
| Integración administrada de Grafana Cloud | Se quiere métricas de servicios de nube sin operar un agente; el trabajo vive en IAM y Terraform |
| Servicio nativo del proveedor (CloudWatch, Azure Monitor) | La fuente de verdad es el proveedor y la alerta ya vive allí; se integra por scrape job o stream |

### Ventajas del backend frente a las del agente

| Ventaja | Viene de Grafana Cloud (backend) | Viene de elegir Alloy (agente) |
| --- | --- | --- |
| Integraciones administradas de nube sin agente | Sí | No |
| Span metrics y service graphs administrados | Sí | No |
| Adaptive Metrics, Logs y Traces | Sí | No |
| Chart de Kubernetes Monitoring con Fleet integrado | No | Sí |
| `prometheus.exporter.*`, clustering, eBPF y perfiles | No | Sí |
| Database Observability con `database_observability.*` | Parcial | Sí |

*Fuentes: [CloudWatch metrics scrape](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-infrastructure/monitor-cloud-provider/aws/cloudwatch-metrics/config-cw-metric-scrape.md), [Cloud Provider Observability con Terraform](https://grafana.com/docs/grafana-cloud/as-code/infrastructure-as-code/terraform/terraform-cloud-provider-o11y/), [componentes del bundle OTel](https://grafana.com/docs/alloy/v1.20/reference/cli/otel.md), [componentes de Alloy](https://grafana.com/docs/alloy/latest/introduction/otel_alloy/).*

---
[← Anterior](18-kubernetes.md) · [Índice](../README.md) · [Siguiente →](20-fleet.md)
