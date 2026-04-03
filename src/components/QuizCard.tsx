import React from 'react';
import { Quiz } from '../types';
import { useLang } from '../store/LangContext';
import { Badge, Card } from './ui';
import { BookOpen, Clock, BarChart2, Globe, Lock, Trash2 } from 'lucide-react';

interface QuizCardProps {
  quiz: Quiz;
  onClick?: () => void;
  onDelete?: () => void;
  onTogglePublish?: () => void;
  showActions?: boolean;
}

const difficultyVariant = (d: string): 'success' | 'warning' | 'danger' => {
  if (d === 'easy') return 'success';
  if (d === 'hard') return 'danger';
  return 'warning';
};

export const QuizCard: React.FC<QuizCardProps> = ({ quiz, onClick, onDelete, onTogglePublish, showActions }) => {
  const { t } = useLang();
  const diffLabel: Record<string, string> = { easy: t.easy, medium: t.medium, hard: t.hard };

  return (
    <Card onClick={onClick} className="p-5 space-y-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 flex-1">{quiz.title}</h3>
        <div className="flex gap-1 flex-shrink-0">
          <Badge variant={difficultyVariant(quiz.difficulty)}>{diffLabel[quiz.difficulty] ?? quiz.difficulty}</Badge>
          {quiz.isPublic ? <Badge variant="info"><Globe className="h-3 w-3" /></Badge> : <Badge><Lock className="h-3 w-3" /></Badge>}
        </div>
      </div>

      {quiz.description && <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">{quiz.description}</p>}

      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><BookOpen className="h-3.5 w-3.5" />{quiz.questions.length} {t.questions}</span>
        <span className="flex items-center gap-1"><BarChart2 className="h-3.5 w-3.5" />{quiz.topic}</span>
        <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{t.by} {quiz.author}</span>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-1 border-t border-slate-100 dark:border-slate-700" onClick={e => e.stopPropagation()}>
          {onTogglePublish && (
            <button onClick={onTogglePublish} className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${quiz.isPublic ? 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700' : 'text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'}`}>
              {quiz.isPublic ? <><Lock className="h-3 w-3" />{t.unpublish}</> : <><Globe className="h-3 w-3" />{t.publish}</>}
            </button>
          )}
          {onDelete && (
            <button onClick={onDelete} className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors ml-auto">
              <Trash2 className="h-3 w-3" />{t.deleteQuiz}
            </button>
          )}
        </div>
      )}
    </Card>
  );
};
