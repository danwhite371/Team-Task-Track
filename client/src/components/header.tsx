import type { OperationResult } from '@/types';
import { Toggle } from './ui/toggle';

type HeaderProps = {
  handleNewTaskToggle: () => void;
  operationResult: OperationResult | undefined;
};

export default function Header({
  handleNewTaskToggle,
  operationResult,
}: HeaderProps) {
  return (
    <header className="h-10 flex items-center justify-between">
      <span className="font-bold text-slate-600 dark:text-slate-300 text-lg">
        Team Task Track
      </span>
      <div>
        <Toggle onClick={handleNewTaskToggle}>New Task</Toggle>
      </div>
      <div
        data-testid="message"
        className={
          operationResult?.status == 'error'
            ? 'text-destructive'
            : 'text-foreground'
        }
      >
        {operationResult && operationResult.message}
      </div>
    </header>
  );
}
