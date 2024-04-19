import HandleNaNValues from './../scripts/HandleNaNValues'

export default function Preprocessing() {

  return (
    <div className="flex flex-col space-y-6">
      <HandleNaNValues />
    </div>
  );
}
