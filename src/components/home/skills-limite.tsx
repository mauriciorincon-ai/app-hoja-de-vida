"use client";

import { Component, type ReactNode } from "react";

/**
 * Si el escenario no llega (un despliegue nuevo con el HTML viejo abierto, un corte de red), la sección
 * no se cae con la home entera: `next/dynamic` no atrapa el rechazo del `import()`, y sin este límite lo
 * único que lo recibe es `error.tsx`, que reemplaza la página. Aquí el fallo se queda en el escenario y
 * la isla deja la lista, que ya está en el HTML.
 */
export class LimiteDelEscenario extends Component<
  { onFallo: () => void; children: ReactNode },
  { fallo: boolean }
> {
  state = { fallo: false };

  static getDerivedStateFromError() {
    return { fallo: true };
  }

  componentDidCatch() {
    this.props.onFallo();
  }

  render() {
    return this.state.fallo ? null : this.props.children;
  }
}
