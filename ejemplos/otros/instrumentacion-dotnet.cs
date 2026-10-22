// Modelo A. Trazas y métricas por OTLP; el exportador toma el endpoint de OTEL_EXPORTER_OTLP_ENDPOINT.
builder.Services.AddOpenTelemetry()
  .ConfigureResource(r => r.AddService("orders", serviceNamespace: "payments"))
  .WithTracing(t => t.AddAspNetCoreInstrumentation().AddHttpClientInstrumentation().AddOtlpExporter())
  .WithMetrics(m => m.AddAspNetCoreInstrumentation().AddRuntimeInstrumentation().AddOtlpExporter());

// Modelo B. prometheus-net: endpoint /metrics que raspa Alloy o el receiver Prometheus.
app.UseHttpMetrics();
app.MapMetrics();
