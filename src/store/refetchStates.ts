import { create } from "zustand";

// Types
interface RefetchStates {
  refetch: boolean;
  offRefetch: () => void;
  onRefetch: () => void;
}
