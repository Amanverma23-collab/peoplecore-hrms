import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  index?: number;
}

export default function StatCard({ title, value, subtitle, icon, color, index = 0 }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="neu-raised p-4 sm:p-5"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm text-neu-muted mb-1">{title}</p>
          <p className="text-lg sm:text-2xl font-bold text-neu-text truncate">{value}</p>
          {subtitle && <p className="text-xs text-neu-subtle mt-1">{subtitle}</p>}
        </div>
        <div className={`p-2.5 rounded-xl ${color}`} style={{boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.1), inset -2px -2px 4px rgba(255,255,255,0.5)'}}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
}