[← Anterior](17-spanmetrics.md) · [Índice](../README.md) · [Siguiente →](19-nubes.md)

# Kubernetes: patrones de despliegue y buenas prácticas

*Sección 11 · página 19 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> En Kubernetes, cada señal pide un patrón distinto: agentes por nodo para logs y OTLP local, StatefulSet para scraping repartido, Deployment para eventos de clúster y gateways, y StatefulSet para el nivel de muestreo.

| Función | Patrón | Alloy | Contrib |
| --- | --- | --- | --- |
| Logs de contenedores, métricas de nodo, OTLP local | DaemonSet | `loki.source.file` sobre `/var/log/pods`; preferirlo a `loki.source.podlogs`, que usa la API y más CPU de kubelets ✅ | `filelog`, `hostmetrics`, `kubeletstats` ✅ |
| Scrape de kube-state-metrics y exporters compartidos | StatefulSet con clustering o Target Allocator | `prometheus.scrape` con `clustering` ✅ | Receiver Prometheus con Target Allocator ✅ |
| Eventos y métricas de clúster | Deployment de una réplica | `loki.source.kubernetes_events` ✅ | `k8s_cluster` y `k8sobjects`; no ponerlos en el DaemonSet porque duplican por nodo ✅ |
| Recepción OTLP central | Deployment con Service | `otelcol.receiver.otlp` | `otlp` |
| Balanceo y muestreo de trazas | Deployment (nivel 1) y StatefulSet (nivel 2) con Service headless | `otelcol.exporter.loadbalancing` con resolver `kubernetes` | `load_balancing` con resolver `k8s` |

### Metadatos de Kubernetes y auto-instrumentación

El procesador `k8sattributes` añade metadatos de pod y namespace en ambas distribuciones ✅. Para auto-instrumentación, el OTel Operator ofrece el recurso `Instrumentation` 🟡 y Grafana documenta Instrumentation Hub y SDK injection ⚠️; ambas opciones deben probarse por lenguaje.

### RBAC, red y recursos

- **RBAC mínimo.** Permisos de lectura (`get`, `list`, `watch`) sobre pods, nodos, servicios y EndpointSlice; el resolver del balanceador necesita EndpointSlice o devuelve un caché vacío ✅.
- **Network Policies.** Permitir OTLP en 4317 y 4318 solo desde los agentes; el motor OTel expone métricas en 8888 y el motor por defecto de Alloy sirve su UI en 12345 ✅.
- **Recursos y límites.** Medir con carga representativa; Grafana indica que los valores de sus ejemplos son punto de partida y que `memory_limiter` debe quedar cerca del 80 % del límite de memoria ✅.
- **Alta disponibilidad.** Réplicas con PodDisruptionBudget; para el nivel 2 de trazas, escalar por pasos controlados por la sensibilidad del hashing ✅.
- **Actualizaciones.** Gateways primero, agentes después, con anillos canario por atributo de Fleet Management 🟡.
- **Clústeres grandes.** El número de colectores de Fleet Management crece con los nodos (un colector por nodo en DaemonSets); los singletons cambian de `collector_id` al reiniciar ✅.
- **Separación agentes y gateways.** Los agentes son locales y sin estado; los gateways concentran enrutamiento, muestreo y credenciales hacia Grafana Cloud.

### Qué cambia con el chart de Kubernetes Monitoring

El chart de Grafana despliega Alloy con soporte de Fleet Management integrado desde v2.0 y recomienda v4.1 o posterior; el método con receivers OTel cubre CPU, memoria, eventos y logs, sin alertas ✅.

*Fuentes: [Kubernetes con receivers OTel](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-infrastructure/kubernetes-monitoring/configuration/config-other-methods/otel-collector-receivers.md), [onboarding en Kubernetes](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/onboard-collectors/kubernetes.md), [loadbalancingexporter](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/loadbalancingexporter).*

---
[← Anterior](17-spanmetrics.md) · [Índice](../README.md) · [Siguiente →](19-nubes.md)
