import { BaseErrorState } from "../shared/BaseErrorState";

interface SearchErrorStateProps {
  message: string;
  onClear: () => void;
}

export const SearchErrorState = ({ message, onClear }: SearchErrorStateProps) => {
  return (
    <BaseErrorState
      type='search-error'
      title='Search failed'
      message={message}
      actionLabel='Clear search'
      onAction={onClear}
    />
  );
};
