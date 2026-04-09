import BranchCard from "../BranchCard";
import SkeletonCards from "../SkeletonCards";
import { EmptyState } from "./EmptyState";
import type { Branch, SelectionSource } from "../../types";
import { useEffect, useRef } from "react";

interface BranchListContentProps {
  loading: boolean;
  branches: Branch[];
  query: string;
  onClear: () => void;
  onBranchSelect: (branch: Branch) => void;
  selectedBranch: Branch | null;
  mobileMode?: boolean;
  onOpenDrawer?: (branch: Branch) => void;
  selectionSource?: SelectionSource;
  scrollContainerRef?: React.RefObject<HTMLDivElement>;
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
  selectionSource,
  scrollContainerRef,
}: BranchListContentProps) {
  // Store refs for all branch cards to enable scroll-to-view
  const branchRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Callback to attach ref to each branch card
  const getBranchRef = (id: number) => (el: HTMLDivElement | null) => {
    if (el) {
      branchRefs.current.set(id, el);
    } else {
      branchRefs.current.delete(id);
    }
  };

  // Scroll to selected branch only when selection comes from map
  useEffect(() => {
    if (selectedBranch && selectionSource === 'map') {
      const ref = branchRefs.current.get(selectedBranch.id);
      if (ref) {
        // Use the scroll container if provided, otherwise scroll the element itself
        if (scrollContainerRef?.current) {
          const container = scrollContainerRef.current;
          const containerRect = container.getBoundingClientRect();
          const refRect = ref.getBoundingClientRect();

          // Calculate element's position relative to container's content
          const relativeTop = refRect.top - containerRect.top + container.scrollTop;

          // Center the element in the viewport
          const containerHeight = container.clientHeight;
          const elementHeight = ref.offsetHeight;
          const scrollTop = relativeTop - (containerHeight / 2) + (elementHeight / 2);

          container.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
          });
        } else {
          // Fallback to scrollIntoView if no container ref
          ref.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    }
  }, [selectedBranch, selectionSource, scrollContainerRef]);

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
          ref={getBranchRef(branch.id)}
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
