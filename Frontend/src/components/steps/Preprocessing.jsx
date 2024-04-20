import HandleNaNValues from './../scripts/HandleNaNValues'
import MissingRowsTable from '../scripts/MissingRowsTable'

export default function Preprocessing() {

  return (
    <div className="flex flex-col space-y-6">
      <HandleNaNValues />
      <MissingRowsTable />
    </div>
  );
}
