import { X } from "lucide-react";

export interface QuestionInfo {
  id: string;
  title: string;
  description: string;
  comingSoon?: boolean;
}

interface QuestionsDialogProps {
  title: string;
  questions: QuestionInfo[];
  onQuestionSelect: (question: QuestionInfo) => void;
  onClose: () => void;
  selectedQuestionId?: string;
}

export function QuestionsDialog({
  title,
  questions,
  onQuestionSelect,
  onClose,
  selectedQuestionId,
}: QuestionsDialogProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b dark:border-slate-700 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-600 dark:text-gray-300" />
          </button>
        </div>
        <div className="p-6 space-y-3">
          {questions.map((question) => (
            <button
              key={question.id}
              onClick={() => {
                if (!question.comingSoon) {
                  onQuestionSelect(question);
                }
              }}
              disabled={question.comingSoon}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                selectedQuestionId === question.id
                  ? "border-blue-600 bg-blue-50 dark:bg-slate-700"
                  : question.comingSoon
                  ? "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800/50 opacity-70"
                  : "border-gray-200 dark:border-slate-700 hover:border-blue-400 dark:hover:border-blue-400"
              }`}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                  {question.title}
                </h3>
                {question.comingSoon && (
                  <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 text-xs font-medium rounded">
                    Coming Soon
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {question.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}