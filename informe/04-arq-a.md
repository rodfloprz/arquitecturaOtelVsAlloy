[← Anterior](03-supuestos.md) · [Índice](../README.md) · [Siguiente →](05-arq-b.md)

# Arquitectura de la opción A: OpenTelemetry Collector Contrib

*Sección 4 · página 5 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> La opción A separa el trabajo en cuatro piezas: agentes por nodo y por VM, scrapers de Prometheus repartidos con Target Allocator, un tier de balanceo por traceID y un tier de muestreo con estado, todo administrado por Git y por Fleet Management con OpAMP.

```mermaid
flowchart TB
  subgraph SRC["Orígenes"]
    direction LR
    APP["Aplicaciones con SDK OTel"]
    EXP["Prometheus exporters"]
    LOGS["Logs: Logstash, archivos, journald"]
  end
  subgraph COL["Recolección con Contrib"]
    direction LR
    DS["DaemonSet otelcol-contrib: filelog, hostmetrics, OTLP"]
    SS["StatefulSet de scrapers: receiver prometheus"]
    TA["Target Allocator del OTel Operator"]
    VMA["VMs: otelcol-contrib con OpAMP Supervisor"]
    TA -.-> SS
  end
  subgraph GW["Gateways"]
    direction LR
    LB["Nivel 1: load_balancing por traceID"]
    SMP["Nivel 2: tail_sampling y spanmetrics"]
    MLG["Sin estado: métricas y logs"]
    LB --> SMP
  end
  GC[("Grafana Cloud")]
  CTRL["Git, Terraform, Argo CD y Fleet Management por OpAMP"]
  SRC --> COL
  COL --> GW
  SMP --> GC
  MLG --> GC
  CTRL -.-> COL
  CTRL -.-> GW
```

### Componentes y su estado ✅

| Pieza | Componente | Estado |
| --- | --- | --- |
| Scrape de Prometheus | Receiver `prometheus` | beta para métricas; rechaza `remote_write`, `remote_read`, `rule_files` y la configuración de alertmanagers |
| Reparto de targets | Target Allocator del OTel Operator | Componente opcional del recurso `OpenTelemetryCollector`; descubre ServiceMonitor y PodMonitor |
| Balanceo | Exportador `load_balancing` (antes `loadbalancing`) | beta trazas y logs, alpha métricas |
| Muestreo | Procesador `tail_sampling` | beta |
| Administración | OpAMP Supervisor con Fleet Management | OpAMP en beta; sin guía oficial de Fleet Management para Kubernetes con Contrib ⚠️ |

### Límites de esta opción

- El Supervisor exige un `supervisor.yaml` por collector y un directorio de storage persistente; en Kubernetes habría que empaquetarlo junto al collector 🟡.
- El receiver Prometheus es un componente con estado: dos réplicas con la misma configuración scrapean dos veces los mismos targets, salvo que el Target Allocator los reparta.
- Kubernetes Monitoring con receivers OTel soporta CPU, memoria, eventos y logs, y no soporta alertas todavía ✅.

*Fuentes: [README del receiver Prometheus](https://github.com/open-telemetry/opentelemetry-collector-contrib/blob/main/receiver/prometheusreceiver/README.md), [loadbalancingexporter](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/loadbalancingexporter), [tailsamplingprocessor](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/processor/tailsamplingprocessor), [Kubernetes con receivers OTel](https://grafana.com/docs/grafana-cloud/observe-and-act/monitor-infrastructure/kubernetes-monitoring/configuration/config-other-methods/otel-collector-receivers.md).*

---
[← Anterior](03-supuestos.md) · [Índice](../README.md) · [Siguiente →](05-arq-b.md)
