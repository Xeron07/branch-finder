import { BaseErrorState } from "../shared/BaseErrorState";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export const ErrorState = ({ message, onRetry }: ErrorStateProps) => {
  return (
    <BaseErrorState
      type='error'
      title='Unable to load branches'
      message={message}
      actionLabel='Try Again'
      onAction={onRetry}
    />
  );
};
