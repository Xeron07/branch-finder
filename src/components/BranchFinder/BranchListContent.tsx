import BranchCard from "../BranchCard";
import SkeletonCards from "../SkeletonCards";
import { EmptyState } from "./EmptyState";
import type { Branch } from "../../types";

interface BranchListContentProps {
  loading: boolean;
  branches: Branch[];
  query: string;
  onClear: () => void;
  onBranchSelect: (branch: Branch) => void;
  selectedBranch: Branch | null;
  mobileMode?: boolean;
  onOpenDrawer?: (branch: Branch) => void;
}

export function BranchListContent({
  loading,
  branches,
  query,
  onClear,
  onBranchSelect,
  selectedBranch,
  mobileMode = false,
  onOpenDrawer,
}: BranchListContentProps) {
  if (loading) {
    return <SkeletonCards count={6} />;
  }

  if (branches.length === 0) {
    return <EmptyState query={query} onClear={onClear} />;
  }

  return (
    <>
      {branches.map((branch, i) => (
        <BranchCard
          key={branch.id}
          branch={branch}
          index={i}
          onSelect={onBranchSelect}
          isSelected={selectedBranch?.id === branch.id}
          {...(mobileMode && onOpenDrawer ? { onOpenDrawer } : {})}
        />
      ))}
    </>
  );
}
