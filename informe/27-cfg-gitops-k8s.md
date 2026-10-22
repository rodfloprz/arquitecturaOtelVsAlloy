[← Anterior](26-cfg-logs-trazas.md) · [Índice](../README.md) · [Siguiente →](28-inventario.md)

# Ejemplos de configuración: integración con Grafana Cloud, Kubernetes y GitOps

*Sección 15 · página 28 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

### 9. Pipeline con muestreo y procesamiento de recursos (Contrib, nivel 2)

```yaml
processors:
  memory_limiter: { check_interval: 1s, limit_percentage: 80 }
  k8sattributes: { extract: { metadata: [k8s.namespace.name, k8s.pod.name, k8s.node.name] } }
  resource/env:
    attributes:
      - { key: deployment.environment, value: "${env:OBS_ENVIRONMENT}", action: upsert }
  tail_sampling:
    decision_wait: 30s
    num_traces: 100000
    policies:
      - { name: drop-health, type: drop, drop: { drop_sub_policy: [ { name: health, type: string_attribute, string_attribute: { key: url.path, values: ["/health", "/ready"] } } ] } }
      - { name: errors, type: status_code, status_code: { status_codes: [ERROR] } }
      - { name: baseline, type: probabilistic, probabilistic: { sampling_percentage: 10 } }
  batch: {}
```

### 10. Integración con Grafana Cloud por OTLP (Alloy)

```alloy
otelcol.auth.basic "cloud" {
  username = sys.env("GCLOUD_OTLP_USER")
  password = sys.env("GCLOUD_RW_API_KEY")
}

otelcol.exporter.otlphttp "cloud" {
  client {
    endpoint = sys.env("GCLOUD_OTLP_URL")
    auth     = otelcol.auth.basic.cloud.handler
  }
}
```

Secretos requeridos: `GCLOUD_OTLP_USER`, `GCLOUD_RW_API_KEY` y `GCLOUD_OTLP_URL`; entran por variable de entorno desde el gestor de secretos y no se versionan.

### 11. Kubernetes con agentes y gateways (valores de Helm, esquema)

```yaml
# Agentes: chart de Kubernetes Monitoring (Alloy) con Fleet Management integrado.
alloy-metrics:  { remoteConfig: { enabled: true }, alloy: { clustering: { enabled: true } } }
alloy-logs:     { remoteConfig: { enabled: true } }
# Gateway de trazas: dos releases separados; nivel 2 como StatefulSet con Service headless.
trace-lb:       { replicaCount: 3, mode: deployment }
trace-sampler:  { replicaCount: 3, mode: statefulset }
# Recursos y límites: medir con carga representativa; memory_limiter cercano al 80 % del límite del pod.
```

Los nombres de las claves del chart varían por versión; copiar la sección `remoteConfig` y las variables de entorno desde la página de configuración de Kubernetes Monitoring de la pila ✅.

### 12. Configuración administrada por GitOps (pipeline de Fleet Management)

```yaml
# .github/workflows/sync-fleet.yaml (esquema; la Action detecta pipelines Alloy y OTel)
name: sync-fleet
on: { push: { branches: [main], paths: ["fleet-pipelines/**"] } }
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: alloy validate fleet-pipelines/profiles/linux-standard.alloy
  sync:
    needs: validate
    environment: fleet-prod          # entorno protegido con revisores
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: grafana/fleet-management-sync-action@v1   # versión a fijar; ver el README de la Action
        with: { url: "${{ vars.FM_URL }}", token: "${{ secrets.FM_TOKEN }}" }
```

El nombre y los parámetros de la Action deben confirmarse en su README, que no se revisó en esta investigación ⚠️.

### Diferencia entre configuración conceptual y lista para producción

| Falta en las plantillas | Qué agregar |
| --- | --- |
| TLS y rotación | Certificados, mTLS entre agentes y gateways, credenciales rotadas |
| Dimensionamiento | Límites de CPU y memoria, `num_traces` y colas medidos con carga |
| Alta disponibilidad | PodDisruptionBudget, anti-afinidad, varias zonas |
| Observabilidad del pipeline | Alertas sobre pérdida de spans, colas y backpressure |
| Sintaxis | Validar nombres de argumentos con `alloy validate` y `otelcol validate` |
| Equivalencias | No hay equivalencia sintáctica automática entre Alloy y YAML; la brecha de `groupbytrace` está documentada arriba |

---
[← Anterior](26-cfg-logs-trazas.md) · [Índice](../README.md) · [Siguiente →](28-inventario.md)
