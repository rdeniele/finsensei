import { useAccounts } from '@/lib/hooks/useAccounts';
import type { FinancialGoal } from '@/types/supabase';
import BaseModal from '@/components/ui/BaseModal';
import { TextInput, Textarea, Select } from '@/components/ui/FormInput';

interface EditGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: FormData) => Promise<void>;
  goal: FinancialGoal;
}

export default function EditGoalModal({ isOpen, onClose, onSubmit, goal }: EditGoalModalProps) {
  const { accounts } = useAccounts();

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="Edit Goal">
      <form action={onSubmit} className="space-y-4">
        <Select
          label="Account"
          name="accountId"
          required
          defaultValue={goal.account_id || ''}
          options={[
            { value: '', label: 'Select an account' },
            ...accounts.map(account => ({
              value: account.id,
              label: account.account_name
            }))
          ]}
        />

        <TextInput
          label="Goal Name"
          name="name"
          required
          defaultValue={goal.name}
          placeholder="e.g., Emergency Fund"
        />

        <Textarea
          label="Description"
          name="description"
          defaultValue={goal.description || ''}
          placeholder="Describe your goal..."
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-gray-500 dark:text-gray-400">$</span>
            <TextInput
              label=""
              type="number"
              name="targetAmount"
              required
              min="0"
              step="0.01"
              defaultValue={goal.target_amount}
              placeholder="0.00"
              className="pl-8"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <TextInput
            label="Start Date"
            type="date"
            name="startDate"
            required
            defaultValue={goal.start_date}
          />

          <TextInput
            label="Target Date"
            type="date"
            name="targetDate"
            required
            defaultValue={goal.target_date}
          />
        </div>

        <div className="flex justify-end space-x-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </form>
    </BaseModal>
  );
} 