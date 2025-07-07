import { Toggle } from './ui/toggle';
import { useAppData } from '@/contexts/app-data-context';

type HeaderProps = {
  handleNewTaskToggle: () => void;
};

export default function Header({ handleNewTaskToggle }: HeaderProps) {
  const { operationResult } = useAppData();
  return (
    <header className="h-10 flex items-center justify-between">
      <span className="font-bold text-slate-600 dark:text-slate-300 text-lg">Team Task Track</span>
      <div>
        <Toggle onClick={handleNewTaskToggle}>New Task</Toggle>
      </div>
      <div
        data-testid="message"
        className={operationResult?.status == 'error' ? 'text-destructive' : 'text-foreground'}
      >
        {operationResult && operationResult.message}
      </div>
    </header>
  );
}
