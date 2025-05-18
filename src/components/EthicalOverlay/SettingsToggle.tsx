// renders the ⚙️ icon and toggle logic
import { Cog6ToothIcon } from "@heroicons/react/24/solid";

type Props = {
  expanded: boolean;
  onToggle: () => void;
};

export default function SettingsToggle({ expanded, onToggle }: Props) {
  return (
    <div className="flex justify-between items-center">
      <h2 className="text-xl font-bold">Ethical Info Overlay</h2>
      <button
        onClick={onToggle}
        title="Toggle settings"
        className="hover:text-black text-gray-500"
      >
        <Cog6ToothIcon className="h-5 w-5" />
      </button>
    </div>
  );
}