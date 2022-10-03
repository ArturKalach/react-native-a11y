import type { RefObject } from "react";

import { A11yModule } from "../../modules";
import { arraysEqual } from "../arraysEqual";

export class A11yOrderManager<T> {
  private target: RefObject<T>;

  private current: (T | null)[] = [];

  private inProgress: (T | null)[] = [];

  private registeredRefs: (T | null)[] = [];

  private refWasUpdated = false;

  private componentsWasShown = false;

  constructor(ref: RefObject<T>) {
    this.target = ref;
  }

  registerOrderRef = (order: number) => {
    return (ref: T | null): void => {
      this.refWasUpdated = true;
      this.registeredRefs[order] = ref;
    };
  };

  updateRefList = () => {
    if (!this.refWasUpdated) {
      return;
    }

    this.refWasUpdated = false;
    this.inProgress = this.registeredRefs.filter(v => v);
    this.setOrder();
  };

  setOrder = (force = false) => {
    if (
      !force &&
      (arraysEqual(this.inProgress, this.current) || !this.componentsWasShown)
    ) {
      return;
    }

    A11yModule.setA11yElementsOrder({
      tag: this.target,
      views: this.inProgress,
    });
    this.current = this.inProgress;
  };

  onViewShown = () => {
    this.componentsWasShown = true;
    this.updateRefList();
  };

  reset = () => {
    this.current = [];
    this.inProgress = [];
    this.registeredRefs = [];
    this.refWasUpdated = false;
  };
}
