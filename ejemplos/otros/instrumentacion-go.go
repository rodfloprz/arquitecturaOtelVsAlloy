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
