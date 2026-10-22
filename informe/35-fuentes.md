[← Anterior](34-esfuerzo.md) · [Índice](../README.md) · [Volver al índice →](../README.md)

# Fuentes consultadas y lo que quedó sin confirmar

*Anexo B · página 36 de 36*

Todas las fuentes se consultaron el 21 de octubre de 2026. «Completa» indica una página abierta íntegra; «Fragmento» indica que solo se vio un extracto en una búsqueda y que las afirmaciones apoyadas en él se tratan con más cautela.

### Fuentes

| Fuente | Qué se tomó | Lectura |
| --- | --- | --- |
| [Introducción a Fleet Management](https://grafana.com/docs/grafana-cloud/send-data/fleet-management/introduction/?pg=asserts) | Dos protocolos, inventario, API | Completa |
| [Arquitectura de Fleet Management](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/introduction/architecture.md) | Alloy y OTel, fusión de configuración, rollout, OpAMP | Completa |
| [Glosario](https://grafana.com/docs/grafana-cloud/send-data/fleet-management/introduction/glossary.md) | Atributos, matchers, versiones | Completa |
| [Onboarding de Alloy](https://grafana.com/docs/grafana-cloud/send-data/fleet-management/set-up/onboard-collectors/standalone-installations.md), [de OTel](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/onboard-collectors/standalone-otel.md), [de Kubernetes](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/onboard-collectors/kubernetes.md) | Registro, scopes, límites de atributos | Completa |
| [GitOps](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/infrastructure-as-code/gitops.md) y [Terraform](https://grafana.com/docs/grafana-cloud/as-code/infrastructure-as-code/terraform/terraform-fleet-management.md) | Action, `SyncPipelines`, recursos y scopes | Completa |
| [RBAC](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/role-based-access-control.md), [límites](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/manage-fleet/collectors/collector-limits.md), [Tenant API](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/api-reference/tenant-api.md) | Roles, topes, ejemplo de límites | Completa |
| [OpenTelemetry en Alloy](https://grafana.com/docs/alloy/latest/introduction/otel_alloy/), [comando otel (v1.20)](https://grafana.com/docs/alloy/v1.20/reference/cli/otel.md) | Motores, estado, bundle de componentes | Completa |
| [tail_sampling en Alloy](https://grafana.com/docs/alloy/latest/reference/components/otelcol/otelcol.processor.tail_sampling/) | GA, políticas, requisito de misma instancia | Completa |
| [loadbalancingexporter v0.163.0](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/loadbalancingexporter) | Claves, resolvers, resiliencia, estabilidad | Completa |
| [Notas de Contrib v0.163.0](https://newreleases.io/project/github/open-telemetry/opentelemetry-collector-contrib/release/v0.163.0) | Versión, cambios incompatibles, componentes nuevos | Completa |
| [Receiver Prometheus](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/prometheusreceiver/README.md) y [tailsamplingprocessor](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/tailsamplingprocessor) | Estado beta, funciones no soportadas | Fragmento |
| [Métricas y etiquetas de Application Observability](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-applications/application-observability/setup/metrics-labels.md) | Nombres y etiquetas requeridas | Completa |
| [Kubernetes con receivers OTel](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-infrastructure/kubernetes-monitoring/configuration/config-other-methods/otel-collector-receivers.md) y [muestreo](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/traces/configure/sampling.md) | Funciones soportadas, Adaptive Traces | Completa |
| [Clustering de Alloy](https://grafana.com/docs/alloy/latest/configure/clustering/distribute-workload/), [Target Allocator](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-operator/cmd/otel-allocator) | Hashing, gossip, descubrimiento de ServiceMonitor | Fragmento |
| [Clientes de Loki](https://grafana.com/docs/loki/latest/send-data/), [plugin de Logstash](https://grafana.com/docs/loki/latest/send-data/logstash.md) | Clientes soportados y recomendación | Fragmento |
| [Formato OTLP](https://grafana.com/docs/grafana-cloud/send-data/otlp/otlp-format-considerations.md), [atributos promovidos](https://grafana.com/docs/grafana-cloud/send-data/otlp/promote-resource-attributes.md) | `job`, `instance`, `target_info` | Fragmento |
| [CloudWatch scrape](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-infrastructure/monitor-cloud-provider/aws/cloudwatch-metrics/config-cw-metric-scrape.md), [Cloud Provider con Terraform](https://grafana.com/docs/grafana-cloud/as-code/infrastructure-as-code/terraform/terraform-cloud-provider-o11y/) | Integración sin agente | Fragmento |
| [CNCF sobre OpAMP](https://www.cncf.io/blog/2026/07/13/operating-opentelemetry-at-scale-with-opamp/) | OpAMP en beta | Fragmento |

### Afirmaciones no confirmadas o inferidas

| Afirmación | Estado | Cómo cerrarla |
| --- | --- | --- |
| Disponibilidad y límites de Fleet Management en el plan | No confirmado | Documentación del plan y `GetLimits` |
| Contrib con Supervisor en Kubernetes registrado en Fleet Management | No confirmado | Piloto |
| Comportamiento del Supervisor sin conexión | Inferido de la especificación upstream | Prueba de corte |
| Despliegue por oleadas nativo | No confirmado | Notas de versión de Fleet Management |
| `grafana_fleet_management_pipeline` con pipelines OTel | No confirmado | Probar en el provider |
| Estabilidad actual de `remotecfg` | Inferido: public preview hasta v1.6 | Referencia de v1.21 |
| Formato de la GitHub Action de Fleet Management | No revisado | README de la Action |
| `groupbytrace` y `routing` ausentes del bundle OTel de Alloy | Inferido de la lista de v1.20.1 | Manifiesto OCB de Alloy |
| Estabilidad upstream de `spanmetrics` y del receiver `azure_monitor` | No verificado | READMEs upstream |
| Identidades administradas de Azure en Alloy y Contrib | No verificado | Piloto de autenticación |
| Instrumentation Hub y SDK injection | Visto solo en el índice de documentación | Documentación de Grafana |
| Fluent Bit y Vector | Conocimiento general y listado de Loki | Pruebas y documentación de cada proyecto |
| Esfuerzos en días-persona | Estimación del analista | Calibrar con el piloto |
| Volúmenes y dimensiones del cliente | Sin datos | Variables de la sección 3 |

---
[← Anterior](34-esfuerzo.md) · [Índice](../README.md) · [Volver al índice →](../README.md)
