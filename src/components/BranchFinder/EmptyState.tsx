import { BaseErrorState } from "../shared/BaseErrorState";

interface EmptyStateProps {
  query: string;
  onClear: () => void;
}

export const EmptyState = ({ query, onClear }: EmptyStateProps) => {
  const message = query
    ? `No results for "${query}". Try a different term.`
    : "No branches match the selected filters.";

  return (
    <BaseErrorState
      type='empty'
      title='No branches found'
      message={message}
      actionLabel='Clear search'
      onAction={onClear}
      actionVariant='secondary'
    />
  );
};
