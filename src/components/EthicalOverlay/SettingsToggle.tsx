import { Cog6ToothIcon } from "@heroicons/react/24/solid";

type Props = {
  expanded: boolean;
  setExpanded: (value: boolean) => void;
};

export default function SettingsToggle({ expanded, setExpanded }: Props) {
  return (
    <button
      onClick={() => setExpanded(!expanded)}
      aria-label="Toggle settings"
      className="hover:opacity-80 transition-opacity"
    >
      <Cog6ToothIcon className="w-5 h-5 text-muted-foreground" />
    </button>
  );
}