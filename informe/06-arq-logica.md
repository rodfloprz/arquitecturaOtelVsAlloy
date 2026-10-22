[← Anterior](05-arq-b.md) · [Índice](../README.md) · [Siguiente →](07-discovery.md)

# Arquitectura lógica recomendada

*Sección 4 · página 7 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> La arquitectura recomendada separa recepción, procesamiento, balanceo y exportación por señal, con Alloy como agente único, un gateway de trazas con dos niveles y un plano de control por Git.

```mermaid
flowchart TB
  subgraph L1["Instrumentación"]
    SDK["SDKs OpenTelemetry: Java, .NET, Go"]
    PROM["Bibliotecas Prometheus existentes y exporters"]
  end
  subgraph L2["Recolección: Alloy, motor por defecto"]
    NODE["Agentes por nodo y por VM: logs, hostmetrics, OTLP local"]
    SCR["Scrapers de métricas con clustering"]
  end
  subgraph L3["Procesamiento"]
    TLB["Trazas, nivel 1: balanceo por traceID"]
    TSM["Trazas, nivel 2: tail sampling"]
    STL["Sin estado: lotes, reintentos, redacción"]
    TLB --> TSM
  end
  subgraph L4["Grafana Cloud"]
    BE["Metrics, Logs, Traces, Adaptive Telemetry"]
    APPO["Application Observability, Kubernetes Monitoring, SLOs, alertas"]
    BE --> APPO
  end
  subgraph L5["Control"]
    GIT["Git y CI: fuente de verdad y aprobación"]
    FM["Fleet Management y Terraform"]
    GIT --> FM
  end
  L1 --> L2
  L2 --> L3
  L3 --> L4
  FM -.-> L2
  FM -.-> L3
```

### Decisiones de diseño

| Decisión | Razón | Evidencia |
| --- | --- | --- |
| Un solo agente por nodo | Menos distribuciones y un solo plano de gestión | ✅ tabla de complejidad en el anexo |
| Balanceo solo para trazas (y logs por traceID cuando se necesite) | Tail sampling exige que todos los spans de una traza lleguen a la misma instancia; las métricas se escalan por sharding de targets, no por balanceo | ✅ |
| Gateway sin estado separado del de muestreo | El muestreo es de memoria; el resto escala por throughput | 🟡 |
| Span metrics en Grafana Cloud por defecto | Es la fuente por defecto de Application Observability y evita generar series en el collector | ✅ |
| Contrib solo ante componente ausente | Evita una segunda distribución sin capacidad nueva | 🟡 |

### Qué cambia por entorno

Producción, preproducción y desarrollo comparten los mismos perfiles de configuración y se diferencian por el atributo `environment` en Fleet Management; el control de acceso por entorno requiere stacks separados porque el RBAC de Fleet Management es por stack.

---
[← Anterior](05-arq-b.md) · [Índice](../README.md) · [Siguiente →](07-discovery.md)
