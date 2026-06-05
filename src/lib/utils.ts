import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateEmbedCode(apiKey: string, storeId: string): string {
  return `<script>
  (function(w,d,s,o,f){
    w.CircuitCityAI=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    f=d.getElementsByTagName(s)[0],j=d.createElement(s);j.async=true;
    j.src='https://chatbot.circuitcity.se/widget.js';
    j.dataset.storeId='${storeId}';
    j.dataset.apiKey='${apiKey}';
    f.parentNode.insertBefore(j,f);
  })(window,document,'script','ccai','init');
</script>`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "K";
  return num.toString();
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}