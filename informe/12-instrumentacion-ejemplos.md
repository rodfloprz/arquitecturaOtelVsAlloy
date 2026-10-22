[← Anterior](11-instrumentacion.md) · [Índice](../README.md) · [Siguiente →](13-logs.md)

# Ejemplos representativos por lenguaje

*Sección 7 · página 13 de 36*

<sub>Leyenda: ✅ verificado · 🟡 inferido · ⚠️ no confirmado · 🧪 preview o experimental</sub>

> Los ejemplos muestran el patrón, no versiones fijadas de bibliotecas. Validar las versiones de SDK y de agente contra la matriz de compatibilidad de cada proyecto antes de usarlos.

### Java: agente OTel sin cambios de código, o Micrometer con Prometheus

```bash
# Modelo A. El agente instrumenta HTTP, JDBC y mensajería sin tocar el código.
export OTEL_SERVICE_NAME=checkout
export OTEL_RESOURCE_ATTRIBUTES=service.namespace=payments,deployment.environment=prod
export OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318   # agente local (Alloy o Contrib)
export OTEL_EXPORTER_OTLP_PROTOCOL=http/protobuf
java -javaagent:/opt/otel/opentelemetry-javaagent.jar -jar checkout.jar
```

```yaml
# Modelo B. Spring Boot con Micrometer: el endpoint es scrapeable.
management:
  endpoints.web.exposure.include: prometheus,health
  metrics.distribution.percentiles-histogram.http.server.requests: true
# Dependencia: io.micrometer:micrometer-registry-prometheus
```

### .NET: OpenTelemetry con OTLP, o prometheus-net

```csharp
// Modelo A. Trazas y métricas por OTLP; el exportador toma el endpoint de OTEL_EXPORTER_OTLP_ENDPOINT.
builder.Services.AddOpenTelemetry()
  .ConfigureResource(r => r.AddService("orders", serviceNamespace: "payments"))
  .WithTracing(t => t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation().AddOtlpExporter())
  .WithMetrics(m => m.AddAspNetCoreInstrumentation().AddRuntimeInstrumentation().AddOtlpExporter());

// Modelo B. prometheus-net: endpoint /metrics que raspa Alloy o el receiver Prometheus.
app.UseHttpMetrics();
app.MapMetrics();
```

### Go: SDK de OpenTelemetry, o cliente de Prometheus

```go
// Modelo A. Exportador OTLP por HTTP y recurso con el nombre del servicio.
exp, _ := otlptracehttp.New(ctx)
tp := sdktrace.NewTracerProvider(
    sdktrace.WithBatcher(exp),
    sdktrace.WithResource(resource.NewWithAttributes(semconv.SchemaURL,
        semconv.ServiceName("inventory"))))
otel.SetTracerProvider(tp)

// Modelo B. Cliente de Prometheus con histograma y endpoint /metrics.
dur := prometheus.NewHistogramVec(prometheus.HistogramOpts{
    Name: "http_request_duration_seconds", Buckets: prometheus.DefBuckets}, []string{"route", "code"})
prometheus.MustRegister(dur)
http.Handle("/metrics", promhttp.Handler())
```

### Cuándo instrumentar directamente y cuándo usar un exporter

| Caso | Decisión |
| --- | --- |
| Código propio que se puede modificar | Instrumentar directamente |
| Software de terceros o bases de datos | Exporter: no hay forma de instrumentar el binario |
| Aplicación heredada sin recompilar | Auto-instrumentación por agente (Java, .NET) o eBPF |
| Métricas de negocio | Instrumentación directa con atributos acotados |

### Dónde importa el nombre del recurso

`deployment.environment` y su sucesor `deployment.environment.name` aparecen en la lista de atributos promovidos que Grafana documenta; fijar uno solo en toda la flota y verificar que Application Observability lo reconozca antes de un despliegue amplio 🟡.

---
[← Anterior](11-instrumentacion.md) · [Índice](../README.md) · [Siguiente →](13-logs.md)
