[← Anterior](09-metricas-patrones.md) · [Índice](../README.md) · [Siguiente →](11-instrumentacion.md)

# Ejemplos de configuración para métricas de infraestructura

*Sección 6 · página 11 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Dos configuraciones representativas, con las líneas importantes comentadas. Son plantillas: validarlas con `alloy validate` y `otelcol validate` en la versión elegida antes de usarlas.

### Alloy: exporter embebido, scrape en clúster y remote write

```alloy
// 1. Exporter de Linux embebido en Alloy: no hay proceso node_exporter aparte.
prometheus.exporter.unix "node" { }

// 2. Convierte los targets del exporter en targets raspables y les pone etiquetas del dominio.
discovery.relabel "node" {
  targets = prometheus.exporter.unix.node.targets
  rule {
    target_label = "environment"
    replacement  = sys.env("OBS_ENVIRONMENT")
  }
}

// 3. Descubre pods con la anotación prometheus.io/scrape (Kubernetes).
discovery.kubernetes "pods" { role = "pod" }

// 4. Scrape de los pods. clustering reparte los targets entre las réplicas de Alloy.
//    Las etiquetas de los targets deben ser iguales en todas las réplicas: no usar constants.hostname aquí.
prometheus.scrape "pods" {
  targets    = discovery.kubernetes.pods.targets
  forward_to = [prometheus.remote_write.cloud.receiver]
  clustering { enabled = true }
}

prometheus.scrape "node" {
  targets    = discovery.relabel.node.output
  forward_to = [prometheus.remote_write.cloud.receiver]
}

// 5. Remote write a Grafana Cloud. Credenciales por variable de entorno, nunca en el archivo.
prometheus.remote_write "cloud" {
  endpoint {
    url = sys.env("GCLOUD_PROM_URL")
    basic_auth {
      username = sys.env("GCLOUD_PROM_USER")
      password = sys.env("GCLOUD_RW_API_KEY")
    }
  }
}
```

### OpenTelemetry Collector Contrib: receiver Prometheus con Target Allocator

```yaml
receivers:
  prometheus:
    # Con target_allocator, el receiver pide los targets asignados a este shard.
    target_allocator:
      endpoint: http://otel-ta:80
      interval: 30s
      collector_id: ${env:POD_NAME}
    config:
      scrape_configs:
        - job_name: node-exporter          # nombre estable: se vuelve la etiqueta job
          scrape_interval: 30s
          kubernetes_sd_configs:
            - role: pod
          relabel_configs:
            - source_labels: [__meta_kubernetes_pod_annotation_prometheus_io_scrape]
              regex: "true"
              action: keep
          metric_relabel_configs:
            - source_labels: [__name__]
              regex: "node_(cpu_seconds_total|memory_.*|filesystem_.*)"
              action: keep                 # control de cardinalidad en origen
processors:
  memory_limiter:
    check_interval: 1s
    limit_percentage: 80
  batch: {}
extensions:
  basicauth/grafana:
    client_auth:
      username: ${env:GCLOUD_OTLP_USER}
      password: ${env:GCLOUD_RW_API_KEY}
exporters:
  otlphttp/grafana:
    endpoint: ${env:GCLOUD_OTLP_URL}
    auth:
      authenticator: basicauth/grafana
service:
  extensions: [basicauth/grafana]
  pipelines:
    metrics:
      receivers: [prometheus]
      processors: [memory_limiter, batch]
      exporters: [otlphttp/grafana]
```

### Notas de lectura

- **Etiquetas.** Con OTLP, Grafana Cloud mapea `service.name`, `service.namespace` y `service.instance.id` a `job` e `instance`, y guarda el resto de atributos de recurso en `target_info`; solo promueve a etiquetas un conjunto configurable ✅. Con remote write, las etiquetas de Prometheus llegan intactas.
- **Qué falta para producción.** Tamaños de cola y memoria medidos, TLS hacia los endpoints, límites de series por scrape (`sample_limit`), plantillas por entorno y alertas del propio pipeline.
- **Diferencia conceptual.** En Alloy, el reparto es del clúster de Alloy; en Contrib, lo decide un servicio externo (Target Allocator) que no existe fuera de Kubernetes.

---
[← Anterior](09-metricas-patrones.md) · [Índice](../README.md) · [Siguiente →](11-instrumentacion.md)
