import React from "react";
import { Star } from "lucide-react";

export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
  rating?: number;
}

export const TestimonialsColumn = ({
  className = "",
  testimonials,
  duration = 15,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={`relative h-[500px] overflow-hidden ${className}`}>
      <div
        className="flex flex-col gap-4 animate-scroll-up"
        style={{ animationDuration: `${duration}s` }}
      >
        {[...testimonials, ...testimonials].map((t, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-card p-5 shadow-sm backdrop-blur-sm"
          >
            <div className="mb-3 flex gap-0.5">
              {[...Array(t.rating || 5)].map((_, j) => (
                <Star key={j} className="h-3.5 w-3.5 fill-accent text-accent" />
              ))}
            </div>
            <p className="mb-4 text-sm text-muted-foreground leading-relaxed">
              "{t.text}"
            </p>
            <div className="flex items-center gap-3">
              <img
                src={t.image}
                alt={t.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-accent/30"
              />
              <div>
                <p className="text-sm font-semibold text-foreground">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
