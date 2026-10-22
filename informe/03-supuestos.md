[← Anterior](02-conclusiones.md) · [Índice](../README.md) · [Siguiente →](04-arq-a.md)

# Supuestos, versiones y metodología

*Sección 3 · página 4 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

### Versiones evaluadas (21 de octubre de 2026)

| Componente | Versión | Evidencia y nota |
| --- | --- | --- |
| Grafana Alloy | Documentación vigente v1.21; la v1.20.1 empaqueta componentes de Collector v0.161.0 | ✅ [referencia del comando otel](https://grafana.com/docs/alloy/v1.20/reference/cli/otel.md). El número exacto de parche más reciente no se confirmó |
| OTel Collector Contrib | v0.163.0, publicada el 14 de octubre de 2026 (módulos v1.2.0/v0.163.0; núcleo v1.69.0) | ✅ [pkg.go.dev](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/loadbalancingexporter), [notas de versión](https://newreleases.io/project/github/open-telemetry/opentelemetry-collector-contrib/release/v0.163.0). Contrib no ha llegado a 1.0: la estabilidad es por componente |
| Motor OTel de Alloy | Public preview; `otel-supervisor` experimental | ✅ [documentación de Alloy](https://grafana.com/docs/alloy/latest/introduction/otel_alloy/) |
| OpAMP | Especificación en beta | ✅ [CNCF, julio de 2026](https://www.cncf.io/blog/2026/07/13/operating-opentelemetry-at-scale-with-opamp/) (fragmento) |
| Fleet Management | Alloy v1.7.2 o posterior recomendado; configuración efectiva reportada con v1.12.0 o posterior; OTel con Supervisor | ✅ [glosario](https://grafana.com/docs/grafana-cloud/send-data/fleet-management/introduction/glossary.md) |
| Chart Kubernetes Monitoring | v2.0 o posterior con Fleet integrado; v4.1 o posterior recomendado | ✅ [onboarding en Kubernetes](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/set-up/onboard-collectors/kubernetes.md) |
| Provider de Terraform de Grafana | 3.19.0 o posterior en el ejemplo oficial | ✅ [guía de Terraform](https://grafana.com/docs/grafana-cloud/as-code/infrastructure-as-code/terraform/terraform-fleet-management.md) |

**Cadencia.** El README del repositorio de Alloy indica un minor cada tres semanas y parches cada una o dos; la documentación de versiones anteriores decía seis semanas. Se toma la fuente más reciente y se declara la contradicción. ✅

### Metodología

- Se leyeron páginas completas de documentación oficial para todo lo que sustenta una recomendación; las que solo se vieron como fragmento de búsqueda se marcan en la página de fuentes.
- «Estable» significa la versión publicada más reciente, no una release candidate. La estabilidad de cada componente se indica por separado.
- No se hicieron pruebas de carga. Cuando faltan datos comparables, se define la prueba necesaria en lugar de afirmar un ganador.
- Alloy y Contrib se comparan a nivel de componente: que Alloy envuelva un componente upstream no implica ausencia de diferencias en etiquetas de estabilidad, parámetros o versión.

### Variables del cliente (no se inventan volúmenes)

| Variable | Qué representa |
| --- | --- |
| N<sub>nodos</sub>, N<sub>VMs</sub> | Nodos de Kubernetes y máquinas virtuales por entorno |
| V<sub>series</sub> | Series activas de métricas |
| V<sub>logs</sub> | GB de logs por día |
| λ<sub>trazas</sub>, d<sub>traza</sub> | Trazas por segundo y duración típica de una traza |
| V<sub>trazas</sub>, r | GB de trazas al mes y fracción conservada tras el muestreo |

### Alcance y límites

Se investigó a fondo: Fleet Management, loadbalancing, tail sampling, receiver Prometheus, Application Observability, clustering de Alloy, logs en Loki y Cloud Provider Observability. Fluent Bit, Vector, SLOs, IRM, Assistant y Knowledge Graph se tratan a nivel de inventario y quedan marcados como no verificados en profundidad.

---
[← Anterior](02-conclusiones.md) · [Índice](../README.md) · [Siguiente →](04-arq-a.md)
