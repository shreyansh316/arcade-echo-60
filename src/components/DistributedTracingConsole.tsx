import React, { useState } from "react";
import { Activity, ShieldCheck, Cpu, Terminal, CheckCircle2, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TraceSpan {
  service: string;
  operation: string;
  durationMs: number;
  offsetMs: number;
  status: "OK" | "SLOW";
}

const defaultSpans: TraceSpan[] = [
  { service: "edge-gateway", operation: "POST /api/checkout", durationMs: 2.4, offsetMs: 0, status: "OK" },
  { service: "auth-service", operation: "verify_jwt_claims", durationMs: 7.8, offsetMs: 2.4, status: "OK" },
  { service: "cart-validator", operation: "verify_inventory_locks", durationMs: 5.1, offsetMs: 10.2, status: "OK" },
  { service: "stripe-connector", operation: "create_payment_intent", durationMs: 38.6, offsetMs: 15.3, status: "OK" },
  { service: "license-minter", operation: "generate_cryptographic_license", durationMs: 12.2, offsetMs: 53.9, status: "OK" },
  { service: "kafka-event-bus", operation: "publish_purchase_event", durationMs: 3.2, offsetMs: 66.1, status: "OK" },
  { service: "redis-session", operation: "invalidate_cart_cache", durationMs: 1.5, offsetMs: 69.3, status: "OK" },
];

export const DistributedTracingConsole: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const totalDuration = 70.8;

  return (
    <div className="rounded-2xl bg-[#090714] border border-cyan-500/30 overflow-hidden shadow-lg text-xs font-mono">
      {/* Header */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="p-3.5 bg-black/60 border-b border-white/10 flex items-center justify-between cursor-pointer hover:bg-black/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="font-bold text-white uppercase tracking-wider">
            OpenTelemetry Distributed Trace
          </span>
          <span className="px-2 py-0.2 rounded bg-green-500/20 text-green-300 text-[9px] font-bold">
            TRACE-ID: 7a8f9c1e
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-cyan-300 font-bold">{totalDuration} ms Total Latency</span>
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      {/* Waterfall Visualizer Body */}
      {isOpen && (
        <div className="p-4 space-y-2.5 bg-black/40">
          <div className="flex justify-between text-[10px] text-gray-400 border-b border-white/5 pb-1">
            <span>MICROSERVICE & SPAN</span>
            <span>LATENCY WATERFALL (0ms - 80ms)</span>
          </div>

          <div className="space-y-2">
            {defaultSpans.map((span, i) => {
              const leftPercent = (span.offsetMs / 80) * 100;
              const widthPercent = Math.max(4, (span.durationMs / 80) * 100);

              return (
                <div key={i} className="flex items-center justify-between gap-4">
                  <div className="w-48 truncate flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    <span className="text-gray-300 font-bold">{span.service}:</span>
                    <span className="text-gray-400">{span.operation}</span>
                  </div>

                  <div className="flex-1 h-3.5 bg-white/5 rounded-full relative overflow-hidden">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full"
                      style={{
                        left: `${leftPercent}%`,
                        width: `${widthPercent}%`,
                      }}
                    />
                  </div>

                  <span className="w-16 text-right font-bold text-cyan-300">
                    {span.durationMs} ms
                  </span>
                </div>
              );
            })}
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400">
            <span className="flex items-center gap-1 text-green-400">
              <CheckCircle2 className="w-3 h-3" /> All 7 spans validated with sub-50ms SLA
            </span>
            <span>P99 Target: &lt;100ms</span>
          </div>
        </div>
      )}
    </div>
  );
};
