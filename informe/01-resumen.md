[← Anterior](00-portada.md) · [Índice](../README.md) · [Siguiente →](02-conclusiones.md)

# Resumen ejecutivo

*Sección 1 · página 2 de 36*

> Se recomienda **Grafana Alloy con su motor por defecto como agente estándar**, administrado con Fleet Management, GitOps y Terraform; trazas y tail sampling en un tier de gateways Alloy separado o con Adaptive Traces; OpenTelemetry Collector Contrib solo donde un componente concreto lo exija.

| Indicador | Detalle |
| --- | --- |
| **1,6 de 5** | Complejidad operativa de Alloy; Contrib 2,5; híbrida 3,3 |
| **4,21 de 5** | Puntuación ponderada de Alloy; Contrib 3,49; híbrida 3,72 |
| **82 a 123** | Días-persona de gobierno a 36 meses con Alloy; Contrib 164 a 246 |
| **v0.163.0** | Contrib vigente (14 de octubre de 2026); Alloy v1.21 en la documentación |

### Por qué esta recomendación

- **El entorno es Prometheus-céntrico.** Las métricas de infraestructura llegan por exporters. Alloy trae `prometheus.exporter.*`, descubrimiento y clustering de scrape en el mismo binario; en Contrib la ruta equivalente exige el receiver Prometheus (beta, con funciones de Prometheus que rechaza), Target Allocator y OTel Operator.
- **Fleet Management ya no distingue por agente.** Administra Alloy y OTel Collector (este último por OpAMP con Supervisor). La ventaja de Alloy no es poder administrarlo, sino el onboarding oficial en Kubernetes, el aislamiento entre configuración local y remota y el retorno automático a la última configuración válida.
- **Las funciones de trazas no obligan a Contrib.** Tail sampling (GA en Alloy), balanceo por traceID, spanmetrics y servicegraph existen en el motor estable de Alloy. Lo que Alloy no tiene es una lista corta de componentes (por ejemplo `groupbytrace` y el conector `routing`).
- **Hay funcionalidades de Grafana Cloud que solo se habilitan con Alloy:** Kubernetes Monitoring con alertas, perfiles continuos (eBPF), Database Observability y el chart integrado con Fleet Management.
- **La portabilidad se conserva con disciplina, no con la distribución.** La instrumentación OTLP, las convenciones semánticas y las políticas en Git son portables; la sintaxis del motor por defecto de Alloy no lo es. El motor OTel de Alloy (public preview) es la salida dentro del mismo binario.

### Lo que no se afirma

No hay benchmarks propios de rendimiento. Los esfuerzos son estimaciones. Tres puntos se cierran solo con un piloto: Contrib registrado en Fleet Management dentro de Kubernetes, el comportamiento del Supervisor sin conexión y la disponibilidad y los límites de Fleet Management en el plan contratado.

*Fuentes principales: [OpenTelemetry en Alloy](https://grafana.com/docs/alloy/latest/introduction/otel_alloy/), [arquitectura de Fleet Management](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/fleet-management/introduction/architecture.md), [loadbalancingexporter v0.163.0](https://pkg.go.dev/github.com/open-telemetry/opentelemetry-collector-contrib/exporter/loadbalancingexporter).*

---
[← Anterior](00-portada.md) · [Índice](../README.md) · [Siguiente →](02-conclusiones.md)
