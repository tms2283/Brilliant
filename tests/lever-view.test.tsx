import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LeverPrimitiveSchema } from "../src/schemas/primitive.js";
import { LeverView } from "../src/ui/primitives/LeverView.js";

const lever = LeverPrimitiveSchema.parse({
  id: "lever-view",
  kind: "lever",
  prompt: "Balance the lever.",
  conceptIds: ["mechanics.torque"],
  hint: "Match the torques.",
  explanation: "10 N at 4 m balances 20 N at 2 m.",
  left: { forceN: 20, distanceM: 2, label: "Load" },
  right: { forceN: 10, minM: 0.5, maxM: 5, stepM: 0.1, label: "Effort" },
  answer: 4,
  tolerance: 0.05,
});

describe("lever view", () => {
  it("reports both torques and confirms a balanced position", () => {
    render(
      <LeverView primitive={lever} value={4} onChange={() => undefined} disabled={false} showResult={false} correct={false} />,
    );

    expect(screen.getByText(/20 N x 2 m = 40.00 N m/)).toBeInTheDocument();
    expect(screen.getByText(/10 N x 4.0 m = 40.00 N m/)).toBeInTheDocument();
    expect(screen.getByText("The torques match. The beam is balanced.")).toBeInTheDocument();
  });

  it("sends the effort distance when the slider moves", () => {
    const onChange = vi.fn();
    render(
      <LeverView primitive={lever} value={2} onChange={onChange} disabled={false} showResult={false} correct={false} />,
    );

    fireEvent.change(screen.getByRole("slider", { name: /Effort distance from pivot/ }), {
      target: { value: "3.5" },
    });
    expect(onChange).toHaveBeenCalledWith(3.5);
  });

  it("reveals the balancing distance after a wrong submission", () => {
    render(
      <LeverView primitive={lever} value={2} onChange={() => undefined} disabled showResult correct={false} />,
    );
    expect(screen.getByText(/Place the effort at 4 m from the pivot/)).toBeInTheDocument();
  });
});
