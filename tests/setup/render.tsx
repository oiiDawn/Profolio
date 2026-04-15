// @ts-nocheck
import { StrictMode } from "react";
import { render } from "@testing-library/react";

function Wrapper({ children }) {
  return <StrictMode>{children}</StrictMode>;
}

export function renderWithProviders(ui, options) {
  return render(ui, { wrapper: Wrapper, ...options });
}
