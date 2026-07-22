"use client";

// SCOPE CALCULATOR -- the client boundary that owns the scope.
//
// It exists so the calculator stage and the send-this-scope form can share ONE
// piece of state: the stage writes it, the form reads it. That is what makes
// "Send this scope to Chad" reliable -- the form always carries the current
// scope as data, with no DOM reach-across and no prefill to drift.

import { useState } from "react";
import { PackageBuilderStage } from "@/components/package-builder/PackageBuilderStage";
import { ScopeSendForm } from "@/components/package-builder/ScopeSendForm";
import { BASELINE, type Scope } from "@/lib/package-builder";

export function ScopeCalculator() {
  const [scope, setScope] = useState<Scope>(BASELINE);

  return (
    <>
      <PackageBuilderStage scope={scope} setScope={setScope} />
      <ScopeSendForm scope={scope} />
    </>
  );
}

export default ScopeCalculator;
