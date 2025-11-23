import React from "react";

type Props = {
  title: string;
  children: React.ReactNode;
  onVoteUp?: () => void;
  onVoteDown?: () => void;
};

const DashboardSection: React.FC<Props> = ({
  title,
  children,
  onVoteUp,
  onVoteDown
}) => {
  return (
    <section className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-lg">{title}</h2>
        <div className="flex items-center gap-2 text-sm">
          {onVoteUp && (
            <button
              onClick={onVoteUp}
              className="px-2 py-1 rounded-md border border-emerald-500 hover:bg-emerald-500/10"
            >
              👍
            </button>
          )}
          {onVoteDown && (
            <button
              onClick={onVoteDown}
              className="px-2 py-1 rounded-md border border-rose-500 hover:bg-rose-500/10"
            >
              👎
            </button>
          )}
        </div>
      </div>
      <div>{children}</div>
    </section>
  );
};

export default DashboardSection;
