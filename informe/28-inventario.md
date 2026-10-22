[← Anterior](27-cfg-gitops-k8s.md) · [Índice](../README.md) · [Siguiente →](29-matriz.md)

# Inventario funcional de Grafana Cloud por dominio

*Sección 16 · página 29 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Lo que una integración existente promete no equivale a que todas las funcionalidades relacionadas queden habilitadas. Para cada una se indica qué datos necesita, qué parte ocurre en el collector y cuál en el backend. Los detalles de producto no revisados a fondo se marcan como no confirmados.

### A y B. Infraestructura y Kubernetes

| Funcionalidad | Qué ofrece | Datos y requisitos | Collector o backend | Alloy | Contrib |
| --- | --- | --- | --- | --- | --- |
| Monitoreo de hosts y VMs | Métricas de sistema, dashboards y alertas | Exporters (`node`, `windows`) con etiquetas de entorno | Collector recolecta; backend almacena y alerta | `prometheus.exporter.unix` y `.windows` ✅ | `hostmetrics` ✅ |
| Kubernetes Monitoring | Visibilidad de clúster, nodo, namespace, pod y contenedor con métricas, logs y eventos | `cluster` único; chart de Alloy ✅ | Mixto | Chart con Fleet integrado, alertas incluidas ✅ | Receivers OTel: CPU, memoria, eventos y logs, sin alertas ✅ |
| Cardinalidad en Kubernetes | Control de series | Relabeling en origen; Adaptive Metrics | Mixto | `prometheus.relabel` ✅ | `filter`, `transform` ✅ |
| Auto-instrumentación | Instrumentar sin tocar código | OTel Operator o Instrumentation Hub | Fuera del collector | Instrumentation Hub y SDK injection ⚠️ | Operator 🟡 |

### C y D. Application Observability y gestión de telemetría

| Funcionalidad | Qué ofrece | Datos y requisitos | Collector o backend | Alloy | Contrib |
| --- | --- | --- | --- | --- | --- |
| Application Observability | Catálogo de servicios, RED, mapa de servicios, correlación | Trazas OTLP, `service.name`, `deployment.environment`, span metrics y `target_info` ✅ | Backend genera span metrics por defecto | Alloy o Collector envían OTLP ✅ | Igual ✅ |
| Span Metrics y Service Graphs | Métricas desde spans | Ver sección 10 | Cualquiera de los dos | `otelcol.connector.spanmetrics` y `.servicegraph` ✅ | Conectores upstream ✅ |
| Fleet Management | Inventario, configuración remota, salud | Token `set:*-data-write`; disponibilidad según el plan contratado ⚠️ | Backend | `remotecfg` ✅ | OpAMP Supervisor ✅ |
| Adaptive Telemetry | Reducir y agregar datos no usados (métricas, logs, trazas) | Datos en Grafana Cloud; sin cambio en el collector | Backend | Sin cambios | Sin cambios |
| Gestión de cardinalidad | Uso de series por grupos | Etiquetas de equipo y de unidad organizativa | Backend | Etiquetas en origen | Etiquetas en origen |

### E. Observabilidad avanzada

| Funcionalidad | Qué ofrece | Datos y requisitos | Collector o backend | Alloy | Contrib |
| --- | --- | --- | --- | --- | --- |
| Perfiles continuos | Perfiles con correlación a trazas | Perfiles eBPF, Java o scrape | Collector recolecta | `pyroscope.ebpf`, `.java`, `.scrape` ✅ | Sin equivalente en el catálogo verificado ✅ |
| Database Observability | Visibilidad de consultas | Acceso a la base de datos | Collector | `database_observability.*` ✅ | Receivers SQL con alcance menor 🟡 |
| Frontend Observability | RUM con Faro | SDK Faro | Collector o directo | `faro.receiver` ✅ | Receiver `faro` ✅ |
| SLOs, alertas e IRM | Objetivos, alertas y guardias | Métricas en Grafana Cloud | Backend | Sin diferencia | Sin diferencia |
| Grafana Assistant y Knowledge Graph | IA y topología | Telemetría en Grafana Cloud | Backend | Sin diferencia | Sin diferencia |

Los detalles de SLOs, IRM, Assistant y Knowledge Graph no se revisaron a fondo en esta investigación ⚠️.

### F y G. Nubes y gestión

| Funcionalidad | Qué ofrece | Datos y requisitos | Collector o backend | Alloy | Contrib |
| --- | --- | --- | --- | --- | --- |
| Cloud Provider Observability (AWS y Azure) | Métricas de CloudWatch y Azure Monitor sin agente | Rol IAM con `external_id`; credencial de Service Principal en Azure ✅ | Backend | Alternativa con exporters embebidos ✅ | Receivers `awscloudwatch` y `azure_monitor` ✅ |
| GitOps y Terraform | Configuración y recursos como código | Providers de Grafana; Action de sync de Fleet ✅ | Fuera del collector | Pipelines en Git | Pipelines en Git |
| Helm y Operator | Despliegue de agentes | Charts oficiales | Fuera del collector | Chart de Alloy y de Kubernetes Monitoring ✅ | Chart de OTel y Operator ✅ |
| Dashboards y alertas como código | Reproducibilidad | Git Sync, Foundation SDK, Grafana Operator ✅ | Backend | Sin diferencia | Sin diferencia |
| RBAC, tenants y secretos | Acceso por roles y access policies; secretos con Terraform | Dos roles de Fleet Management por stack; stacks separados para aislamiento ✅ | Backend | Sin diferencia | Sin diferencia |
| Monitoreo del pipeline | Salud de colectores | Pipelines `self_monitoring_*` ✅ | Mixto | `prometheus.exporter.self` y UI ✅ | Métricas en 8888 y zPages ✅ |

---
[← Anterior](27-cfg-gitops-k8s.md) · [Índice](../README.md) · [Siguiente →](29-matriz.md)
