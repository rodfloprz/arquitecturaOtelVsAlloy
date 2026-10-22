[← Anterior](06-arq-logica.md) · [Índice](../README.md) · [Siguiente →](08-discovery-sin-alloy.md)

# Discovery service: un concepto, seis problemas distintos

*Sección 5 · página 8 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> No existe un único «discovery service» en ninguno de los dos proyectos. Lo que cada uno llama discovery resuelve problemas distintos, y la pregunta útil es cuál de ellos necesita resolver cada capa de la arquitectura.

### Los seis conceptos que no deben mezclarse

| Concepto | Qué decide | Dónde ocurre en Alloy | Dónde ocurre en Contrib |
| --- | --- | --- | --- |
| Service discovery | Qué cargas de trabajo existen | Componentes `discovery.*` (kubernetes, ec2, azure, dns, file, http, consul, docker, kubelet, process, relabel y más) ✅ | Service discovery de Prometheus dentro del receiver `prometheus`; receivers con observers 🟡 |
| Scrape target discovery | Qué endpoints `/metrics` se raspan | `discovery.*` más `prometheus.operator.servicemonitors`, `.podmonitors`, `.probes` y `.scrapeconfigs` ✅ | Receiver `prometheus` con la configuración `scrape_config` completa de Prometheus; Target Allocator para ServiceMonitor y PodMonitor ✅ |
| Collector discovery | Qué instancias de gateway reciben datos | Resolvers de `otelcol.exporter.loadbalancing`: static, dns, kubernetes, aws_cloud_map ✅ | Resolvers del exportador `load_balancing`: static, dns, k8s, aws_cloud_map ✅ |
| Endpoint discovery | Qué direcciones usar para exportar | Mismos resolvers; `discovery.dns` para otros usos | Mismos resolvers; `dns` resuelve un Service headless |
| Collector clustering | Cómo se coordinan las instancias | Bloque `clustering`: gossip, consistencia eventual, activación por componente ✅ | No hay clustering nativo; el reparto lo hace el Target Allocator o el balanceador ✅ |
| Asignación y balanceo de targets | Qué instancia raspa qué target | Hashing consistente local entre pares del clúster ✅ | Target Allocator con estrategias de asignación; el exportador `load_balancing` usa hashing consistente para datos, no para targets ✅ |

### Matriz de capacidades

| Capacidad | Alloy | OpenTelemetry Collector Contrib |
| --- | --- | --- |
| Descubrir pods y servicios de Kubernetes | Nativa: `discovery.kubernetes`, `discovery.kubelet` ✅ | Nativa en el receiver Prometheus (kubernetes_sd); con Target Allocator para reparto ✅ |
| Descubrir VMs en AWS y Azure | Nativa: `discovery.ec2`, `discovery.azure`, `discovery.lightsail` ✅ | Nativa vía ec2_sd y azure_sd del receiver Prometheus 🟡; sin reparto automático fuera de Kubernetes |
| Descubrir Prometheus exporters | Nativa: `discovery.*` más `prometheus.scrape`; exporters embebidos `prometheus.exporter.*` ✅ | Nativa con el receiver `prometheus`; los exporters son procesos aparte |
| Descubrir endpoints de aplicaciones | `discovery.*` y `prometheus.operator.*` ✅ | Receiver Prometheus; observers con receiver_creator 🟡 |
| Descubrir gateways OTel | Resolvers de `otelcol.exporter.loadbalancing` ✅ | Resolvers de `load_balancing`; el resolver `k8s` exige RBAC sobre EndpointSlice ✅ |
| Clustering de collectors | Nativa, explícita por componente ✅ | No existe; requiere Target Allocator (solo Kubernetes) ✅ |
| Asignación de targets | Hashing consistente; etiquetas de targets deben ser idénticas entre nodos ✅ | Target Allocator del OTel Operator ✅ |
| Reglas ServiceMonitor y PodMonitor | `prometheus.operator.servicemonitors` y `.podmonitors` ✅ | Target Allocator ✅ |

Cinco de ocho capacidades son nativas en Alloy sin componente externo; en Contrib, tres son nativas y las restantes dependen del Operator, el Target Allocator o la configuración de Prometheus.

*Fuentes: [lista de componentes de Alloy](https://grafana.com/docs/alloy/latest/introduction/otel_alloy/), [distribución de carga](https://grafana.com/docs/alloy/latest/configure/clustering/distribute-workload/), [Target Allocator](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-operator/cmd/otel-allocator), [receiver Prometheus](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/prometheusreceiver/README.md), [loadbalancingexporter](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/loadbalancingexporter).*

---
[← Anterior](06-arq-logica.md) · [Índice](../README.md) · [Siguiente →](08-discovery-sin-alloy.md)
