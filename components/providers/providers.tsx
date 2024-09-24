"use client";

import { AxiomWebVitals } from "next-axiom"
// import { Toaster } from "react-hot-toast"
import { AppProgressBar } from 'next-nprogress-bar';
// import { SessionProvider } from "next-auth/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";
import { Provider as BalancerProvider } from "react-wrap-balancer";

import { TooltipProvider } from "@/components/ui/tooltip";
import { ToastProvider } from "@/components/ui/toast";


export function Providers({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      {/* <SessionProvider> */}
        <ToastProvider>
          <BalancerProvider>
            <TooltipProvider delayDuration={0}>
                <AxiomWebVitals />
                <div className="z-50">
                    <AppProgressBar
                    height="4px"
                    color="#666666"
                    options={{ showSpinner: true }}
                    shallowRouting
                    />
                </div>
                {children}
            </TooltipProvider>
          </BalancerProvider>
        </ToastProvider>
      {/* </SessionProvider> */}
    </NextThemesProvider>
  );
}

